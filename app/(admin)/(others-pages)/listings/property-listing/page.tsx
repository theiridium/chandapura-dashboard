"use client"
import { useEffect, useState } from "react";
import { getlListingData } from "@/lib/helper";
import { Products } from "@/public/shared/app.config";
import PropertyListingDraft from "@/components/sub-components/drafts/PropertyListingDraft";
import PropertyListingPa from "@/components/sub-components/pending-approvals/PropertyListingPa";

export default function Page() {
  const [listingData, setListingData] = useState<any[]>();
  useEffect(() => {
    async function loadData() {
      const data: any = await getlListingData(Products.realEstate.searchIndex);
      const names = ["Total", "Active", "Pending Approval", "Draft", "Inactive"]
      const mappedData: any = data.map((x: any, i: any) => ({
        ...x,
        name: names[i]
      }));

      setListingData(mappedData);
    }

    loadData();
  }, []);
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-5 ml-5">Property Listing</h2>
      <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Overview</h3>
          </div>
        </div>
        <div className="grid rounded-2xl border border-gray-200 bg-white sm:grid-cols-2 xl:grid-cols-5 dark:border-gray-800 dark:bg-gray-900">
          {listingData?.map((data, i) => {
            const isLast = i === listingData.length - 1;
            return (
              <div
                key={i}
                className={`px-6 py-5 ${isLast
                  ? ""
                  : "border-b border-gray-200 sm:border-r xl:border-b-0 dark:border-gray-800"
                  }`}>
                <span className="text-sm text-gray-500 dark:text-gray-400">{data.name}</span>
                <div className="mt-2 flex items-end gap-3">
                  <h4 className="text-title-xs sm:text-title-sm font-bold text-gray-800 dark:text-white/90">{data.totalHits}</h4>
                  {/* <div>
                    <span className="bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500 flex items-center gap-1 rounded-full py-0.5 pr-2.5 pl-2 text-sm font-medium">+2.5%</span>
                  </div> */}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Pending Approval List
            </h3>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              Click on the review button to go to admin portal
            </p>
          </div>
          <div>
            <PropertyListingPa />
          </div>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Drafts
            </h3>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              Click on the review button to go to admin portal
            </p>
          </div>
          <div>
            <PropertyListingDraft />
          </div>
        </div>
      </div>
    </div>
  );
}
