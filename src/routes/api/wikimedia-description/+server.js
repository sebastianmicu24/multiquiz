import { error } from '@sveltejs/kit';
import { JSDOM } from 'jsdom';

export async function GET({ url }) {
    const wikimediaUrl = url.searchParams.get('url');
    
    if (!wikimediaUrl) {
        throw error(400, 'Missing URL parameter');
    }

    console.log('Fetching description from Wikimedia URL:', wikimediaUrl);

    try {
        const response = await fetch(wikimediaUrl);
        console.log('Wikimedia response status:', response.status);
        console.log('Wikimedia response headers:', response.headers);

        if (!response.ok) {
            throw new Error(`Wikimedia request failed: ${response.status} ${response.statusText}`);
        }

        const html = await response.text();
        console.log('Received HTML content length:', html.length);
        
        // Parse the HTML using jsdom
        const dom = new JSDOM(html);
        const doc = dom.window.document;
        
        // Find the description element
        const descriptionElement = doc.querySelector('.description.en');
        console.log('Description element found:', !!descriptionElement);

        let description = 'No description available.';
        
        if (descriptionElement) {
            description = descriptionElement.textContent.replace(/^English:\s*/, '').trim();
            console.log('Extracted description:', description);
        }

        return new Response(JSON.stringify({ description }), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (err) {
        console.error('Error fetching Wikimedia description:', err);
        throw error(500, `Failed to fetch description: ${err.message}`);
    }
}