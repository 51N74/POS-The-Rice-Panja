import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// export async function PATCH(request, { params }) {
//     try {
//       const { id } = params;
//       const body = await request.json();
  
//       // Start a transaction to update the menu item and manage images
//       const updatedMenuItem = await prisma.$transaction(async (prisma) => {
//         // Delete existing images associated with the menu item
//         await prisma.menuItemImage.deleteMany({
//           where: { menuItemId: Number(id) },
//         });
  
//         // Update the menu item details
//         const updatedItem = await prisma.menuItem.update({
//           where: { id: Number(id) },
//           data: {
//             name: body.name,
//             description: body.description,
//             price: parseFloat(body.price),
//             category: body.category,
//             images: {
//               create: body.images.map((imageUrl) => ({
//                 url: imageUrl,
//               })),
//             },
//           },
//           include: {
//             images: true, // Include the images in the response
//           },
//         });
  
//         return updatedItem;
//       });
  
//       return NextResponse.json(updatedMenuItem);
//     } catch (error) {
//       console.error(error);
//       return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
//     }
//   }
  
//GET
export async function GET(request, { params }) {
  try {
    const menuID = Number(params.id);
    const menuItem = await prisma.menuItem.findUnique({
      where: {
        id: menuID,
      },
      include: {
        // images: true,
        categories: {
          include: {
            menuCategory: true,
          },
        },
      },
    });
    return NextResponse.json(menuItem);
  } catch (error) {
    
  }
}

export async function PATCH(request, { params }) {
  const { id } = params;
  const { name, description, price, menuCategory } = await request.json();

  try {
    const updatedMenuItem = await prisma.menuItem.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        price,
        menuCategory
      },
      // include: {        
      //   categories: {
      //     include: {
      //       menuCategory: true,
      //     },
      //   },
      // },
    });
    return NextResponse.json(updatedMenuItem);
  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
  }
}
  
  
export async function DELETE(request, { params }) {
  try {
    const menuID = Number(params.id);
    
    // Check if the menuID is valid
    if (isNaN(menuID)) {
      return new Response(
        JSON.stringify({ message: "Invalid menu item ID." }),
        { status: 400 } // Bad Request
      );
    }

    const deleteMenu = await prisma.menuItem.delete({
      where: {
        id: menuID,
      },
    });

    return new Response(
      JSON.stringify({ message: "Delete Successful" }),
      { status: 200 } // OK
    );
  } catch (error) {
    console.error(error); // Log the error for debugging

    return new Response(
      JSON.stringify({ message: "Failed to delete item.", error: error.message }),
      { status: 500 } // Internal Server Error
    );
  }
}

