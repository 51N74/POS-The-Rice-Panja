// src/lib/printer.js

const PRINTER_IP = '192.168.1.100'; // ตัวอย่าง IP address ของเครื่องพิมพ์
const PRINTER_PORT = 9100; // ตัวอย่างพอร์ตของเครื่องพิมพ์

export async function printReceipt(orderData) {
  const receiptContent = generateReceiptContent(orderData);

  try {
    const response = await fetch(`http://${PRINTER_IP}:${PRINTER_PORT}/print`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: receiptContent }),
    });

    if (!response.ok) {
      throw new Error('Failed to print receipt');
    }

    console.log('Receipt printed successfully');
    return true;
  } catch (error) {
    console.error('Error printing receipt:', error);
    return false;
  }
}

function generateReceiptContent(orderData) {
  let content = '===== Receipt =====\n\n';
  content += `Order ID: ${orderData.id}\n`;
  content += `Date: ${new Date().toLocaleString()}\n\n`;

  content += 'Items:\n';
  orderData.items.forEach(item => {
    content += `${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\n`;
  });

  content += `\nTotal: $${orderData.total.toFixed(2)}\n`;
  content += '\nThank you for your order!\n';
  content += '==================\n';

  return content;
}