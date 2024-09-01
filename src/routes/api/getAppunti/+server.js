import { json } from '@sveltejs/kit';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  console.log('GET request received for /api/getAppunti');
  try {
    console.log('Current working directory:', process.cwd());
    const filePath = join(process.cwd(), 'static', 'Appunti.json');
    console.log('Attempting to read from:', filePath);
    const data = await readFile(filePath, 'utf-8');
    console.log('File read successfully');
    console.log('File contents:', data.substring(0, 100) + '...'); // Log the first 100 characters of the file
    const appunti = JSON.parse(data);
    console.log('JSON parsed successfully');
    return json(appunti);
  } catch (error) {
    console.error('Error reading appunti:', error);
    return new Response(JSON.stringify({
      error: `Failed to read appunti: ${error.message}`,
      path: join(process.cwd(), 'static', 'Appunti.json'),
      stack: error.stack
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}