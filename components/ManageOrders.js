// src/components/ManageOrders.js
import React, { useState, useEffect } from "react";
import { PrinterIcon } from "@heroicons/react/outline"; // Importing Heroicons printer icon

const statusOrder = {
  pending: 0,
  paid: 1,
  completed: 2,
  canceled: 3,
};

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/order");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/order/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status. Please try again.");
    }
  };

  const printReceipt = async (order) => {
    try {
      const response = await fetch("/api/print", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          ipAddress: "192.168.1.50", // Replace with actual IP address of the printer
          port: 9100, // Replace with actual port number
          orderDetails: order.items
            .map((item) => `${item.menuItem.name} x ${item.quantity}`)
            .join(", "),
          date: new Date().toLocaleDateString(),
          totalAmount: Number(order.total).toFixed(2),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message); // Receipt printed successfully
        alert("Receipt printed successfully");
      } else {
        const result = await response.json();
        alert(`Failed to print receipt: ${result.message}`);
      }
    } catch (error) {
      console.error("Error printing receipt:", error);
      alert("Failed to print receipt. Please try again.");
    }
  };

  const sortedOrders = orders.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  // const sortedOrders = orders.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

  if (loading) return <div className="text-center py-8">Loading orders...</div>;
  if (error)
    return <div className="text-center py-8 text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-lg shadow-xl border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Manage Orders
      </h2>

      {sortedOrders.length === 0 ? (
        <p className="text-center text-gray-500 font-medium">
          No orders available at the moment.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg bg-gray-50">
          <table className="w-full bg-white rounded-md">
            <thead className="bg-gray-100 text-gray-600 font-semibold text-sm uppercase tracking-wide">
              <tr>
                {[
                  "Order ID",
                  "โต๊ะ",
                  "ห้อง",
                  "รายการ",
                  "จำนวนเงิน (฿)",
                  "สถานะ",
                  "Actions",
                ].map((header, index) => (
                  <th key={index} className="px-6 py-3 text-left">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-100 transition duration-150"
                >
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {order.tableId}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {order.roomId}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-2"
                      >
                        <span>{item.menuItem.name}</span>
                        <span className="text-xs text-gray-500">
                          x{item.quantity}
                        </span>
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4 font-semibold text-green-600">
                    ฿{Number(order.total).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value)
                      }
                      className="px-3 py-1 bg-white border border-gray-300 rounded-md text-gray-700 shadow-sm hover:border-gray-400 focus:ring-0"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="completed">Completed</option>
                      <option value="canceled">Canceled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => printReceipt(order)}
                      className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold px-3 py-2 rounded-lg transition"
                    >
                      <PrinterIcon className="h-5 w-5 mr-2" />
                      Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
