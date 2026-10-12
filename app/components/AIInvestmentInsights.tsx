"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Lightbulb,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

import {
  getAllocation,
  getPortfolioSummary,
} from "@/app/data/investments";

import {
  useLanguage,
} from "@/app/context/LanguageContext";


export default function AIInvestmentInsights() {

  const { t, language } =
    useLanguage();


  const [
    summary,
    setSummary,
  ] = useState(
    getPortfolioSummary()
  );


  const [
    allocation,
    setAllocation,
  ] = useState(
    getAllocation()
  );


  const [
    ,
    forceCurrencyUpdate,
  ] = useState(0);


  /* =====================================================
     REFRESH PORTFOLIO DATA
  ===================================================== */

  function refreshData() {

    setSummary(
      getPortfolioSummary()
    );

    setAllocation(
      getAllocation()
    );

  }


  /* =====================================================
     EVENT LISTENERS
  ===================================================== */

  useEffect(() => {

    refreshData();


    const investmentListener = () => {
      refreshData();
    };


    const currencyListener = () => {

      forceCurrencyUpdate(
        (value) => value + 1
      );

    };


    window.addEventListener(
      "investmentsUpdated",
      investmentListener
    );


    window.addEventListener(
      "currencyUpdated",
      currencyListener
    );


    return () => {

      window.removeEventListener(
        "investmentsUpdated",
        investmentListener
      );


      window.removeEventListener(
        "currencyUpdated",
        currencyListener
      );

    };

  }, []);


  /* =====================================================
     PORTFOLIO ALLOCATION
  ===================================================== */

  const total =
    summary.current;


  const sortedAssets =
    Object.entries(
      allocation
    ).sort(
      (a, b) =>
        b[1] - a[1]
    );


  const largestAsset =
    sortedAssets[0];


  const largestPercentage =
    total > 0 && largestAsset
      ? (
          largestAsset[1] /
          total
        ) *
        100
      : 0;


  /* =====================================================
     PORTFOLIO HEALTH
  ===================================================== */

  let healthText =
    language === "bn"
      ? "চমৎকার"
      : "Excellent";


  if (summary.current === 0) {

    healthText =
      language === "bn"
        ? "কোনো তথ্য নেই"
        : "No Data";

  }
  else if (
    summary.returnPercentage < 0
  ) {

    healthText =
      language === "bn"
        ? "মনোযোগ প্রয়োজন"
        : "Needs Attention";

  }
  else if (
    summary.returnPercentage < 10
  ) {

    healthText =
      language === "bn"
        ? "গড়"
        : "Average";

  }


  /* =====================================================
     RECOMMENDATION
  ===================================================== */

  const recommendation =
    largestPercentage > 70

      ? language === "bn"
        ? "আপনার পোর্টফোলিওর একটি সম্পদের ওপর নির্ভরতা অনেক বেশি। ঝুঁকি কমাতে ETF, Gold বা Bonds-এর মতো বিভিন্ন সম্পদে বিনিয়োগ বিবেচনা করুন।"
        : "Your portfolio is highly concentrated in one asset. Consider diversifying into ETFs, Gold, or Bonds to reduce risk."

      : language === "bn"
        ? "আপনার পোর্টফোলিও মোটামুটি বৈচিত্র্যপূর্ণ। নিয়মিত বিনিয়োগ চালিয়ে যান এবং প্রতি মাসে আপনার সম্পদের বণ্টন পর্যালোচনা করুন।"
        : "Your portfolio is reasonably diversified. Continue investing consistently and review your allocations monthly.";


  /* =====================================================
     RENDER
  ===================================================== */

  return (

    <div
      className="
        rounded-3xl
        border
        border-[var(--border)]
        bg-gradient-to-br
        from-cyan-50
        via-[var(--card)]
        to-[var(--card)]
        p-6
        shadow-sm
        sm:p-8
      "
    >

      {/* HEADER */}

      <div
        className="
          flex
          items-center
          gap-3
        "
      >

        <div
          className="
            rounded-2xl
            bg-cyan-100
            p-3
          "
        >

          <Lightbulb
            className="
              h-6
              w-6
              text-cyan-700
            "
          />

        </div>


        <div>

          <h2
            className="
              font-display
              text-3xl
              font-medium
              tracking-[-0.04em]
              text-[var(--foreground)]
            "
          >
            {t("aiFinancialInsights")}
          </h2>


          <p
            className="
              mt-2
              font-body
              text-sm
              leading-relaxed
              tracking-tight
              text-[var(--muted)]
            "
          >
            {t("personalizedObservations")}
          </p>

        </div>

      </div>


      {/* INSIGHTS */}

      <div
        className="
          mt-8
          space-y-5
        "
      >

        {/* PORTFOLIO HEALTH */}

        <div
          className="
            flex
            items-start
            gap-3
          "
        >

          <ShieldCheck
            className="
              mt-1
              h-5
              w-5
              shrink-0
              text-green-600
            "
          />


          <div>

            <h3
              className="
                font-display
                text-xl
                font-medium
                tracking-[-0.03em]
                text-[var(--foreground)]
              "
            >
              {language === "bn"
                ? "পোর্টফোলিওর অবস্থা"
                : "Portfolio Health"}
            </h3>


            <p
              className="
                font-body
                text-sm
                leading-relaxed
                tracking-tight
                text-[var(--muted)]
              "
            >

              {language === "bn"
                ? "আপনার বর্তমান পোর্টফোলিওর অবস্থা"
                : "Your current portfolio health is"}

              <span
                className="
                  font-semibold
                  text-cyan-700
                "
              >
                {" "}
                {healthText}
              </span>

              .

            </p>

          </div>

        </div>


        {/* LARGEST HOLDING */}

        <div
          className="
            flex
            items-start
            gap-3
          "
        >

          <TrendingUp
            className="
              mt-1
              h-5
              w-5
              shrink-0
              text-cyan-600
            "
          />


          <div>

            <h3
              className="
                font-display
                text-xl
                font-medium
                tracking-[-0.03em]
                text-[var(--foreground)]
              "
            >
              {t("largestHolding")}
            </h3>


            <p
              className="
                font-body
                text-sm
                leading-relaxed
                tracking-tight
                text-[var(--muted)]
              "
            >

              {largestAsset ? (

                <>
                  {largestAsset[0]}{" "}

                  {language === "bn"
                    ? "আপনার পোর্টফোলিওর"
                    : "represents"}

                  {" "}
                  {largestPercentage.toFixed(1)}%

                  {language === "bn"
                    ? " অংশ।"
                    : " of your portfolio."}
                </>

              ) : (

                t("noInvestmentsYet")

              )}

            </p>

          </div>

        </div>


        {/* AI RECOMMENDATION */}

        <div
          className="
            rounded-2xl
            bg-cyan-50
            p-5
          "
        >

          <h3
            className="
              font-display
              text-xl
              font-medium
              tracking-[-0.03em]
              text-[var(--foreground)]
            "
          >
            {language === "bn"
              ? "AI পরামর্শ"
              : "AI Recommendation"}
          </h3>


          <p
            className="
              mt-3
              font-body
              text-sm
              leading-relaxed
              tracking-tight
              text-[var(--muted)]
            "
          >
            {recommendation}
          </p>

        </div>

      </div>

    </div>

  );

}