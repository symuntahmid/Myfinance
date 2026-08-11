import CircularProgress from "./CircularProgress";

type Props = {
  score: number;
};

export default function FinancialHealthCard({
  score,
}: Props) {
  const getStatus = () => {
    if (score === 0) return "No Data Yet";
    if (score >= 90) return "Outstanding";
    if (score >= 75) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Needs Improvement";
    return "Critical";
  };

  const getDescription = () => {
    if (score === 0) {
      return "Add your first financial activity to start measuring your financial health.";
    }

    if (score >= 90) {
      return "Your financial habits are outstanding. Keep building on this momentum.";
    }

    if (score >= 75) {
      return "Excellent progress. You're building strong financial habits.";
    }

    if (score >= 60) {
      return "You're on the right track. Keep improving your financial habits.";
    }

    if (score >= 40) {
      return "You have room to improve. Focus on building stronger financial habits.";
    }

    return "Your finances need attention. Focus on improving your cash flow and savings.";
  };

  return (
    <div className="rounded-3xl bg-gradient-to-r from-teal-500 to-cyan-500 p-8 text-white shadow-xl">

      {/* Header */}

      <p className="text-sm uppercase tracking-[0.2em] opacity-80">
        Financial Health
      </p>

      {/* Score */}

      <div className="mt-8 flex justify-center">
        <CircularProgress value={score} />
      </div>

      {/* Status */}

      <div className="mt-6 text-center">

        <h3 className="text-2xl font-bold">
          {getStatus()}
        </h3>

        <p className="mt-2 text-sm leading-6 text-white/80">
          {getDescription()}
        </p>

      </div>

      {/* Progress */}

      <div className="mt-8 rounded-2xl bg-white/15 p-4 backdrop-blur-sm">

        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm opacity-80">
              Financial Level
            </p>

            <p className="text-xl font-bold">
              {score === 0
                ? "Getting Started"
                : `Level ${Math.floor(score / 10)}`}
            </p>
          </div>

          <div className="text-right">

            <p className="text-sm opacity-80">
              Score
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