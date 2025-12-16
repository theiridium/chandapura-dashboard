import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import { DashboardMetricsTop } from "@/components/dashboard/DashboardMetricsTop";
import { DashboardMetricsBottom } from "@/components/dashboard/DashboardMetricsBottom";
import UsersChart from "@/components/ecommerce/UsersChart";
import AreaDataCard from "@/components/ecommerce/AreaDataCard";
import AreaTable from "@/components/ecommerce/AreaTable";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        {/* <DashboardMetricsTop />

        <UsersChart /> */}
      </div>

      <div className="col-span-12 xl:col-span-5">
        {/* <MonthlyTarget /> */}
      </div>

      <div className="col-span-12 space-y-6">
        {/* <DashboardMetricsBottom /> */}
      </div>

      <div className="col-span-12">
        {/* <StatisticsChart /> */}
      </div>

      <div className="col-span-12 xl:col-span-5">
        <AreaDataCard />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <AreaTable />
      </div>
    </div>
  );
}
