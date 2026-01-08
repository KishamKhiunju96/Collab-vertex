import DashboardHeader from "../../components/dashboard/DashboardHeader";
import SideBar from "../../components/dashboard/SideBar";
import StatsCard from "../../components/dashboard/StatsCard";
import RecentActivity from "../../components/dashboard/RecentActivity";
import { FaUsers, FaDollarSign, FaChartLine } from "react-icons/fa";

export default function DashboardPage() {
  const activities = [
    {
      id: 1,
      user: "Kisham Khiunju",
      action: "uploaded a pic",
      time: "2 min ago",
    },
    {
      id: 2,
      user: "Rochak Sulu",
      action: "commented on a pic",
      time: "30 min ago",
    },
    {
      id: 3,
      user: "Dick-endra Stha",
      action: "joined in a group",
      time: "1 hr ago",
    },
  ];

  return (
    <>
      <div className="flex min-h-screen bg-white">
        <SideBar active="Home" />
        <main className="flex-1 p-8 flex flex-col gap-8 rounded-3xl border-8 border-white  bg-gray-300 ">
          <DashboardHeader />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <StatsCard title="User" value="1,50,000" icon={<FaUsers />} />
            <StatsCard title="Salary" value="$5" icon={<FaDollarSign />} />
            <StatsCard title="Growth" value="80%" icon={<FaChartLine />} />
          </div>
          <RecentActivity activities={activities} />
        </main>
      </div>
    </>
  );
}
