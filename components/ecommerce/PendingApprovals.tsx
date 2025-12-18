"use client"
import { useEffect, useState } from "react";
import { capitalizeWords, getAreaBasedListingCounts, getPendingApprovalListingCounts } from "@/lib/helper";
import Button from "../ui/button/Button";

export default function PendingApprovals() {
  const [pendingApprovalData, setPendingApprovalData] = useState<any[]>();
  useEffect(() => {
    async function loadData() {
      const data: any = await getPendingApprovalListingCounts();
      const listingData: any = data.map((x: any) => ({
        listingType: capitalizeWords(x.indexUid),
        count: x.totalHits
      }));

      setPendingApprovalData(listingData);
    }

    loadData();
  }, []);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Pending Approvals
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Listings pending admin approval
          </p>
        </div>
      </div>

      <div className="space-y-5 mt-6">
        {pendingApprovalData?.map(((a: any, i: any) =>
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-gray-800 text-theme-sm dark:text-white/90">
                  {a.listingType}
                </p>
              </div>
            </div>

            <div>
              <Button size="sm" variant="outline" disabled={!a.count}>
                {a.count} pending approval
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
