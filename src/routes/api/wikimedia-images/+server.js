import { error, json } from '@sveltejs/kit';
import * as cheerio from 'cheerio';

export async function GET({ url }) {
    const searchUrl = url.searchParams.get('url');
    if (!searchUrl) {
        throw error(400, 'Missing URL parameter');
    }

    try {
        const response = await fetch(searchUrl);
        const html = await response.text();
        const $ = cheerio.load(html);

        const images = [];
        $('.sdms-image-result').each((i, elem) => {
            const $img = $(elem).find('img');
            const src = $img.attr('src');
            const alt = $img.attr('alt');
            const title = $(elem).find('.sdms-image-title').text().trim();
            const pageUrl = $(elem).find('a.sdms-image-title').attr('href');

            if (src && alt) {
                images.push({ src, alt, title, pageUrl });
            }
        });

        return json(images);
    } catch (err) {
        console.error('Error fetching Wikimedia images:', err);
        throw error(500, 'Failed to fetch Wikimedia images');
    }
}
