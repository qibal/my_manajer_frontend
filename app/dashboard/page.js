import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/Shadcn/card";
import { dashboardInfo } from "@/data_dummy/dashboard/dashboard";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome to your dashboard.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8 w-full">
        <Card>
          <CardHeader>
            <CardDescription>Total Projects</CardDescription>
            <CardTitle>{dashboardInfo.totalProjects}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Active Tasks</CardDescription>
            <CardTitle>{dashboardInfo.activeTasks}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Team Members</CardDescription>
            <CardTitle>{dashboardInfo.teamMembers}</CardTitle>
          </CardHeader>
        </Card>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8 w-full">
        <Card>
          <CardHeader>
            <CardDescription>Revenue</CardDescription>
            <CardTitle>Rp {dashboardInfo.revenue.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Expenses</CardDescription>
            <CardTitle>Rp {dashboardInfo.expenses.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Profit</CardDescription>
            <CardTitle>Rp {dashboardInfo.profit.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
      </div>
      <div className="w-full">
        <h2 className="text-lg font-semibold mb-2">Recent Projects</h2>
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y">
              {dashboardInfo.recentProjects.map((project, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center py-3 px-4"
                >
                  <span>{project.name}</span>
                  <span className="text-xs">{project.status} - {project.deadline}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}