// pages/dashboard.js
"use client";

import { HomeIcon, ChartBarIcon, ArchiveIcon } from "@heroicons/react/outline";
import LogoutButton from "../../../components/LogoutButton";
import MenuList from "../../../components/MenuList";
import ManageOrders from "../../../components/ManageOrders";
import React, { useState, useEffect } from 'react';
import SalesChart from "../../../components/SalesChart";

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState("reports");
  const [orders, setOrders] = useState([]);
  const [totalSales, setTotalSales] = useState([]);
  const [totalBills, setTotalBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/order');
        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
    
        setOrders(data);
    
        // Calculate total sales by summing up the 'total' field from each order
        const totalSales = data.reduce((acc, order) => acc + parseFloat(order.total), 0);
        const totalBills = data.length;
        console.log("Total Sales:", totalSales);
        console.log("Total Bills:", totalBills);
        setTotalSales(totalSales);
        setTotalBills(totalBills);
    } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders. Please try again.');
    } finally {
        setLoading(false);
    }
    
    };

    fetchOrders();
}, []);


if (loading) return <div className="text-center py-8">Loading orders...</div>;
if (error) return <div className="text-center py-8 text-red-600">Error: {error}</div>;
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-green-600 text-white flex flex-col">
        <div className="flex items-center justify-center h-16 border-b border-green-700">
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>
        <nav className="flex-1 mt-4">
          <ul className="space-y-2">
            {/* Dashboard */}
            <li>
              <button
                onClick={() => setActiveMenu("reports")}
                className={`flex items-center px-4 py-2 w-full transition ${
                  activeMenu === "reports"
                    ? "bg-green-700"
                    : "hover:bg-green-500"
                }`}
              >
                <ChartBarIcon className="h-6 w-6 mr-2" />
                Dashboard
              </button>
            </li>

            {/* Orders */}
            <li>
              <button
                onClick={() => setActiveMenu("orders")}
                className={`flex items-center px-4 py-2 w-full transition ${
                  activeMenu === "orders"
                    ? "bg-green-700"
                    : "hover:bg-green-500"
                }`}
              >
                <ArchiveIcon className="h-6 w-6 mr-2" />
                รายการ Orders
              </button>
            </li>

            {/* Menu List */}
            <li>
              <button
                onClick={() => setActiveMenu("items")}
                className={`flex items-center px-4 py-2 w-full transition ${
                  activeMenu === "items" ? "bg-green-700" : "hover:bg-green-500"
                }`}
              >
                <ArchiveIcon className="h-6 w-6 mr-2" />
                รายการอาหาร
              </button>
            </li>

            {/* Accout */}
            <li>
              <button
                onClick={() => setActiveMenu("account")}
                className={`flex items-center px-4 py-2 w-full transition ${
                  activeMenu === "account"
                    ? "bg-green-700"
                    : "hover:bg-green-500"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="h-6 w-6 mr-2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                  />
                </svg>
                จัดการข้อมูลพนักงาน
              </button>
            </li>

            {/* Bill */}
            <li>
              <button
                onClick={() => setActiveMenu("bills")}
                className={`flex items-center px-4 py-2 w-full transition ${
                  activeMenu === "bills" ? "bg-green-700" : "hover:bg-green-500"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="h-6 w-6 mr-2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                  />
                </svg>
                จัดการ Bill
              </button>
            </li>

            <li>

            {/* <LogoutButton />
              <button
                onClick={() => setActiveMenu("logout")}
                className={`flex items-center px-4 py-2 w-full transition ${
                  activeMenu === "bill" ? "bg-green-700" : "hover:bg-green-500"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="h-6 w-6 mr-2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                  />
                </svg>
                ออกจากระบบ
              </button> */}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        {activeMenu === "reports" && (
          <div>
            <h2 className="text-2xl font-semibold text-green-800">
              Sales Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-white p-4 shadow-lg rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700">ยอดขายทั้งหมด</h3>
                <p className="text-2xl font-bold text-blue-500">{totalSales.toFixed(2)} บาท</p>
              </div>
              <div className="bg-white p-4 shadow-lg rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700">จำนวนบิล</h3>
                <p className="text-2xl font-bold text-red-500">{totalBills} รายการ</p>
              </div>
              <div className="bg-white p-4 shadow-lg rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700">
                  จำนวนสินค้า
                </h3>
                <p className="text-2xl font-bold text-blue-500">฿0.00</p>
              </div>
              <div className="bg-white p-4 shadow-lg rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700">
                  Total Profit
                </h3>
                <p className="text-2xl font-bold text-green-600">฿190.00</p>
              </div>
            </div>

            {/* Sales graph */}
            <div className=" mt-6 p-4 ">
            <SalesChart />                            
            </div>
          </div>
        )}

        {activeMenu === "orders" && (
          <div>
            <h2 className="text-2xl font-semibold text-green-800">Orders List</h2>
            <ManageOrders />
          </div>
        )}

        {activeMenu === "items" && (
          <div>
            <h2 className="text-2xl font-semibold text-green-800">
              รายการอาหาร
            </h2>
            <MenuList />
          </div>
        )}

        {activeMenu === "account" && (
          <div>
            <h2 className="text-2xl font-semibold text-green-800">Accout</h2>
          </div>
        )}

        {activeMenu === "bills" && (
          <div>
            <h2 className="text-2xl font-semibold text-green-800">รายการขาย</h2>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
