"use client";

import TransactionForm from "./TransactionForm";
import { Transaction } from "../data/transactions";

type EditTransactionModalProps = {
  open: boolean;
  transaction: Transaction | null;
  onClose: () => void;
};

export default function EditTransactionModal({
  open,
  transaction,
  onClose,
}: EditTransactionModalProps) {
  if (!transaction || transaction.type === "Transfer") return null;

  return (
    <TransactionForm
      open={open}
      type={transaction.type}
      editingTransaction={transaction}
      onClose={onClose}
    />
  );
}