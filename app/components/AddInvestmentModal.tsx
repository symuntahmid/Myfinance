"use client";

import InvestmentSheet from "@/app/components/invest/InvestmentSheet";

type Props = {
  open: boolean;
  onClose: () => void;
};

// The sheet mounts fresh each time it opens, so the form always starts empty.
export default function AddInvestmentModal({ open, onClose }: Props) {
  return open ? <InvestmentSheet onClose={onClose} /> : null;
}
