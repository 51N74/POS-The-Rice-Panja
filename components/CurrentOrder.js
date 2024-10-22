// src/components/CurrentOrder.js

'use client';
import React from "react";

const CurrentOrder = ({ order, total, removeFromOrder, submitOrder }) => {
  return (
    <div className="current-order w-full p-4 bg-white rounded-lg shadow-md border border-orange-200">
      <h2 className="text-3xl font-bold mb-4 text-orange-600">Current Order</h2>
      {order.length === 0 ? (
        <p className="text-gray-600">No items in order</p>
      ) : (
        <div>
          {order.map((item) => (
            <div key={item.id} className="flex justify-between items-center mb-2">
              <span className="text-lg text-gray-700">
                {item.name} x {item.quantity}
              </span>
              <div className="flex items-center">
                <span className="mr-2 font-bold text-orange-600">
                  ${(parseFloat(item.price) * item.quantity).toFixed(2)}
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
              Total: <span className="text-orange-600">${total}</span>
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
  );
};

export default CurrentOrder;
