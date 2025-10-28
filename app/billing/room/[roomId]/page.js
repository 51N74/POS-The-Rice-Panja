// Order Room
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PrinterIcon } from "@heroicons/react/outline";

// 💡 แก้ไข: ฟังก์ชันนี้ควรรับ billDetails (ข้อมูลรวมบิลทั้งหมด)
const printReceipt = async (billDetails, tableId) => {
  if (!billDetails || !billDetails.orders || billDetails.orders.length === 0) {
    alert("No order details to print.");
    return;
  }

  // 💡 สร้าง array ของรายการอาหารทั้งหมดจากทุกออเดอร์
  const allOrderItems = billDetails.orders.flatMap((order) =>
    order.items.map((item) => ({
      name: item.menuItem.name,
      quantity: item.quantity,
      price: (item.quantity * item.menuItem.price).toFixed(2),
    })),
  );

  try {
    const response = await fetch("/api/print", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        ipAddress: "192.168.1.50",
        port: 9100,
        // 💡 ส่งรายการอาหารเป็น Array ของ Object (ตาม Route Handler /api/print ที่แก้ไขล่าสุด)
        orderDetails: allOrderItems,
        date: new Date().toLocaleDateString(),
        // 💡 ส่งยอดรวมทั้งหมด
        totalAmount: Number(billDetails.totalAmount).toFixed(2),
        tableRoomDetails: `โต๊ะ ${tableId}`, // ส่งรายละเอียดโต๊ะ
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result.message);
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
  const { tableId } = params;
  const [billDetails, setBillDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // 💡 เพิ่มฟังก์ชันสำหรับเคลียร์บิล (ตัวอย่าง)
  const handleCheckout = async () => {
    // ⚠️ ต้องมี Logic การเรียก API เพื่ออัปเดตสถานะ Orders และ Table/Room
    alert("Checking out and clearing table...");
    // ตัวอย่าง: await fetch(`/api/checkout/${tableId}`, { method: 'POST' });
    router.push("/"); // กลับไปหน้าหลัก
  };

  useEffect(() => {
    const fetchBillDetails = async () => {
      try {
        if (!tableId) {
          throw new Error("No table ID provided.");
        }

        // ⚠️ การตรวจสอบ: Route Handler ของคุณควรอยู่ที่ /api/tables/[id]
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
        Table {tableId} Bill
      </h1>

      {billDetails ? (
        <div>
          <p className="text-lg font-bold mb-4 text-center text-green-600">
            Total for all orders:{" "}
            <span className="text-2xl">
              {Number(billDetails.totalAmount).toFixed(2)} THB
            </span>
          </p>

          {billDetails.orders && billDetails.orders.length > 0 ? (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2 text-purple-600">
                Order Details
              </h2>
              <ul className="space-y-4">
                {billDetails.orders.map((order) => (
                  <li
                    key={order.id}
                    className="border p-4 rounded-md shadow-md bg-gray-100 hover:bg-gray-200 transition duration-300"
                  >
                    <div className="flex justify-between">
                      <span className="font-semibold text-orange-600">
                        Order ID: {order.id}
                      </span>
                      <span>
                        Total:{" "}
                        <span className="text-green-600 font-bold">
                          {Number(order.total).toFixed(2)} บาท
                        </span>
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
                              {Number(
                                item.quantity * item.menuItem.price,
                              ).toFixed(2)}{" "}
                              บาท
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => router.push("/")} // ใช้ router.push แทน <a href>
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-semibold"
                >
                  Cancel / Back
                </button>

                <button
                  onClick={() => printReceipt(billDetails, tableId)} // 💡 แก้ไขให้ส่ง billDetails
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center font-semibold transition"
                >
                  Print Receipt <PrinterIcon className="h-5 w-5 ml-2" />
                </button>

                <button
                  onClick={handleCheckout}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  Confirm Payment
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
