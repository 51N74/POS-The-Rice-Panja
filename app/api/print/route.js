import { NextResponse } from "next/server";
const escpos = require("escpos");
escpos.Network = require("escpos-network");

// Example of handling a POST request
export async function POST(req) {
  try {
    // Parse the request body (assuming you send JSON data)
    const body = await req.json();

    const { ipAddress, port, orderDetails, date, totalAmount } = body;

    // ตั้งค่าที่อยู่ IP ของเครื่องพิมพ์และพอร์ต
    const networkDevice = new escpos.Network(ipAddress, port);
    const printer = new escpos.Printer(networkDevice);

    // เริ่มการพิมพ์
    networkDevice.open(function (error) {
      if (error) {
        console.error("Error opening device:", error);
        return;
      }

     
      // Set the encoding to Thai

      printer
      .control('ESC t 1') // Set to the appropriate code page for Thai
      .font('A') // Set Font A for Thai
      .encode('UTF-8') // Ensure UTF-8 encoding is set
      .size(1, 1) // Normal size
      .lineSpace(30) // Optional: adjust line spacing as needed
      .text("ร้านอาหารสวนปัญจะ") // Restaurant name in Thai
      .text("-----------------------------")
      .align("LT")
      .text(`โต๊ะ: ${orderDetails}`) // Room details in Thai
      .text(`วันที่: ${date}`) // Date in Thai
      .text(`รวมทั้งหมด: ${totalAmount} บาท`) // Total in Thai
      .text("-----------------------------")
      .align("CT")
      .text("ขอบคุณครับ!") // Thank you in Thai
      .cut()
      .close();
    });

    return NextResponse.json({
      success: true,
      message: "Receipt printed successfully",
    });
  } catch (error) {
    console.error("Error in printing process:", error);
    return NextResponse.json(
      { success: false, message: "Failed to print receipt", error },
      { status: 500 }
    );
  }
}
