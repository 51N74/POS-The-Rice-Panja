// app/admin/editmenu/[id]/page.js

"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

// 💡 การแก้ไขสำคัญ: บังคับให้ใช้ Server-Side Rendering (SSR)
// เพื่อข้ามการดึงข้อมูลที่ล้มเหลวใน Build Time (แก้ Error: Failed to collect page data)
export const dynamic = "force-dynamic";

const EditMenu = () => {
  const { id } = useParams(); // ดึง id จาก URL โดยใช้ useParams
  const router = useRouter(); // ใช้ useRouter สำหรับการนำทางหลังจากการแก้ไขสำเร็จ
  const [menuItem, setMenuItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูลเมนูโดยใช้ id
  useEffect(() => {
    if (id) {
      const fetchMenuItem = async () => {
        try {
          // เรียกใช้ API Route Handler ที่ /api/menu/[id]
          const response = await fetch(`/api/menu/${id}`);

          if (!response.ok) {
            throw new Error("Failed to fetch menu item");
          }

          const data = await response.json();
          setMenuItem(data);
          setLoading(false);
        } catch (err) {
          console.error("Failed to fetch menu item:", err);
          setLoading(false);
          // อาจจะตั้งค่า setError(err.message) ด้วยก็ได้ หากต้องการแสดง error ให้ผู้ใช้เห็น
        }
      };

      fetchMenuItem();
    }
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault(); // ป้องกันการ Submit form แบบ Default

    // ตรวจสอบว่า menuItem ไม่ใช่ null ก่อนเรียกใช้
    if (!menuItem) return;

    try {
      const response = await fetch(`/api/menu/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: menuItem.name,
          description: menuItem.description,
          price: menuItem.price,
          // ส่งเฉพาะชื่อ Category ไปยัง PATCH handler
          menuCategory: menuItem.categories,
        }),
      });

      if (response.ok) {
        alert("Menu item updated successfully!");
        router.push("/admin/dashboard"); // เปลี่ยนเส้นทางกลับไปยังหน้ารายการเมนู
      } else {
        throw new Error("Failed to update menu item");
      }
    } catch (err) {
      console.error(err.message);
      alert("An error occurred while updating the menu item");
    }
  };

  if (loading) return <p>Loading...</p>;

  // ตรวจสอบข้อมูลหลักอีกครั้งก่อน render
  if (!menuItem) return <p>Menu item not found or failed to load.</p>;

  return (
    <div className="p-6 max-w-md mx-auto bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Edit Menu Item
      </h2>

      <form className="space-y-5" onSubmit={handleSave}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={menuItem.name || ""}
            onChange={(e) => setMenuItem({ ...menuItem, name: e.target.value })}
            className=" text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter item name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={menuItem.description || ""}
            onChange={(e) =>
              setMenuItem({ ...menuItem, description: e.target.value })
            }
            className=" text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter item description"
            rows="4"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price
          </label>
          <input
            type="number"
            value={menuItem.price || ""}
            onChange={(e) =>
              setMenuItem({ ...menuItem, price: parseFloat(e.target.value) })
            }
            className=" text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter item price"
            required
          />
        </div>

        {/* ส่วน Category: ปรับปรุงการจัดการค่าเริ่มต้นและ onChange ตามโครงสร้างข้อมูลจริง */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          {/* เนื่องจากคุณใช้ menuItem.categories ในการแสดงผลใน PATCH handler,
             อาจต้องมีการปรับปรุง logic ในการเลือกค่าให้เหมาะสมกับโครงสร้างข้อมูล */}
          <select
            // ค่าเริ่มต้นของ select อาจจะต้องปรับปรุงตามโครงสร้างข้อมูลจริงของ categories
            // เช่น value={menuItem.categories?.[0]?.menuCategory?.name || ''}
            className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            // onChange handler: คุณจะต้องจัดการการเลือก category ให้สอดคล้องกับโครงสร้างที่จะส่งไป PATCH
          >
            <option value="">Select a category</option>
            <option value="Appetizer">อาหารจานเดียว</option>
            <option value="Entree">กับข้าว</option>
            <option value="Dessert">ของทานเล่น</option>
            <option value="Drink">เครื่องดื่ม</option>
          </select>
        </div>

        <button
          type="submit" // ใช้ type="submit" เพื่อให้เรียกใช้ handleSave
          className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200 ease-in-out"
        >
          Save
        </button>
        {/* Cancel Button */}
        <Link href="/admin/dashboard" className="block text-center w-full mt-4">
          <button
            type="button"
            className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-200 ease-in-out"
          >
            Cancel
          </button>
        </Link>
      </form>
    </div>
  );
};

export default EditMenu;
