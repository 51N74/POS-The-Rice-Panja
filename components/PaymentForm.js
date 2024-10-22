import { useState } from "react";
import { printReceipt } from '../app/lib/printer';
const PaymentForm = ({ orderId, total, onPaymentComplete,orderItems }) => {
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [isPrinting, setIsPrinting] = useState(false);

    // แปลง total เป็น number
    const totalAmount = parseFloat(total);
  
    const handlePayment = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch('/api/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            amount: totalAmount, // ส่งค่าเป็น number
            method: paymentMethod,
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to process payment');
        }
  
        const data = await response.json();
        console.log('Payment processed:', data);
        alert('Payment processed successfully!');

      // Print receipt
      setIsPrinting(true);
      const printResult = await printReceipt({ id: orderId, total, items: orderItems });
      setIsPrinting(false);

      if (printResult) {
        alert('Payment processed and receipt printed successfully!');
      } else {
        alert('Payment processed successfully, but failed to print receipt. Please check the printer.');
      }
        onPaymentComplete();
      } catch (error) {
        console.error('Error processing payment:', error);
        alert('Failed to process payment. Please try again.');
      }
    };
  
    return (
      <div className="payment-form mt-8">
        <h2 className="text-2xl font-bold mb-4">Payment</h2>
        <form onSubmit={handlePayment}>
          <div className="mb-4">
            <label className="block mb-2">Payment Method:</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="cash">Cash</option>
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
            </select>
          </div>
          <div className="mb-4">
            <strong>Total Amount: {totalAmount.toFixed(2)} บาท</strong>
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            Process Payment
          </button>

         <button
            type="button"
            className="bg-red-500 text-white mx-2 px-6 py-2 rounded hover:bg-red-600"
            onClick={onPaymentComplete}
          >
            Cancel
          </button>

          <button
          type="submit"
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          disabled={isPrinting}
        >
          {isPrinting ? 'Printing...' : 'Process Payment and Print Receipt'}
        </button>
        </form>
      </div>
    );
  };
  
  export default PaymentForm;
  

  