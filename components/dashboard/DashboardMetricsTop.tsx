"use client";
import React, { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import { getProductCountPublished, getProductCountPending, getUserCount } from "@/lib/helper";
import { Products } from '@/public/shared/app.config'

export const DashboardMetricsTop = () => {
  const [counts, setCounts] = useState({
    ad: {
      published: 0,
      pending: 0
    },
    users: 0
  });

  useEffect(() => {
    const fetchCounts = async () => {
      const [publishedAd, pendingAd, totalUsers] = await Promise.all([
        getProductCountPublished(Products.advertisement.searchIndex),
        getProductCountPending(Products.advertisement.searchIndex),
        getUserCount()
      ]);

      setCounts({
        ad: {
          published: publishedAd,
          pending: pendingAd
        },
        users: totalUsers
      });
    };

    fetchCounts();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Customers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {counts.users}
            </h4>
          </div>
          {/* <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge> */}
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Advertisements
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {counts.ad.published}
            </h4>
          </div>

          <Badge color="warning">
            {counts.ad.pending} Pending
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};
