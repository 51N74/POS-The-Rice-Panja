
// pages/print.js
'use client';

import { useState } from 'react';

export default function PrintTest() {
  const [message, setMessage] = useState('');

  const handlePrint = async () => {
    try {
      const res = await fetch('/api/print');
      if (res.ok) {
        setMessage('Printing success!');
      } else {
        setMessage('Printing failed.');
      }
    } catch (error) {
      setMessage('Error occurred: ' + error.message);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Test Print Page</h1>
      <button onClick={handlePrint} style={{ padding: '10px 20px',backdropFilter: 'blur(10px)' }}>
        Print Test Receipt
      </button>
      <p>{message}</p>
    </div>
  );
}
