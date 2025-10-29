"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const OrderForm = ({ onOrderSubmit, tableId, roomId }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [order, setOrder] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Main Dishes");
  const router = useRouter();

  // Fetch menu items based on the selected category
  const fetchMenuItemsByCategory = async (category) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/menu/category/${category}`);
      if (!response.ok) throw new Error("Failed to fetch menu items");

      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      setError("Failed to load menu items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch menu items for the initial category on load
  useEffect(() => {
    fetchMenuItemsByCategory(selectedCategory);
  }, [selectedCategory]);

  const addToOrder = (item) => {
    const existingItem = order.find((orderItem) => orderItem.id === item.id);
    if (existingItem) {
      setOrder(
        order.map((orderItem) =>
          orderItem.id === item.id
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem,
        ),
      );
    } else {
      setOrder([...order, { ...item, quantity: 1 }]);
    }
    setTotal(total + parseFloat(item.price));
  };

  const removeFromOrder = (item) => {
    const existingItem = order.find((orderItem) => orderItem.id === item.id);
    if (existingItem.quantity === 1) {
      setOrder(order.filter((orderItem) => orderItem.id !== item.id));
    } else {
      setOrder(
        order.map((orderItem) =>
          orderItem.id === item.id
            ? { ...orderItem, quantity: orderItem.quantity - 1 }
            : orderItem,
        ),
      );
    }
    setTotal(total - parseFloat(item.price));
  };

  const submitOrder = async () => {
    if (order.length === 0) {
      alert("Please add items to your order before submitting.");
      return;
    }

    if (!confirm("Are you sure you want to submit this order?")) {
      return;
    }

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: order.map((item) => ({
            menuItemId: item.id,
            quantity: item.quantity,
          })),
          total: total,
          tableId: tableId ?? null, // Use null if tableId or roomId not set
          roomId: roomId ?? null,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit order");

      const data = await response.json();
      console.log("Order submitted:", data);
      onOrderSubmit(data);
      setOrder([]);
      setTotal(0);
      alert("Order submitted successfully!");
    } catch (error) {
      console.error("Error submitting order:", error);

      alert("Failed to submit order. Please try again.");
    }
  };

  if (loading) return <div className="text-center">Loading menu items...</div>;
  if (error) return <div className="text-red-600 text-center">{error}</div>;

  return (
    <div className="order-form max-w-6xl mx-auto p-6 bg-yellow-50 rounded-lg shadow-lg">
      <div className="menu-items mb-8">
        <div className="flex flex-col sm:flex-row justify-between">
          <div className="flex space-x-2 mb-4 sm:mb-0">
            {["Main Dishes", "Appetizers", "Desserts", "Beverages"].map(
              (category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg transition duration-300
                    ${
                      selectedCategory === category
                        ? "bg-orange-500 text-white"
                        : "bg-orange-200 text-gray-700 hover:bg-orange-300"
                    }`}
                >
                  {category}
                </button>
              ),
            )}
          </div>

          <button
            onClick={() =>
              router.push(
                `/billing/${tableId ? `table/${tableId}` : `room/${roomId}`}`,
              )
            }
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Check All Bills{" "}
            {tableId ? `for Table ${tableId}` : `for Room ${roomId}`}
          </button>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-lg rounded-lg p-6 flex flex-col border border-orange-200"
            >
              <img
                src={
                  item.images.length > 0
                    ? `data:image/jpeg;base64,${Buffer.from(item.images[0].imageData).toString("base64")}`
                    : "/fallback-image-url.jpg"
                }
                alt={item.name}
                className="w-full h-48 object-cover rounded-t-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-orange-600">
                {item.name}
              </h3>
              <p className="text-gray-700 mb-2">{item.description}</p>
              <p className="text-lg font-bold mb-4 text-orange-500">
                ฿{parseFloat(item.price).toFixed(2)}
              </p>
              <button
                onClick={() => addToOrder(item)}
                className="mt-auto bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition duration-300"
              >
                Add to Order
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Current Order Section */}
      <div className="current-order mt-8 p-4 bg-white rounded-lg shadow-md border border-orange-200">
        <h2 className="text-3xl font-bold mb-4 text-orange-600">
          Current Order
        </h2>
        {order.length === 0 ? (
          <p className="text-gray-600">No items in order</p>
        ) : (
          <div>
            {order.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center mb-2"
              >
                <span className="text-lg text-gray-700">
                  {item.name} x {item.quantity}
                </span>
                <div className="flex items-center">
                  <span className="mr-2 font-bold text-orange-600">
                    ฿{(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeFromOrder(item)}
                    className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-4">
              <strong className="text-lg">
                Total:{" "}
                <span className="text-orange-600">฿{total.toFixed(2)}</span>
              </strong>
            </div>
            <button
              onClick={submitOrder}
              className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300"
            >
              Submit Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderForm;
