// kode ini contoh dari dokumentasi vercel


import { handleUpload } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json(); // handleUpload expects the raw request body

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname /*, clientPayload */) => {
        // Generate a client token for the browser to upload the file
        // ⚠️ Authenticate and authorize users before generating the token.
        // Otherwise, you're allowing anonymous uploads.
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp'],
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            // optional, sent to your server on upload completion
            // you could pass a user id from auth, or a value from clientPayload
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Get notified of client upload completion
        // ⚠️ This will not work on `localhost` websites,
        // Use ngrok or similar to get the full upload flow
        console.log('blob upload completed', blob, tokenPayload);

        try {
          // Run any logic after the file upload completed
          // const { userId } = JSON.parse(tokenPayload);
          // await db.update({ avatar: blob.url, userId });
          // Anda akan menyimpan blob.url ini ke database backend Anda di sini
        } catch (error) {
          console.error("Error in onUploadCompleted callback:", error);
          throw new Error('Could not update user or process upload completion');
        }
      },
    });

    console.log("handleUpload jsonResponse:", jsonResponse);
    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error('Error in /api/bisnis/avatar route:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 },
    );
  }
}

// Fungsi DELETE (opsional) - Anda bisa menambahkannya jika diperlukan
// export async function DELETE(request) {
//   // Implementasi penghapusan blob
// } 