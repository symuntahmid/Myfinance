import TransactionForm from "../../components/TransactionForm";

export default function AddInvestmentPage() {
  return (
    <>
      <h1 className="text-4xl font-bold">Add Investment</h1>

      <p className="mt-2 text-[var(--muted)]">
        Record a new investment.
      </p>

      <TransactionForm type="Investment" />
    </>
  );
}