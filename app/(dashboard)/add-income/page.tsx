import TransactionForm from "../../components/TransactionForm";

export default function AddIncomePage() {
  return (
    <>
      <h1 className="text-4xl font-bold">
        Add Income
      </h1>

      <p className="mt-2 text-[var(--muted)]">
        Record a new income.
      </p>

      <TransactionForm type="Income" />
    </>
  );
}