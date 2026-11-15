"use client";

import InvestmentSheet from "@/app/components/invest/InvestmentSheet";
import type { Investment } from "@/app/data/investments";

type Props = {
  open: boolean;
  investment: Investment | null;
  onClose: () => void;
};

export default function EditInvestmentModal({ open, investment, onClose }: Props) {
  return open && investment ? (
    <InvestmentSheet key={investment.id} investment={investment} onClose={onClose} />
  ) : null;
}
