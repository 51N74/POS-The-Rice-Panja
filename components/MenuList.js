"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Filter from "./Filter";
import Pagination from "./Pagination";
import PageInfo from "./PageInfo";
import RowsPerPage from "./RowsPerPage";
const MenuList = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch("/api/menu");
      if (!response.ok) {
        throw new Error("Failed to fetch menu items");
      }
      const data = await response.json();
      console.log("Fetched Menu Items:", data); // เพิ่มบรรทัดนี้เพื่อตรวจสอบข้อมูล
      setMenuItems(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <Link
          href="/admin/addmenu"
          className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-500 transition duration-200"
        >
          + Add Item
        </Link>
        {/* <div className="flex space-x-6">
        <a href="#" className="text-gray-600 hover:text-green-600 font-semibold transition">Import</a>
        <a href="#" className="text-gray-600 hover:text-green-600 font-semibold transition">Export</a>
      </div> */}
      </div>

      {/* Filters
    <div className="flex justify-between items-center space-x-4">
      <div className="flex space-x-4">
        <Filter label="Category" options={['All Items', 'อาหาร']} />
        <Filter label="Stock Alert" options={['All Items']} />
      </div>
      <button className="text-gray-600 hover:text-green-600 transition">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m4 0a4 4 0 11-8 0 4 4 0 018 0zm0 0h.01M15 12v.01" />
        </svg>
      </button>
    </div> */}

      {/* Item Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full">
          <thead>
            <tr className="bg-green-600 text-white text-sm font-semibold tracking-wider uppercase">
              <th className="py-3 px-6 text-center">
                <input type="checkbox" className="form-checkbox" />
              </th>
              <th className="py-3 px-6 text-left">Item Name</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-left">Category</th>
              <th className="py-3 px-6 text-left">Price</th>
              <th className="py-3 px-6 text-left">แก้ไข</th>
              <th className="py-3 px-6 text-left">ลบ</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 divide-y divide-gray-200">
            {menuItems.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="py-3 px-6 text-center">
                  <input type="checkbox" className="form-checkbox" />
                </td>
                <td className="py-3 px-6 font-semibold">{item.name}</td>
                <td className="py-3 px-6 text-sm text-gray-600">
                  {item.description}
                </td>
                <td className="py-3 px-6">
                  {item.categories?.map((category, idx) => (
                    <span key={idx} className="mr-1">
                      {category.menuCategory.name}
                    </span>
                  ))}
                </td>
                <td className="py-3 px-6 font-semibold text-green-600">
                  {item.price} ฿
                </td>
                <td className="py-3 px-6">
                  <Link
                    href={`/admin/editmenu/${item.id}`}
                    className="text-green-600 hover:text-green-800 transition"
                  >
                    Edit
                  </Link>
                </td>
                <td className="py-3 px-6">
                  <button
                    onClick={async () => {
                      const confirmed = confirm(
                        "Are you sure you want to delete this item?"
                      );
                      if (confirmed) {
                        try {
                          const response = await fetch(`/api/menu/${item.id}`, {
                            method: "DELETE",
                          });
                          if (response.ok) {
                            // Handle successful deletion (e.g., refresh the list or remove the item from the UI)
                            alert("Item deleted successfully.");
                            // Optionally refresh the page or update the UI here
                          } else {
                            throw new Error("Failed to delete item.");
                          }
                        } catch (error) {
                          console.error(error);
                          alert(
                            "An error occurred while trying to delete the item."
                          );
                        }
                      }
                    }}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <Pagination />
        <PageInfo currentPage={1} totalPages={1} />
        <RowsPerPage options={[10, 25, 50]} />
      </div>
    </div>
  );
};

export default MenuList;
