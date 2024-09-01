<script>
import { onMount } from 'svelte';

export let searchTerm = '';

let images = [];
let loading = false;
let error = null;
let selectedImage = null;
let currentImageIndex = 0;

async function fetchImages() {
    loading = true;
    error = null;
    try {
        const url = constructURL(searchTerm);
        const response = await fetch(`/api/wikimedia-images?url=${encodeURIComponent(url)}`);
        if (!response.ok) throw new Error('Failed to fetch images');
        const data = await response.json();
        images = data;
    } catch (err) {
        error = err.message;
    } finally {
        loading = false;
    }
}

function constructURL(searchTerm) {
    const baseURL = "https://commons.wikimedia.org/w/index.php";
    const params = new URLSearchParams({
        search: searchTerm,
        title: "Special:MediaSearch",
        go: "Go",
        type: "image"
    });
    return `${baseURL}?${params.toString()}`;
}

function getDescriptionUrl(src) {
    const filename = getFilename(src);
    return `https://commons.wikimedia.org/wiki/File:${filename}`;
}

async function openModal(image, index) {
    console.log('Opening modal for image:', image);
    currentImageIndex = index;
    selectedImage = { ...image, description: 'Loading description...' };
    await fetchImageDescription(selectedImage);
}

async function fetchImageDescription(image) {
    const descriptionUrl = getDescriptionUrl(image.src);
    console.log('Fetching description from URL:', descriptionUrl);
    try {
        const response = await fetch(`/api/wikimedia-description?url=${encodeURIComponent(descriptionUrl)}`);
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        const text = await response.text();
        console.log('Response text:', text);
        if (!response.ok) throw new Error(`Failed to fetch description: ${response.status} ${response.statusText}`);
        const data = JSON.parse(text);
        console.log('Parsed data:', data);
        selectedImage = { ...selectedImage, description: data.description || 'No description available.' };
    } catch (err) {
        console.error('Error fetching image description:', err);
        selectedImage = { ...selectedImage, description: `Failed to load description: ${err.message}` };
    }
    console.log('Final selectedImage:', selectedImage);
}

function closeModal() {
    selectedImage = null;
}

function getFilename(src) {
    const parts = src.split('/');
    const filename = parts[parts.length - 1];
    // Remove dimension prefix (e.g., "270px-") from the filename
    return filename.replace(/^\d+px-/, '');
}

function navigateImage(direction) {
    currentImageIndex = (currentImageIndex + direction + images.length) % images.length;
    openModal(images[currentImageIndex], currentImageIndex);
}

onMount(() => {
    if (searchTerm) fetchImages();
});

$: if (searchTerm) fetchImages();
</script>

<div>
    {#if loading}
        <p>Loading images...</p>
    {:else if error}
        <p>Error: {error}</p>
    {:else if images.length === 0}
        <p>No images found for "{searchTerm}"</p>
    {:else}
        <div class="image-grid">
            {#each images as image, index}
                <div class="image-item" on:click={() => openModal(image, index)}>
                    <img src={image.src} alt={image.alt} loading="lazy" />
                    <p>{image.title}</p>
                </div>
            {/each}
        </div>
    {/if}
</div>

{#if selectedImage}
    <div class="modal" on:click={closeModal}>
        <div class="modal-content" on:click|stopPropagation>
            <span class="close" on:click={closeModal}>&times;</span>
            <img src={selectedImage.src.replace('/thumb/', '/').split('/').slice(0, -1).join('/')} alt={selectedImage.alt} />
            <p class="description">{selectedImage.description}</p>
            <h3>{selectedImage.title}</h3>
            <a href={getDescriptionUrl(selectedImage.src)} target="_blank" rel="noopener noreferrer">View on Wikimedia Commons</a>
            <button class="nav-button left" on:click={() => navigateImage(-1)}></button>
            <button class="nav-button right" on:click={() => navigateImage(1)}></button>
        </div>
    </div>
{/if}

<style>
    .image-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
    }
    .image-item {
        text-align: center;
        cursor: pointer;
    }
    .image-item img {
        max-width: 100%;
        height: auto;
        transition: transform 0.3s ease;
    }
    .image-item:hover img {
        transform: scale(1.05);
    }
    .modal {
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.9);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .modal-content {
        background-color: darkslategray;
        padding: 20px;
        border-radius: 5px;
        max-width: 80%;
        max-height: 80%;
        overflow: auto;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
    }
    .close {
        color: #aaa;
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
    }
    .close:hover,
    .close:focus {
        color: #fff;
        text-decoration: none;
        cursor: pointer;
    }
    .modal-content img {
        max-width: 80%;
        max-height: 90%;
        height: auto;
        margin: 0 auto;
    }
    .description {
        margin-top: 1rem;
        margin-bottom: 1rem;
    }
    .nav-button {
        position: absolute;
        top: 50%;
        background-color: transparent;
        border: none;
        width: 50px;
        height: 50px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    .nav-button::before {
        content: '';
        position: absolute;
        top: 50%;
        width: 20px;
        height: 20px;
        border-top: 3px solid white;
        border-right: 3px solid white;
        transition: all 0.3s ease;
    }
    .nav-button:hover::before {
        border-color: #ddd;
    }
    .nav-button.left {
        left: 20px;
    }
    .nav-button.right {
        right: 20px;
    }
    .nav-button.left::before {
        left: 15px;
        transform: translate(-50%, -50%) rotate(-135deg);
    }
    .nav-button.right::before {
        right: 15px;
        transform: translate(50%, -50%) rotate(45deg);
    }
</style>