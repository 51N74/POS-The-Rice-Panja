import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ChartDataLabels);

function SalesChart() {
    const [orders, setOrders] = useState([]); 
    const [view, setView] = useState("daily"); 
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/order');
                if (!response.ok) throw new Error('Failed to fetch orders');
                
                const data = await response.json();
                setOrders(data); 
                generateChartData(data, view); 
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    useEffect(() => {
        if (orders.length > 0) { 
            generateChartData(orders, view);
        }
    }, [view, orders]);

    const generateChartData = (data, view) => {
        const salesByPeriod = {};

        data.forEach(order => {
            const date = new Date(order.createdAt);
            let key;

            if (view === "daily") {
                key = date.toISOString().split("T")[0];
            } else if (view === "monthly") {
                key = `${date.getFullYear()}-${date.getMonth() + 1}`;
            } else if (view === "yearly") {
                key = date.getFullYear();
            }

            salesByPeriod[key] = (salesByPeriod[key] || 0) + parseFloat(order.total);
        });

        setChartData({
            labels: Object.keys(salesByPeriod),
            datasets: [{
                label: 'Total Sales',
                data: Object.values(salesByPeriod),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            }]
        });
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">ยอดขายทั้งหมด</h3>
            
            <div className="mb-4">
                <label className="mr-2 font-medium">View By:</label>
                <select
                    value={view}
                    onChange={(e) => setView(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="daily">รายวัน</option>
                    <option value="monthly">รายเดือน</option>
                    <option value="yearly">รายปี</option>
                </select>
            </div>

            {orders.length > 0 ? (
                <div style={{ width: '100%', maxWidth: '100%', height: '600px', margin: '0 auto' }}>
                    <Bar
                        data={chartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { display: true, position: "top" },
                                datalabels: {
                                    display: true,
                                    align: 'end',
                                    anchor: 'end',
                                    color: 'blue',
                                    font: {
                                        weight: 'bold',
                                        size: 12
                                    },
                                    formatter: (value) => `${value.toLocaleString()} บาท`
                                },
                            },
                            scales: {
                                x: { title: { display: true, text: view === "daily" ? "Date" : view === "monthly" ? "Month" : "Year" } },
                                y: { title: { display: true, text: 'ยอดขายทั้งหมด (บาท)' } }
                            }
                        }}
                    />
                </div>
            ) : (
                <p className="text-center text-gray-500">Loading sales data...</p>
            )}
        </div>
    );
}

export default SalesChart;
