"use client";

import { useEffect, useState } from "react";

type Props = {
  value: number;
};

export default function CircularProgress({
  value,
}: Props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(value);
    }, 200);

    return () => clearTimeout(timer);
  }, [value]);

  const radius = 85;
  const stroke = 12;

  const normalizedRadius = radius - stroke * 0.5;

  const circumference =
    normalizedRadius * 2 * Math.PI;

  const strokeDashoffset =
    circumference -
    (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center">

      <svg
        height={radius * 2}
        width={radius * 2}
      >

        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        <circle
          stroke="#14b8a6"
          fill="transparent"
          strokeLinecap="round"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition:
              "stroke-dashoffset 1.2s ease",
          }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        <text
          x="50%"
          y="46%"
          textAnchor="middle"
          className="fill-slate-800 text-4xl font-bold"
        >
          {progress}
        </text>

        <text
          x="50%"
          y="64%"
          textAnchor="middle"
          className="fill-slate-500 text-sm"
        >
          /100
        </text>

      </svg>

    </div>
  );
}