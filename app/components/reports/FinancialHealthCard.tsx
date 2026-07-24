import CircularProgress from "./CircularProgress";

type Props = {
  score: number;
};

export default function FinancialHealthCard({
  score,
}: Props) {
  const getStatus = () => {
    if (score >= 90) return "Outstanding";
    if (score >= 75) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Needs Improvement";
    return "Critical";
  };

  return (
    <div className="rounded-3xl bg-gradient-to-r from-teal-500 to-cyan-500 p-8 text-white shadow-xl">

      <p className="text-sm uppercase tracking-[0.2em] opacity-80">
        Financial Health
      </p>

      <div className="mt-8 flex justify-center">
        <CircularProgress value={score} />
      </div>

      <div className="mt-6 text-center">

        <h3 className="text-2xl font-bold">
          {getStatus()}
        </h3>

        <p className="mt-2 text-white/80">
          Keep improving your financial habits every day.
        </p>

      </div>

      <div className="mt-8 rounded-2xl bg-white/15 p-4 backdrop-blur-sm">

        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm opacity-80">
              Investor Level
            </p>

            <p className="text-xl font-bold">
              Level {Math.floor(score / 10)}
            </p>
          </div>

          <div className="text-right">

            <p className="text-sm opacity-80">
              Progress
            </p>

            <p className="text-xl font-bold">
              {score}%
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}