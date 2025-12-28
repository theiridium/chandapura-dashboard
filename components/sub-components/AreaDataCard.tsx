"use client";
import { useEffect, useState } from "react";
import { getAreaBasedListingCounts } from "@/lib/helper";

export default function AreaDataCard() {
  const [areaChartData, setAreaChartData] = useState<any>();
  useEffect(() => {
    async function loadData() {
      const data: any = await getAreaBasedListingCounts("bar");
      const chartData = data?.areas.sort((a: any, b: any) => b.count - a.count);
      setAreaChartData(chartData);
    }

    loadData();
  }, []);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Listings Demographic
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Top 6 Areas with maximum listings
          </p>
        </div>
      </div>

      <div className="space-y-5 mt-6">
        {areaChartData?.slice(0, 6).map(((a: any, i: any) =>
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                  {a.name}
                </p>
                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                  {a.count} Listing{a.count > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <div className="flex w-full max-w-[140px] items-center gap-3">
              <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
                <div
                  className="absolute left-0 top-0 flex h-full items-center justify-center rounded-sm bg-brand-500 text-xs font-medium text-white"
                  style={{ width: `${a.percentage}%` }}
                >
                </div>
              </div>
              <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                {a.percentage}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
