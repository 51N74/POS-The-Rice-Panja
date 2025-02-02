"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddMenu() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryName, setCategoryName] = useState(""); // Updated to categoryName
  const [categories, setCategories] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const menuCategories = [
    { id: 1, name: "อาหารจานเดียว" },
    { id: 2, name: "กับข้าว" },
    { id: 3, name: "ของทานเล่น" },
    { id: 4, name: "เครื่องดื่ม" },
    { id: 5, name: "Drinks" },
  ];

  // useEffect(() => {
  //   const fetchCategory = async () => {
  //     try {
  //       const response = await fetch("/api/menu/category");
  //       if (!response.ok) throw new Error("Failed to fetch categories");
  //       const data = await response.json();
  //       setCategories(data);
  //     } catch (error) {
  //       console.error("Error fetching categories:", error.message);
  //       setErrorMessage("Error fetching categories. Please try again.");
  //     }
  //   };

  //   fetchCategory();
  // }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files); // Store selected files directly
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("categoryName", categoryName);

    selectedFiles.forEach((file) => formData.append("images", file));

    try {
      const response = await fetch("/api/menu", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to submit menu item");
      const data = await response.json();
      console.log("Created new menu item:", data);
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Error submitting menu item:", error);
      setErrorMessage("Failed to submit. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add New Menu Item</h2>

        {errorMessage && (
          <div className="mb-4 text-red-600">{errorMessage}</div>
        )}

        <div className="space-y-4">
          {/* Menu Item Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Menu Item Name</label>
            <input
              type="text"
              name="name"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-black mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              placeholder="e.g., Margherita Pizza"
            />
          </div>

          {/* Category Selector */}
          {/* <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select
              id="category"
              name="category"
              required
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="text-black mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div> */}

<div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select
              id="category"
              name="category"
              required
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="text-black mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            >
              <option value="">Select a category</option>
              {menuCategories.map((category) => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              id="price"
              required
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="text-black mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              placeholder="e.g., 15.99"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              id="description"
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-black mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              placeholder="Brief description of the menu item"
            />
          </div>

          {/* Upload Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="text-black mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-8 flex items-center justify-between">
          <Link href="/admin/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-700">
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            Add Menu Item
          </button>
        </div>
      </form>
    </div>
  );
}
