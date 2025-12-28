import MonthlyTarget from "@/components/sub-components/MonthlyTarget";
import StatisticsChart from "@/components/sub-components/StatisticsChart";
import { DashboardMetricsTop } from "@/components/dashboard/DashboardMetricsTop";
import { DashboardMetricsBottom } from "@/components/dashboard/DashboardMetricsBottom";
import UsersChart from "@/components/sub-components/UsersChart";
import AreaDataCard from "@/components/sub-components/AreaDataCard";
import PendingApprovals from "@/components/sub-components/PendingApprovals";

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
