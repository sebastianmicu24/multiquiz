<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  let canGoBack = false;

  onMount(() => {
    canGoBack = window.history.length > 1;
  });

  function goBack() {
    window.history.back();
  }
</script>

<header>
  {#if canGoBack}
    <button on:click={goBack} class="go-back-btn" aria-label="Go back">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
    </button>
  {/if}
  <nav>
    <ul>
      <li class:active={$page.url.pathname === '/'}>
        <a href="/">Home</a>
      </li>
      <li class:active={$page.url.pathname === '/profile'}>
        <a href="/profile">Profilo</a>
      </li>
    </ul>
  </nav>
</header>

<style>
  header {
    background-color: var(--bg-secondary);
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    position: fixed; /* Make the header fixed */
    top: 0; /* Position it at the top */
    left: 0; /* Position it at the left */
    width: 100%; /* Full width */
    z-index: 10; /* Ensure it stays on top of other elements */
  }

  nav {
    display: flex;
    justify-content: center;
  }

  nav ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: center;
  }

  nav li {
    margin: 0 1rem;
  }

  nav a {
    color: var(--text-secondary);
    text-decoration: none;
    font-weight: bold;
    transition: color 0.3s ease;
    font-size: 1.1rem;
  }

  nav a:hover {
    color: var(--accent-color);
  }

  .active a {
    color: var(--accent-color);
  }

  .go-back-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0.5rem;
    transition: color 0.3s ease;
    position: absolute;
    top: 50%;
    left: 1rem;
    transform: translateY(-50%);
  }

  .go-back-btn:hover {
    color: var(--accent-color);
  }

  .go-back-btn svg {
    display: block;
  }
</style>
