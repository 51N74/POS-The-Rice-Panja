'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const PaymentPage = ({ params }) => {
    const { tableid } = params;  // Extract tableid from params
    const [billDetails, setBillDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
       
        const fetchBillDetails = async () => {
            try {
                if (!tableid) {
                    throw new Error("No table ID provided.");
                }
        
                const response = await fetch(`/api/payment/${tableid}`);
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
    }, [tableid]);

    if (loading) return <div className="text-center">Loading bill details...</div>;
    if (error) return <div className="text-red-600 text-center">{error}</div>;

    return (
     

        <div className="payment-page max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-4">Bill Details for Table {tableNumber}</h1>
            {billDetails ? (
                <div>
                    {/* Render bill details here */}
                    <p className="text-lg">Total: {billDetails.total} THB</p>
                    <p className="text-lg">Status: {billDetails.status}</p>
                    <div className="mt-4">
                        {billDetails.items && billDetails.items.length > 0 ? (
                            <div>
                                <h2 className="text-xl font-semibold">Ordered Items:</h2>
                                <ul className="mt-2">
                                    {billDetails.items.map((item, index) => (
                                        <li key={index} className="border-b py-2">
                                            {item.name} x{item.quantity} - {item.price} THB
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p>No items found in the bill.</p>
                        )}
                    </div>
                    {/* Button to proceed with payment */}
                    {/* <button
                        onClick={() => router.push(`/payment/confirm/${tableid}`)}
                        className="mt-6 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
                    >
                        Proceed to Payment
                    </button> */}
                </div>
            ) : (
                <p>No bill details available for this table.</p>
            )}
        </div>
    );
};

export default PaymentPage;
