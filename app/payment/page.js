'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const PaymentPage = () => {
    const router = useRouter();
    const { query } = router;

    // Check if query is defined and if tableId exists
    const tableId = query.tableId;

    const [billDetails, setBillDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!tableId) {
            console.error("No tableId found in query parameters.");
            setError("No table ID provided.");
            setLoading(false);
            return;
        }

        const fetchBillDetails = async () => {
            try {
                const response = await fetch(`/api/bill/${tableId}`);
                if (!response.ok) {
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
    }, [tableId]);

    if (loading) return <div className="text-center">Loading bill details...</div>;
    if (error) return <div className="text-red-600 text-center">{error}</div>;

    return (
        <div className="payment-page max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-4">Bill Details for Table {tableId}</h1>
            {/* Render bill details here */}
            {billDetails ? (
                <div>
                    {/* Render bill details */}
                </div>
            ) : (
                <p>No bill details available for this table.</p>
            )}
        </div>
    );
};

export default PaymentPage;
