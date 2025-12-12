"use client";
import React, { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import { getProductCountPublished, getProductCountPending, getUserCount } from "@/lib/helper";
import { Products } from '@/public/shared/app.config'

export const DashboardMetricsBottom = () => {
  const [counts, setCounts] = useState({
    bl: {
      published: 0,
      pending: 0
    },
    pl: {
      published: 0,
      pending: 0
    },
    cl: {
      published: 0,
      pending: 0
    },
    jl: {
      published: 0,
      pending: 0
    }
  });

  useEffect(() => {
    const fetchCounts = async () => {
      const [
        publishedBl, pendingBl,
        publishedPl, pendingPl,
        publishedCl, pendingCl,
        publishedJl, pendingJl,] = await Promise.all([
          getProductCountPublished(Products.business.searchIndex),
          getProductCountPending(Products.business.searchIndex),
          getProductCountPublished(Products.realEstate.searchIndex),
          getProductCountPending(Products.realEstate.searchIndex),
          getProductCountPublished(Products.classifieds.searchIndex),
          getProductCountPending(Products.classifieds.searchIndex),
          getProductCountPublished(Products.job.searchIndex),
          getProductCountPending(Products.job.searchIndex),
        ]);

      setCounts({
        bl: {
          published: publishedBl,
          pending: pendingBl
        },
        pl: {
          published: publishedPl,
          pending: pendingPl
        },
        cl: {
          published: publishedCl,
          pending: pendingCl
        },
        jl: {
          published: publishedJl,
          pending: pendingJl
        }
      });
    };

    fetchCounts();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Business Listing
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {counts.bl.published}
            </h4>
          </div>

          <Badge color="warning">
            {counts.bl.pending} Pending
          </Badge>
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
              Property Listing
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {counts.pl.published}
            </h4>
          </div>

          <Badge color="warning">
            {counts.pl.pending} Pending
          </Badge>
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
              Classifieds Listing
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {counts.cl.published}
            </h4>
          </div>

          <Badge color="warning">
            {counts.cl.pending} Pending
          </Badge>
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
              Job Listing
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {counts.jl.published}
            </h4>
          </div>

          <Badge color="warning">
            {counts.jl.pending} Pending
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};
