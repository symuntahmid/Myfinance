/* ==========================================
   MOBILE MONEY SMS READER

   Turns a pasted bKash / Nagad / Rocket / bank
   SMS into a transaction suggestion.

   - Works fully on the device. Nothing is sent
     anywhere.
   - Message formats change over time, so this is
     deliberately tolerant: it looks for the amount,
     the direction (money in or out), the date and
     the transaction ID, and ignores the rest.
   - The user always confirms before saving.
========================================== */

export type ParsedSms = {
  type: "Income" | "Expense";
  amount: number;
  category: string;
  source: string;
  date: string; // yyyy-mm-dd
  note: string;
  trxId?: string;
  provider: string;
};

export type SmsParseFailure =
  | "empty"
  | "no_amount"
  | "unknown_direction"
  | "own_money_move";

export type SmsParseResult =
  | { ok: true; data: ParsedSms }
  | { ok: false; reason: SmsParseFailure };


const BANGLA_DIGITS = "০১২৩৪৫৬৭৮৯";

const CURRENCY = String.raw`(?:Tk\.?|BDT|৳)`;
const NUMBER = String.raw`([\d,]+(?:\.\d+)?)`;


function normalizeDigits(text: string): string {
  return text.replace(/[০-৯]/g, (digit) =>
    String(BANGLA_DIGITS.indexOf(digit))
  );
}


function toNumber(value: string): number {
  return Number(value.replace(/,/g, ""));
}


function pad(value: number): string {
  return String(value).padStart(2, "0");
}


export function todayLocal(): string {
  const now = new Date();

  return `${now.getFullYear()}-${pad(
    now.getMonth() + 1
  )}-${pad(now.getDate())}`;
}


function findDate(text: string): string {
  // 05/11/2026, 05-11-2026, 05.11.2026  (day first)
  const dayFirst = text.match(
    /\b(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})\b/
  );

  if (dayFirst) {
    const day = Number(dayFirst[1]);
    const month = Number(dayFirst[2]);
    const year = Number(dayFirst[3]);

    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return `${year}-${pad(month)}-${pad(day)}`;
    }
  }

  // 2026-11-05
  const yearFirst = text.match(
    /\b(\d{4})-(\d{2})-(\d{2})\b/
  );

  if (yearFirst) {
    const month = Number(yearFirst[2]);
    const day = Number(yearFirst[3]);

    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return `${yearFirst[1]}-${yearFirst[2]}-${yearFirst[3]}`;
    }
  }

  return todayLocal();
}


function findProvider(text: string): string {
  if (/bkash|বিকাশ/i.test(text)) return "bKash";
  if (/nagad|নগদ/i.test(text)) return "Nagad";
  if (/rocket|dbbl/i.test(text)) return "Rocket";
  if (/upay/i.test(text)) return "Upay";
  if (/\bcard\b|visa|mastercard|debited|credited/i.test(text)) {
    return "Bank";
  }

  return "Mobile money";
}


function sourceFor(provider: string, text: string): string {
  if (provider === "Bank") {
    return /card|visa|mastercard/i.test(text)
      ? "💳 Card"
      : "🏦 Bank";
  }

  return "📱 Mobile Banking";
}


function guessExpenseCategory(text: string): string {
  if (/recharge|রিচার্জ|top[\s-]?up/i.test(text)) {
    return "📱 Mobile Recharge";
  }

  if (
    /foodpanda|food\s*panda|pathao\s*food|hungrynaki|restaurant|cafe|kfc|pizza|burger/i.test(
      text
    )
  ) {
    return "🍔 Food";
  }

  if (
    /shwapno|agora|meena|bazar|bazaar|grocery|supermarket|chaldal/i.test(
      text
    )
  ) {
    return "🛒 Supermarket";
  }

  if (
    /pathao|uber|obhai|\b(?:ride|fare|metro|bus|train|rail|ticket)\b/i.test(
      text
    )
  ) {
    return "🚌 Transport";
  }

  if (
    /desco|dpdc|nesco|wasa|titas|electric|gas\s*bill|internet|broadband|wifi|link3|carnival|bill/i.test(
      text
    )
  ) {
    return "💡 Bills";
  }

  if (
    /hospital|clinic|pharmacy|medicine|diagnostic/i.test(text)
  ) {
    return "🏥 Health";
  }

  if (
    /tuition|school|college|university|coaching/i.test(text)
  ) {
    return "📚 Education";
  }

  return "📦 Others";
}


function guessIncomeCategory(text: string): string {
  if (/salary|বেতন/i.test(text)) return "💼 Salary";
  if (/refund/i.test(text)) return "↩️ Refund";

  return "📦 Others";
}


const EXPENSE_WORDS =
  /cash\s*out|ক্যাশ\s*আউট|send\s*money|\bsent\b|পাঠিয়েছেন|payment|পেমেন্ট|\bpaid\b|recharge|রিচার্জ|purchase|debited|withdraw|transfer(?:red)?\s+to|bill\s*pay/i;

const INCOME_WORDS =
  /received|পেয়েছেন|credited|refund|salary|বেতন/i;

// Moving your own money between cash and wallet is not income
// or spending, so we do not record it.
const OWN_MONEY_WORDS =
  /cash\s*in|ক্যাশ\s*ইন|add\s*money|added\s*money/i;

const CASH_OUT_WORDS = /cash\s*out|ক্যাশ\s*আউট/i;


export function parseMobileMoneySms(
  rawText: string
): SmsParseResult {
  const text = normalizeDigits(rawText ?? "").trim();

  if (!text) {
    return { ok: false, reason: "empty" };
  }

  /* ---- fee ---- */

  const feeMatch = text.match(
    new RegExp(
      String.raw`(?:fee|charge)\s*:?\s*${CURRENCY}?\s*${NUMBER}`,
      "i"
    )
  );

  const fee = feeMatch ? toNumber(feeMatch[1]) : 0;

  /* ---- amount (ignore fee / balance numbers) ---- */

  const withoutExtras = text.replace(
    new RegExp(
      String.raw`\b(?:fee|charge|vat|balance|available\s*balance)\b\s*:?\s*${CURRENCY}?\s*[\d,]+(?:\.\d+)?`,
      "gi"
    ),
    " "
  );

  const amountMatch =
    withoutExtras.match(
      new RegExp(
        String.raw`amount\s*:?\s*${CURRENCY}?\s*${NUMBER}`,
        "i"
      )
    ) ??
    withoutExtras.match(
      new RegExp(String.raw`${CURRENCY}\s*${NUMBER}`, "i")
    );

  const amount = amountMatch ? toNumber(amountMatch[1]) : 0;

  if (!amountMatch || !(amount > 0)) {
    return { ok: false, reason: "no_amount" };
  }

  /* ---- direction ---- */

  if (OWN_MONEY_WORDS.test(text)) {
    return { ok: false, reason: "own_money_move" };
  }

  const expenseAt = text.search(EXPENSE_WORDS);
  const incomeAt = text.search(INCOME_WORDS);

  let type: "Income" | "Expense";

  if (expenseAt === -1 && incomeAt === -1) {
    return { ok: false, reason: "unknown_direction" };
  } else if (incomeAt === -1) {
    type = "Expense";
  } else if (expenseAt === -1) {
    type = "Income";
  } else {
    type = incomeAt < expenseAt ? "Income" : "Expense";
  }

  const provider = findProvider(text);
  const source = sourceFor(provider, text);

  const trxMatch = text.match(
    /(?:trx|txn|transaction)\s*(?:id)?\s*[:\-]?\s*([A-Z0-9]{6,})/i
  );

  const trxId = trxMatch ? trxMatch[1].toUpperCase() : undefined;

  const noteParts: string[] = [provider];

  if (trxId) noteParts.push(`TrxID ${trxId}`);

  const date = findDate(text);

  /* ---- cash out: only the fee is a real cost ---- */

  if (CASH_OUT_WORDS.test(text)) {
    if (!(fee > 0)) {
      return { ok: false, reason: "own_money_move" };
    }

    return {
      ok: true,
      data: {
        type: "Expense",
        amount: fee,
        category: "📦 Others",
        source,
        date,
        note: `${noteParts.join(" · ")} · Cash out fee (withdrew ${amount})`,
        trxId,
        provider,
      },
    };
  }

  // The fee is real money spent, so add it to the expense.
  let total = amount;

  if (fee > 0 && type === "Expense") {
    total = Math.round((amount + fee) * 100) / 100;
    noteParts.push(`${amount} + fee ${fee}`);
  }

  return {
    ok: true,
    data: {
      type,
      amount: total,
      category:
        type === "Expense"
          ? guessExpenseCategory(text)
          : guessIncomeCategory(text),
      source,
      date,
      note: noteParts.join(" · "),
      trxId,
      provider,
    },
  };
}
