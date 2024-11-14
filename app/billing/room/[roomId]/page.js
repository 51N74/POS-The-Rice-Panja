//Order Room
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PrinterIcon } from "@heroicons/react/outline"; // Importing Heroicons printer icon

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

const PaymentPage = ({ params }) => {
  const { tableId } = params; // Extract tableId from params
  const [billDetails, setBillDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBillDetails = async () => {
      try {
        if (!tableId) {
          throw new Error("No table ID provided.");
        }

        const response = await fetch(`/api/tables/${tableId}`);
        if (!response.ok) {
          console.error("Error fetching bill details:", response);
          throw new Error("Failed to fetch bill details");
        }

        const data = await response.json();
        setBillDetails(data);
      } catch (error) {
        console.error("Error fetching bill details:", error);
        setError("Failed to load bill details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBillDetails();
  }, [tableId]);

  if (loading)
    return <div className="text-center">Loading bill details...</div>;
  if (error) return <div className="text-red-600 text-center">{error}</div>;

  return (
    <div className="payment-page max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
        Table {tableId}
      </h1>

      {billDetails ? (
        <div>
          <p className="text-lg font-bold mb-4 text-center text-green-600">
            Total for all orders:{" "}
            <span className="text-2xl">{billDetails.totalAmount} THB</span>
          </p>

          {billDetails.orders && billDetails.orders.length > 0 ? (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2 text-purple-600">
                Bill Details
              </h2>
              <ul className="space-y-4">
                {billDetails.orders.map((order) => (
                  <li
                    key={order.id}
                    className="border p-4 rounded-md shadow-md bg-gray-100 hover:bg-gray-200 transition duration-300"
                  >
                    <div className="flex justify-between">
                      <span className="font-semibold text-orange-600">
                        Ordered Items:
                      </span>
                      <span>
                        Total: <span className="text-green-600"> ราคา</span>
                      </span>
                    </div>

                    <ul className="mt-1 list-disc ml-5">
                      {order.items.map((item, index) => (
                        <li key={index} className="text-gray-800">
                          <div className="flex justify-between">
                            <span>
                              {item.menuItem.name} x {item.quantity}
                            </span>
                            <span>
                              {item.quantity * item.menuItem.price} บาท
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between mt-4">
                {/* pushback */}
                <button>
                  <a
                    href="/"
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg"
                  >
                    Cancel
                  </a>
                </button>

                <button
                  onClick={() => printReceipt(order)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center"
                >
                  Print Receipt <PrinterIcon className="h-5 w-5 ml-1" />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center mt-4 text-red-600">
              No orders found for this table.
            </p>
          )}
        </div>
      ) : (
        <p className="text-center mt-4 text-red-600">
          No bill details available for this table.
        </p>
      )}
    </div>
  );
};

export default PaymentPage;
