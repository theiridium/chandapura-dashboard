import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import { DashboardMetricsTop } from "@/components/dashboard/DashboardMetricsTop";
import { DashboardMetricsBottom } from "@/components/dashboard/DashboardMetricsBottom";
import UsersChart from "@/components/ecommerce/UsersChart";
import AreaDataCard from "@/components/ecommerce/AreaDataCard";
import PendingApprovals from "@/components/ecommerce/PendingApprovals";

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <DashboardMetricsTop />

        <UsersChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12 space-y-6">
        <DashboardMetricsBottom />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <AreaDataCard />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <PendingApprovals />
      </div>
    </div>
  );
}
