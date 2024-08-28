<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';

    let categoryData = null;

    onMount(async () => {
        const category = $page.params.category;
        const response = await fetch('/Appunti.json');
        const data = await response.json();
        const categoryItem = data.find(item => Object.keys(item)[0] === category);
        categoryData = categoryItem ? categoryItem[category] : null;
    });
</script>

<main>
    <h1>{$page.params.category}</h1>
    {#if categoryData}
        <ul>
            {#each Object.keys(categoryData) as subCategory}
                <li>
                    <a href="/quiz/anatomia_patologica/Teoria_Anapat/{encodeURIComponent($page.params.category)}/{encodeURIComponent(subCategory)}">
                        {subCategory}
                    </a>
                </li>
            {/each}
        </ul>
    {:else}
        <p>Loading data...</p>
    {/if}
</main>

<style>
       main {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
    }

    h1 {
        color: var(--text-primary);
        font-size: 2rem;
        margin-bottom: 1.5rem;
        text-align: center;
    }

    ul {
        list-style-type: none;
        padding: 0;
        /* display: grid; */
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
    }

    li {
        margin-bottom: 10px;
        padding: 15px;
        background-color: var(--bg-tertiary);
        border-radius: 8px;
        transition: transform 0.2s, box-shadow 0.2s;
        box-shadow: 0 2px 4px rgba(42, 42, 42, 0.1);
    }

    li:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    a {
        color: var(--text-secondary);
        text-decoration: none;
        font-weight: bold;
        display: block;
        padding: 10px;
        border-radius: 4px;
        transition: background-color 0.2s;
    }

    a:hover {
        background-color: var(--bg-primary);
    }

    @media (max-width: 600px) {
        ul {
            grid-template-columns: 1fr;
        }
    }
</style>