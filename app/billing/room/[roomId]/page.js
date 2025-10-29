"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PrinterIcon } from "@heroicons/react/outline";

// 💡 แก้ไข: printReceipt ต้องรับ billDetails และ roomId
const printReceipt = async (billDetails, roomId) => {
  if (!billDetails || !billDetails.orders || billDetails.orders.length === 0) {
    alert("No order details to print.");
    return;
  }

  // รวมรายการอาหารทั้งหมดจากทุกออเดอร์
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
        orderDetails: allOrderItems, // ส่งเป็น Array of Objects
        date: new Date().toLocaleDateString(),
        totalAmount: Number(billDetails.totalAmount).toFixed(2),
        roomRoomDetails: `โต๊ะ ${roomId}`,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      alert("Receipt printed successfully!");
      console.log(result.message);
    } else {
      const result = await response.json();
      alert(`Failed to print receipt: ${result.message}`);
    }
  } catch (error) {
    console.error("Error printing receipt:", error);
    alert("Failed to print receipt. Please try again.");
  }
};

// 💡 เพิ่ม: ฟังก์ชันสำหรับการยืนยันชำระเงิน/เคลียร์บิล
const handleCheckout = async (roomId, router) => {
  if (
    !confirm(`Confirm payment for room ${roomId} and clear the room status?`)
  ) {
    return;
  }

  try {
    // เรียกใช้ Route Handler ที่สร้างขึ้นใหม่
    const response = await fetch(`/api/checkout/room/${roomId}`, {
      method: "POST",
    });

    if (!response.ok) throw new Error("Failed to finalize payment.");

    alert(`Payment successful for room ${roomId}. room status cleared.`);
    router.push("/");
  } catch (error) {
    console.error("Checkout Error:", error);
    alert(`Checkout failed: ${error.message}`);
  }
};

const PaymentPage = ({ params }) => {
  const { roomId } = params;
  const [billDetails, setBillDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // ... (fetchBillDetails logic remains the same)
    const fetchBillDetails = async () => {
      // ... (โค้ด fetchBillDetails เดิม)
      try {
        if (!roomId) throw new Error("No room ID provided.");

        const response = await fetch(`/api/billing/room/${roomId}`);
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
  }, [roomId]);

  if (loading)
    return <div className="text-center py-8">Loading bill details...</div>;
  if (error)
    return <div className="text-red-600 text-center py-8">{error}</div>;

  return (
    <div className="payment-page max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
        room **{roomId}** Bill Summary
      </h1>

      {billDetails ? (
        <div>
          <p className="text-lg font-bold mb-4 text-center text-green-600">
            Total for all orders:{" "}
            <span className="text-2xl text-red-700">
              {Number(billDetails.totalAmount).toFixed(2)} THB
            </span>
          </p>

          {billDetails.orders && billDetails.orders.length > 0 ? (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2 text-purple-600">
                รายการสั่งซื้อ
              </h2>
              <ul className="space-y-4">
                {billDetails.orders.map((order) => (
                  <li
                    key={order.id}
                    className="border p-4 rounded-md shadow-md bg-gray-100 hover:bg-gray-200 transition duration-300"
                  >
                    <div className="flex justify-between">
                      <span className="font-semibold text-orange-600">
                        Order ID: #{order.id}
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
                              **{item.menuItem.name}** x {item.quantity}
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
                  onClick={() => router.push("/")}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  Cancel / Back
                </button>

                {/* 💡 แก้ไข: เรียกใช้ printReceipt ด้วย billDetails และ roomId */}
                <button
                  onClick={() => printReceipt(billDetails, roomId)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center font-semibold transition"
                >
                  Print Receipt <PrinterIcon className="h-5 w-5 ml-2" />
                </button>

                {/* 💡 ปุ่มยืนยันชำระเงิน */}
                <button
                  onClick={() => handleCheckout(roomId, router)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  Confirm Payment / Checkout
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center mt-4 text-gray-500">
              No active orders found for this room.
            </p>
          )}
        </div>
      ) : (
        <p className="text-center mt-4 text-red-600">
          No bill details available for this room.
        </p>
      )}
    </div>
  );
};

export default PaymentPage;
