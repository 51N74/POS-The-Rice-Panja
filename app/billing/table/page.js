// PaymentPage.js
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const PaymentPage = ({ params }) => {
  // 💡 แก้ไข 1: ตรวจสอบการ Destructure ชื่อตัวแปร (ควรเป็น tableId)
  // ถ้าชื่อโฟลเดอร์คือ [tableId] ใน params จะได้ { tableId: 'X' }
  const { tableId } = params;

  const [billDetails, setBillDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBillDetails = async () => {
      try {
        // 💡 แก้ไข 2: ใช้ tableId ที่ Destructure มา
        if (!tableId) {
          throw new Error("No table ID provided.");
        }

        // 💡 แก้ไข 3: เปลี่ยน API Path จาก /api/payment เป็น /api/tables (หรือ /api/order/summary)
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

    // 💡 ตรวจสอบ tableId ก่อนเรียก fetch
    if (tableId) {
      fetchBillDetails();
    } else {
      setLoading(false);
      setError("Table ID is missing from the URL.");
    }
  }, [tableId]); // Dependency array ใช้ tableId

  if (loading)
    return <div className="text-center py-8">Loading bill details...</div>;
  if (error)
    return <div className="text-red-600 text-center py-8">{error}</div>;

  return (
    <div className="payment-page max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* 💡 แก้ไข 4: ใช้ tableId เพื่อแสดงผล */}
      <h1 className="text-2xl font-bold mb-4">
        Bill Details for Table {tableId}
      </h1>
      {billDetails ? (
        <div>
          {/* ⚠️ โครงสร้างข้อมูลที่คาดหวังจาก /api/tables/[id] คือ { totalAmount: X, orders: [...] } */}
          {/* ถ้าใช้ API /api/tables/[id] ต้องแสดงผลเป็น billDetails.totalAmount */}
          <p className="text-lg font-semibold">
            Total:{" "}
            {Number(billDetails.totalAmount || billDetails.total || 0).toFixed(
              2,
            )}{" "}
            THB
          </p>

          {/* ⚠️ ส่วนนี้อาจไม่ตรงกับโครงสร้างข้อมูลจริง (ต้องมี orders.items) */}
          <div className="mt-4">
            {billDetails.orders && billDetails.orders.length > 0 ? (
              <div>
                <h2 className="text-xl font-semibold mt-4">Orders Summary:</h2>
                <ul className="mt-2 space-y-2">
                  {/* รวมรายการทั้งหมดจากทุกออเดอร์ใน billDetails.orders */}
                  {billDetails.orders.flatMap((order) =>
                    order.items.map((item, index) => (
                      <li
                        key={`${order.id}-${index}`}
                        className="border-b py-2 flex justify-between"
                      >
                        <span>
                          {item.menuItem?.name || "Item"} x {item.quantity}
                        </span>
                        <span>
                          {Number(
                            item.quantity * (item.menuItem?.price || 0),
                          ).toFixed(2)}{" "}
                          THB
                        </span>
                      </li>
                    )),
                  )}
                </ul>
              </div>
            ) : (
              <p>No active orders found for this table.</p>
            )}
          </div>
          {/* Button to proceed with payment */}
          <button
            onClick={() => router.push(`/payment/checkout/${tableId}`)}
            className="mt-6 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 font-semibold"
          >
            Proceed to Payment
          </button>
        </div>
      ) : (
        <p>No bill details available for this table.</p>
      )}
    </div>
  );
};

export default PaymentPage;
