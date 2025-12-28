"use client";

import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { getProductCountByYear } from "@/lib/helper";
import { Products } from "@/public/shared/app.config";
import ChartTab from "../common/ChartTab";

// Apex chart (client only)
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const CURRENT_YEAR = new Date().getFullYear();
const YEARS_TO_FETCH = 5;

type YearData = {
  year: number;
  advertisement: number[];
  business: number[];
  realEstate: number[];
  classifieds: number[];
  job: number[];
};

export default function StatisticsChart() {
  const [yearsData, setYearsData] = useState<YearData[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(CURRENT_YEAR);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      const years = Array.from(
        { length: YEARS_TO_FETCH },
        (_, i) => CURRENT_YEAR - i
      );

      const results = await Promise.all(
        years.map(async (year) => {
          const [
            advertisement,
            business,
            realEstate,
            classifieds,
            job,
          ] = await Promise.all([
            getProductCountByYear(Products.advertisement.searchIndex, year),
            getProductCountByYear(Products.business.searchIndex, year),
            getProductCountByYear(Products.realEstate.searchIndex, year),
            getProductCountByYear(Products.classifieds.searchIndex, year),
            getProductCountByYear(Products.job.searchIndex, year),
          ]);

          const total =
            advertisement.total +
            business.total +
            realEstate.total +
            classifieds.total +
            job.total;

          // ⛔ skip year if everything is zero
          if (total === 0) return null;

          return {
            year,
            advertisement: advertisement.monthlyCounts,
            business: business.monthlyCounts,
            realEstate: realEstate.monthlyCounts,
            classifieds: classifieds.monthlyCounts,
            job: job.monthlyCounts,
          };
        })
      );

      const filtered = results.filter(Boolean) as YearData[];

      setYearsData(filtered);
      setSelectedYear(filtered[0]?.year ?? CURRENT_YEAR);
      setLoading(false);
    }

    loadData();
  }, []);

  const activeYearData = useMemo(
    () => yearsData.find((y) => y.year === selectedYear),
    [yearsData, selectedYear]
  );

  const series = [
    { name: "Advertisements", data: activeYearData?.advertisement || [] },
    { name: "Business Listings", data: activeYearData?.business || [] },
    { name: "Property Listings", data: activeYearData?.realEstate || [] },
    { name: "Classified Listings", data: activeYearData?.classifieds || [] },
    { name: "Job Listings", data: activeYearData?.job || [] },
  ];

  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 310,
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
    },
    colors: ["#465FFF", "#6246ff", "#d146ff", "#46ff7e", "#ff8d46"],
    stroke: {
      curve: "straight",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.5,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      hover: { size: 6 },
    },
    grid: {
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
    },
    tooltip: { enabled: true },
    legend: { show: false },
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading statistics...</div>;
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Statistics
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm">
            Listings added for each month
          </p>
        </div>

        <ChartTab
          years={yearsData.map((y) => y.year)}
          selectedYear={selectedYear}
          onChange={setSelectedYear}
        />
      </div>

      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={310}
      />
    </div>
  );
}
