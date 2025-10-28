// app/api/print/route.js

import { NextResponse } from "next/server";
// ⚠️ เนื่องจากโค้ดนี้มีการเชื่อมต่อ I/O ภายนอก (Printer Network)
// จึงจำเป็นต้องใช้ Node.js Runtime และป้องกัน Static Generation
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const escpos = require("escpos");
escpos.Network = require("escpos-network");

// ฟังก์ชันแปลง escpos.Network.open() ให้เป็น Promise
function printPromise(networkDevice, printer, content) {
  return new Promise((resolve, reject) => {
    networkDevice.open(function (error) {
      if (error) {
        console.error("Error opening network device:", error);
        return reject(new Error("Failed to connect to printer."));
      }

      try {
        // สร้างใบเสร็จโดยใช้ content ที่ส่งเข้ามา
        printer
          .control("ESC t 1") // Set to the appropriate code page for Thai (CP874, often 1)
          .font("A")
          .encode("UTF-8")
          .size(1, 1)
          .lineSpace(30)
          .text(content.restaurantName || "ร้านอาหารสวนปัญจะ")
          .text("--------------------------------")
          .align("LT")
          // ส่วนแสดงรายการอาหาร (เพิ่ม Logic ส่วนนี้)
          .text("รายการอาหาร:")
          .text(
            content.orderDetails
              .map((item) => `${item.name} x${item.quantity} = ${item.price}`)
              .join("\n"),
          )
          .text("--------------------------------")
          .text(`โต๊ะ: ${content.tableRoomDetails}`)
          .text(`วันที่: ${content.date}`)
          .text("--------------------------------")
          .size(2, 2) // ขนาดใหญ่สำหรับยอดรวม
          .text(`รวมทั้งหมด: ${content.totalAmount} บาท`)
          .size(1, 1)
          .align("CT")
          .text("--------------------------------")
          .text("ขอบคุณครับ!")
          .cut()
          .close(resolve); // เรียก resolve เมื่อการพิมพ์เสร็จสิ้น
      } catch (printError) {
        console.error("Error during printing commands:", printError);
        // พยายามปิดการเชื่อมต่อแม้จะมี error
        networkDevice.close(() =>
          reject(new Error("Error executing print commands.")),
        );
      }
    });
  });
}

// Example of handling a POST request
export async function POST(req) {
  try {
    const body = await req.json();

    const {
      ipAddress,
      port,
      orderDetails,
      date,
      totalAmount,
      restaurantName,
      tableRoomDetails,
    } = body;

    // 1. ตั้งค่าที่อยู่ IP และพอร์ต
    const networkDevice = new escpos.Network(ipAddress, port || 9100);
    const printer = new escpos.Printer(networkDevice);

    // 2. ข้อมูลที่จะพิมพ์
    const printContent = {
      restaurantName: restaurantName || "ร้านอาหารสวนปัญจะ",
      tableRoomDetails: tableRoomDetails || orderDetails, // ใช้ orderDetails เป็นค่าสำรอง
      date: date || new Date().toLocaleString(),
      totalAmount: parseFloat(totalAmount).toFixed(2),
      orderDetails: Array.isArray(orderDetails) ? orderDetails : [], // ตรวจสอบว่าเป็น Array
    };

    // 3. รอให้การพิมพ์เสร็จสิ้นโดยใช้ Promise
    await printPromise(networkDevice, printer, printContent);

    return NextResponse.json({
      success: true,
      message: "Receipt printed successfully",
    });
  } catch (error) {
    console.error("Error in printing process:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to print receipt or connect to printer.",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
