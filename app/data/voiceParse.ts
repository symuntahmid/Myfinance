/* ==========================================
   VOICE / TEXT PARSER (Bangla + English)

   "আজ রিকশা ত্রিশ টাকা, চা দশ টাকা"
     -> Expense 30 Transport, Expense 10 Food

   Plain rules, runs on the phone. The screen always shows
   what was understood and asks before saving.
========================================== */

export type VoiceEntry = {
  type: "Income" | "Expense";
  amount: number;
  category: string; // exactly the value stored on a transaction
  source: string;
  note: string;
};

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";

const SMALL: Record<string, number> = {};

[
  "শূন্য", "এক", "দুই", "তিন", "চার", "পাঁচ", "ছয়", "সাত", "আট", "নয়",
  "দশ", "এগারো", "বারো", "তেরো", "চৌদ্দ", "পনেরো", "ষোলো", "সতেরো", "আঠারো", "উনিশ",
  "বিশ", "একুশ", "বাইশ", "তেইশ", "চব্বিশ", "পঁচিশ", "ছাব্বিশ", "সাতাশ", "আটাশ", "ঊনত্রিশ",
  "ত্রিশ", "একত্রিশ", "বত্রিশ", "তেত্রিশ", "চৌত্রিশ", "পঁয়ত্রিশ", "ছত্রিশ", "সাঁইত্রিশ", "আটত্রিশ", "ঊনচল্লিশ",
  "চল্লিশ", "একচল্লিশ", "বিয়াল্লিশ", "তেতাল্লিশ", "চুয়াল্লিশ", "পঁয়তাল্লিশ", "ছেচল্লিশ", "সাতচল্লিশ", "আটচল্লিশ", "ঊনপঞ্চাশ",
  "পঞ্চাশ", "একান্ন", "বায়ান্ন", "তিপ্পান্ন", "চুয়ান্ন", "পঞ্চান্ন", "ছাপ্পান্ন", "সাতান্ন", "আটান্ন", "ঊনষাট",
  "ষাট", "একষট্টি", "বাষট্টি", "তেষট্টি", "চৌষট্টি", "পঁয়ষট্টি", "ছেষট্টি", "সাতষট্টি", "আটষট্টি", "ঊনসত্তর",
  "সত্তর", "একাত্তর", "বাহাত্তর", "তিয়াত্তর", "চুয়াত্তর", "পঁচাত্তর", "ছিয়াত্তর", "সাতাত্তর", "আটাত্তর", "ঊনআশি",
  "আশি", "একাশি", "বিরাশি", "তিরাশি", "চুরাশি", "পঁচাশি", "ছিয়াশি", "সাতাশি", "আটাশি", "ঊননব্বই",
  "নব্বই", "একানব্বই", "বিরানব্বই", "তিরানব্বই", "চুরানব্বই", "পঁচানব্বই", "ছিয়ানব্বই", "সাতানব্বই", "আটানব্বই", "নিরানব্বই",
].forEach((word, value) => {
  SMALL[word] = value;
});

// Spelling variations people (and recognisers) use.
const ALIASES: Record<string, string> = {
  "দুটি": "দুই", "দুটো": "দুই", "দু": "দুই", "পনের": "পনেরো", "ষোল": "ষোলো",
  "সতের": "সতেরো", "আঠার": "আঠারো", "উনত্রিশ": "ঊনত্রিশ", "উনচল্লিশ": "ঊনচল্লিশ",
  "উনপঞ্চাশ": "ঊনপঞ্চাশ", "উনষাট": "ঊনষাট", "উনসত্তর": "ঊনসত্তর", "উনআশি": "ঊনআশি",
  "উননব্বই": "ঊননব্বই", "পাচ": "পাঁচ", "পয়ত্রিশ": "পঁয়ত্রিশ", "পচিশ": "পঁচিশ",
  "পঁচিশ": "পঁচিশ", "এক্শ": "একুশ",
};

const ENGLISH: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13,
  fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18,
  nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60,
  seventy: 70, eighty: 80, ninety: 90,
};

const MULTIPLIER: Record<string, number> = {
  শ: 100, শো: 100, hundred: 100,
  হাজার: 1000, thousand: 1000, k: 1000,
  লাখ: 100000, লক্ষ: 100000, lakh: 100000, lac: 100000,
  কোটি: 10000000, crore: 10000000,
};

const CURRENCY = new Set(["টাকা", "টাকায়", "টাকার", "৳", "tk", "taka", "bdt", "টাকা।"]);

const SPLITTERS = new Set(["আর", "এবং", "ও", "and", "then", "আরো", "আরও", "plus"]);

export function toLatinDigits(text: string): string {
  return text.replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)));
}

type Num = { value: number; used: number };

/* Reads a number starting at tokens[start]. Returns null if none. */
function readNumber(tokens: string[], start: number): Num | null {
  let total = 0;
  let current = 0;
  let used = 0;
  let any = false;

  for (let i = start; i < tokens.length; i += 1) {
    let token = tokens[i];

    token = ALIASES[token] ?? token;

    // glued forms: 30টাকা, ৩০০টাকা, 500tk
    const glued = token.match(/^(\d+(?:\.\d+)?)(টাকা|tk|taka|৳)$/i);

    if (glued) {
      current += Number(glued[1]);
      any = true;
      used += 1;
      break;
    }

    if (/^\d+(\.\d+)?$/.test(token)) {
      current += Number(token);
      any = true;
      used += 1;
      continue;
    }

    // Bangla "word + শো" glued, e.g. তিনশো, দুইশ, পাঁচশো
    const hundred = token.match(/^(.+?)(শো|শ)$/);

    if (hundred) {
      const base = ALIASES[hundred[1]] ?? hundred[1];

      if (base in SMALL && SMALL[base] > 0 && SMALL[base] < 10) {
        current += SMALL[base] * 100;
        any = true;
        used += 1;
        continue;
      }

      if (base === "এক" || base === "একশ") {
        current += 100;
        any = true;
        used += 1;
        continue;
      }
    }

    if (token === "দেড়" || token === "দেড") {
      current += 1.5;
      any = true;
      used += 1;
      continue;
    }

    if (token === "আড়াই" || token === "আড়াই") {
      current += 2.5;
      any = true;
      used += 1;
      continue;
    }

    if (token === "সাড়ে" && i + 1 < tokens.length) {
      const first = tokens[i + 1];
      const base = ALIASES[first] ?? first;
      const glued = base.match(/^(.+?)(শো|শ)$/);

      // সাড়ে তিনশো = 350
      if (glued && (ALIASES[glued[1]] ?? glued[1]) in SMALL) {
        current += (SMALL[ALIASES[glued[1]] ?? glued[1]] + 0.5) * 100;
        any = true;
        used += 2;
        i += 1;
        continue;
      }

      const plain = /^\d+(\.\d+)?$/.test(base) ? Number(base) : SMALL[base];

      if (plain !== undefined) {
        const unit = MULTIPLIER[tokens[i + 2] ?? ""];

        if (unit === 100) {
          current += (plain + 0.5) * 100;
          used += 3;
          i += 2;
        } else if (unit) {
          total += (plain + 0.5) * unit;
          used += 3;
          i += 2;
        } else {
          current += plain + 0.5;
          used += 2;
          i += 1;
        }

        any = true;
        continue;
      }
    }

    if (token in SMALL) {
      current += SMALL[token];
      any = true;
      used += 1;
      continue;
    }

    if (token in ENGLISH) {
      current += ENGLISH[token];
      any = true;
      used += 1;
      continue;
    }

    if (token in MULTIPLIER && any) {
      const m = MULTIPLIER[token];

      if (m === 100) {
        current = (current || 1) * 100;
      } else {
        total += (current || 1) * m;
        current = 0;
      }

      used += 1;
      continue;
    }

    break;
  }

  return any ? { value: total + current, used } : null;
}

/* ---------- category words ---------- */

type Rule = { value: string; words: RegExp };

const RULES: Rule[] = [
  { value: "🏠 House", words: /(বাসা|বাড়ি|বাড়ী)\s*ভাড়া|^rent$|house rent/ },
  { value: "🚌 Transport", words: /^(রিক|বাস(ে|ের)?$|সিএনজি|cng|উবার|uber|পাঠাও|pathao|ট্রেন|train|অটো|ট্যাক্সি|taxi|লঞ্চ|ফেরি|পেট্রোল|পেট্রল|অকটেন|ভাড়া|ইয়ারো|যাতায়াত|rickshaw|bus$|fuel|petrol|ride|fare)/ },
  { value: "📱 Mobile Recharge", words: /^(রিচার্জ|ফ্লেক্সি|ডাটা|প্যাকেজ|recharge|flexiload|data$|topup)/ },
  { value: "💡 Bills", words: /^(বিল|বিদ্যুৎ|গ্যাস|পানি|ইন্টারনেট|ওয়াইফাই|ওয়াইফাই|bill|electric|gas$|water$|internet|wifi)/ },
  { value: "📚 Education", words: /^(টিউশন|স্কুল|কলেজ|বই|ফি$|কোচিং|পড়া|পরীক্ষা|tuition|school|college|book|fee|coaching|exam)/ },
  { value: "🏥 Health", words: /^(ওষুধ|ঔষধ|ডাক্তার|হাসপাতাল|চিকিৎসা|টেস্ট|medicine|doctor|hospital|pharmacy|medical)/ },
  { value: "🎮 Entertainment", words: /^(সিনেমা|গেম|খেলা|বিনোদন|ঘুরতে|মুভি|movie|cinema|game|fun|netflix|trip)/ },
  { value: "🍔 Food", words: /^(চা$|চায়|কফি|নাস্তা|নাশতা|খাবার|খাওয়া|লাঞ্চ|ডিনার|রেস্টুরেন্ট|বিরিয়ানি|ভাত|রুটি|পরোটা|সিঙ্গারা|সামুসা|ফুচকা|আইসক্রিম|কোক|জুস|tea|coffee|lunch|dinner|snack|food|biryani|breakfast|juice|restaurant|meal)/ },
  { value: "🛒 Supermarket", words: /^(বাজার|সবজি|সব্জি|মাছ|মাংস|চাল|ডাল|তেল$|ডিম|দুধ|মুদি|bazar|bazaar|grocery|groceries|vegetables|fish$|meat|rice$|market|shopping)/ },
];

const INCOME_RULES: Rule[] = [
  { value: "💼 Salary", words: /^(বেতন|স্যালারি|salary|wage|paid)/ },
  { value: "💻 Freelancing", words: /^(ফ্রিল্যান্স|freelance)/ },
  { value: "🏢 Business", words: /^(ব্যবসা|business|sales$)/ },
  { value: "💰 Pocket Money", words: /^(হাতখরচ|পকেট|pocket)/ },
  { value: "🎁 Gift", words: /^(উপহার|বকশিশ|gift|eidi|সালামি)/ },
  { value: "🏆 Bonus", words: /^(বোনাস|bonus)/ },
  { value: "↩️ Refund", words: /^(ফেরত|refund)/ },
];

const INCOME_WORDS =
  /^(পেলাম|পেয়েছি|পেয়েছি।|আয়|ইনকাম|income|received|got|earned|বেতন|salary|বোনাস|bonus|উপহার|gift|জমা)/;

function sourceOf(tokens: string[]): string {
  const text = tokens.join(" ");

  if (/বিকাশ|বিকাশে|bkash|নগদ অ্যাপ|nagad|রকেট|rocket|upay|উপায়/.test(text)) {
    return "📱 Mobile Banking";
  }

  if (/ব্যাংক|bank|কার্ড|card/.test(text)) return "🏦 Bank";

  return "💵 Cash";
}

const FILLER = new Set([
  "আজ", "আজকে", "গতকাল", "আমি", "আমার", "খরচ", "করলাম", "করেছি", "দিলাম",
  "দিয়েছি", "কিনলাম", "নিলাম", "লাগলো", "লাগল", "গেল", "হলো", "হল", "জন্য",
  "today", "spent", "paid", "bought", "on", "for", "i", "the", "a", "my", "of",
  "taka", "tk", "দিয়ে", "থেকে", "এ", "তে", "টা", "টি", "ে",
]);

function clean(text: string): string[] {
  return toLatinDigits(text.toLowerCase())
    .replace(/(\d),(\d{3})/g, "$1$2")
    .replace(/[।,;:!?"'()]+/g, " , ")
    .replace(/৳/g, " ৳ ")
    .split(/\s+/)
    .filter(Boolean);
}

/* Where the number phrases are inside a run of words. */
function numberSpots(tokens: string[]) {
  const spots: { start: number; used: number }[] = [];

  for (let i = 0; i < tokens.length; ) {
    const found = readNumber(tokens, i);

    if (found && found.value > 0) {
      spots.push({ start: i, used: found.used });
      i += found.used;
    } else {
      i += 1;
    }
  }

  return spots;
}

/* One run of words may hold several amounts. Cut it so each piece has one.
   "৩০ টাকা রিকশা ১০ টাকা চা"  (amount first)
   "রিকশা ৩০ টাকা চা ১০ টাকা"  (item first) */
function splitByNumbers(tokens: string[]): string[][] {
  const spots = numberSpots(tokens);

  if (spots.length <= 1) return [tokens];

  const before = tokens.slice(0, spots[0].start);
  const amountFirst = before.every((word) => FILLER.has(word));

  const pieces: string[][] = [];

  if (amountFirst) {
    spots.forEach((spot, index) => {
      const from = index === 0 ? 0 : spot.start;
      const to = index + 1 < spots.length ? spots[index + 1].start : tokens.length;

      pieces.push(tokens.slice(from, to));
    });

    return pieces;
  }

  let from = 0;

  spots.forEach((spot, index) => {
    let end = spot.start + spot.used;

    if (CURRENCY.has(tokens[end] ?? "")) end += 1;

    const to = index === spots.length - 1 ? tokens.length : end;

    pieces.push(tokens.slice(from, to));
    from = to;
  });

  return pieces;
}

function clauses(tokens: string[]): string[][] {
  const result: string[][] = [];
  let bucket: string[] = [];

  const flush = () => {
    if (bucket.some((token) => token !== ",")) {
      splitByNumbers(bucket).forEach((piece) => result.push(piece));
    }

    bucket = [];
  };

  for (const token of tokens) {
    if (token === "," || SPLITTERS.has(token)) {
      flush();
      continue;
    }

    bucket.push(token);
  }

  flush();

  return result;
}

function classify(
  amount: number,
  words: string[],
  clause: string[]
): VoiceEntry {
  const meaningful = words.filter(
    (word) => !FILLER.has(word) && !CURRENCY.has(word)
  );

  const income = words.some((word) => INCOME_WORDS.test(word));
  const rules = income ? [...INCOME_RULES, ...RULES] : RULES;
  const joined = meaningful.join(" ");

  const hit =
    rules.find((rule) => rule.words.test(joined)) ??
    rules.find((rule) => meaningful.some((word) => rule.words.test(word)));

  return {
    type: income ? "Income" : "Expense",
    amount,
    category: hit?.value ?? "📦 Others",
    source: sourceOf(clause),
    note: meaningful.join(" "),
  };
}

export function parseSpeech(text: string): VoiceEntry[] {
  const found: { amount: number; words: string[]; clause: string[] }[] = [];
  let carry: string[] = []; // words said before the amount in the next piece

  for (const clause of clauses(clean(text))) {
    const spot = numberSpots(clause)[0];

    if (!spot) {
      carry = [...carry, ...clause];
      continue;
    }

    const value = readNumber(clause, spot.start) as Num;

    found.push({
      amount: value.value,
      words: [
        ...carry,
        ...clause.slice(0, spot.start),
        ...clause.slice(spot.start + spot.used),
      ],
      clause: [...carry, ...clause],
    });

    carry = [];
  }

  // Words said after the last amount belong to it ("... টাকা বিকাশে").
  if (carry.length > 0 && found.length > 0) {
    const last = found[found.length - 1];

    last.words = [...last.words, ...carry];
    last.clause = [...last.clause, ...carry];
  }

  return found.map((item) => classify(item.amount, item.words, item.clause));
}
