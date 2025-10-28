import React, { useState, useEffect } from "react";

const Menu = () => {
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
    <div className="menu p-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center text-green-600 mb-6">
        Our Menu
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
          >
            <img
              src={
                item.images.length > 0
                  ? item.images[0].url
                  : "fallback-image-url.jpg"
              }
              alt={item.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-2xl font-semibold text-green-700">
                {item.name}
              </h3>
              <p className="text-gray-600 mt-1">{item.description}</p>
              <p className="text-lg font-bold mt-2 text-red-600">
                ${parseFloat(item.price).toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 mt-1 italic">
                {item.category}
              </p>
              <button
                onClick={() => addToOrder(item)}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded-full transition-colors duration-300 hover:bg-green-600"
              >
                Add to Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
