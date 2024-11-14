// app/admin/editmenu/[id]/page.js
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
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
          const response = await fetch(`/api/menu/${id}`);
          const data = await response.json();
          setMenuItem(data);
          setLoading(false);
        } catch (err) {
          console.error("Failed to fetch menu item:", err);
        }
      };

      fetchMenuItem();
    }
  }, [id]);

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/menu/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: menuItem.name,
          description: menuItem.description,
          price: menuItem.price,
          // menuCategory:menuItem.category
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

  return (
    <div className="p-6 max-w-md mx-auto bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Edit Menu Item
      </h2>

      <form className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={menuItem.name}
            onChange={(e) => setMenuItem({ ...menuItem, name: e.target.value })}
            className=" text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter item name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={menuItem.description}
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
            value={menuItem.price}
            onChange={(e) =>
              setMenuItem({ ...menuItem, price: parseFloat(e.target.value) })
            }
            className=" text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter item price"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={menuItem.category}
            onChange={(e) =>
              setMenuItem({ ...menuItem, category: e.target.value })
            }
            className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select a category</option>
            <option value="Appetizer">อาหารจานเดียว</option>
            <option value="Entree">กับข้าว</option>
            <option value="Dessert">ของทานเล่น</option>
            <option value="Dessert">เครื่องดื่ม</option>
          </select>
        </div>
        <button
          onClick={handleSave}
          className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200 ease-in-out"
        >
          Save
        </button>
        {/* Cancel */}
        <Link
          href="/admin/dashboard"
          className="text-sm font-medium text-gray-500 hover:text-gray-700"
        >
         <button          
          className="w-full mt-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-200 ease-in-out"
        >
          Cancel
        </button>
        </Link>
      </form>
    </div>
  );
};

export default EditMenu;
