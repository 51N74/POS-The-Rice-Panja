// src/components/ReceiptPrinter.js

import React, { useState, useEffect } from 'react';

const ReceiptPrinter = ({ order }) => {
  const [port, setPort] = useState(null);
  const [printerConnected, setPrinterConnected] = useState(false);

  useEffect(() => {
    // Check if Web Serial API is supported
    if ('serial' in navigator) {
      console.log('Web Serial API supported');
    } else {
      console.warn('Web Serial API not supported');
    }
  }, []);

  const connectPrinter = async () => {
    try {
      const selectedPort = await navigator.serial.requestPort();
      await selectedPort.open({ baudRate: 9600 });
      setPort(selectedPort);
      setPrinterConnected(true);
      console.log('Printer connected successfully');
    } catch (error) {
      console.error('Error connecting to printer:', error);
    }
  };

  const printReceipt = async () => {
    if (!port) {
      console.error('Printer not connected');
      return;
    }

    const writer = port.writable.getWriter();
    const encoder = new TextEncoder();

    try {
      // Print header
      await writer.write(encoder.encode('===== Receipt =====\n'));
      await writer.write(encoder.encode(`Order ID: ${order.id}\n`));
      await writer.write(encoder.encode(`Date: ${new Date().toLocaleString()}\n\n`));

      // Print order items
      for (const item of order.items) {
        await writer.write(encoder.encode(`${item.name} x${item.quantity}: $${(item.price * item.quantity).toFixed(2)}\n`));
      }

      // Print total
      await writer.write(encoder.encode(`\nTotal: $${order.total.toFixed(2)}\n`));

      // Print footer
      await writer.write(encoder.encode('\nThank you for your order!\n'));
      await writer.write(encoder.encode('====================\n'));

      // Feed paper and cut
      await writer.write(encoder.encode('\n\n\n\n\n'));
      await writer.write(Uint8Array.from([0x1D, 0x56, 0x41, 0x10])); // Paper cut command

      console.log('Receipt printed successfully');
    } catch (error) {
      console.error('Error printing receipt:', error);
    } finally {
      writer.releaseLock();
    }
  };

  return (
    <div className="receipt-printer mt-4">
      {!printerConnected ? (
        <button
          onClick={connectPrinter}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Connect Printer
        </button>
      ) : (
        <button
          onClick={printReceipt}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Print Receipt
        </button>
      )}
    </div>
  );
};

export default ReceiptPrinter;