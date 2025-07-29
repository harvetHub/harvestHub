"use client";

import useAuthCheck from "@/hooks/admin/useAuthCheck";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AdminMainLayout } from "@/layout/AdminMainLayout";
import { useEffect, useState } from "react";
import { TrendingUp, ShoppingCart, Package, Users } from "lucide-react";

export default function AdminDashboard() {
  const { load } = useAuthCheck();

  const [dashboard, setDashboard] = useState<{
    totalSales: number;
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
    monthlySales: { name: string; sales: number }[];
    months: string[];
  }>({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    monthlySales: [],
    months: [],
  });
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoadingData(true);
      try {
        const res = await fetch("/api/admin/dashboard");
        const data = await res.json();
        setDashboard({
          totalSales: data.totalSales || 0,
          totalOrders: data.totalOrders || 0,
          totalProducts: data.totalProducts || 0,
          totalUsers: data.totalUsers || 0,
          monthlySales: data.monthlySales || [],
          months: data.months || [],
        });
      } catch {
        // Optionally handle error
      }
      setLoadingData(false);
    };
    fetchDashboardData();
  }, []);

  return (
    <AdminMainLayout>
      {(load || loadingData) && <LoadingSpinner />}
      <main className="flex-1 bg-gray-50 mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          Admin Dashboard
        </h1>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <CardHeader className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <CardTitle>Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-center">
                ₱{dashboard.totalSales.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card className="p-6">
            <CardHeader className="flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
              <CardTitle>Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-center">
                {dashboard.totalOrders.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card className="p-6">
            <CardHeader className="flex items-center gap-2">
              <Package className="w-6 h-6 text-yellow-600" />
              <CardTitle>Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-center">
                {dashboard.totalProducts.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card className="p-6">
            <CardHeader className="flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-600" />
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-center">
                {dashboard.totalUsers.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sales Chart */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Monthly Sales
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboard.monthlySales}>
              <XAxis
                dataKey="name"
                tickFormatter={(tick) => {
                  const [year, month] = tick.split("-");
                  const date = new Date(Number(year), Number(month) - 1);
                  return date.toLocaleString("default", {
                    month: "short",
                    year: "numeric",
                  });
                }}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(label) => {
                  const [year, month] = label.split("-");
                  const date = new Date(Number(year), Number(month) - 1);
                  return date.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  });
                }}
              />
              <Bar dataKey="sales" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
          {/* Optionally display months below chart */}
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
            {dashboard.months.map((m) => {
              const [year, month] = m.split("-");
              const date = new Date(Number(year), Number(month) - 1);
              return (
                <span
                  key={m}
                  className="px-2 py-1 bg-gray-100 rounded flex items-center gap-1"
                >
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  {date.toLocaleString("default", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              );
            })}
          </div>
        </div>
      </main>
    </AdminMainLayout>
  );
}
