export default async function handler(req, res) {
    const { tableId } = req.query;

    // Replace with your logic to fetch order summary
    const orderSummary = await getOrderSummaryByTableId(tableId); // Fetch based on your data structure

    if (!orderSummary) {
        return res.status(404).json({ message: 'No orders found for this table' });
    }

    res.status(200).json(orderSummary);
}
