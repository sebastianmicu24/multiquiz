import { writeFile } from 'fs/promises';
import { json } from '@sveltejs/kit';
import { join } from 'path';

export async function POST({ request }) {
  console.log('POST request received for /api/saveAppunti');
  try {
    const appunti = await request.json();
    console.log('Current working directory:', process.cwd());
    const filePath = join(process.cwd(), 'data', 'Appunti.json');
    console.log('Attempting to write to:', filePath);
    await writeFile(filePath, JSON.stringify(appunti, null, 2));
    console.log('File written successfully');
    return json({ success: true });
  } catch (error) {
    console.error('Error saving appunti:', error);
    return new Response(JSON.stringify({
      error: `Failed to save appunti: ${error.message}`,
      path: join(process.cwd(), 'data', 'Appunti.json'),
      stack: error.stack
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}