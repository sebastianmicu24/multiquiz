<script>
  import { page } from '$app/stores';
  import { writable } from 'svelte/store';
</script>

<header>
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
    background-color: #3498db;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  nav ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: flex;
  }

  nav li {
    margin: 0 1rem;
  }

  nav a {
    color: white;
    text-decoration: none;
    font-weight: bold;
    transition: color 0.3s ease;
  }

  nav a:hover {
    color: #ecf0f1;
  }

  .active a {
    color: #2c3e50;
  }

  .settings {
    position: relative;
  }

  .settings button {
    background: none;
    border: none;
    cursor: pointer;
    color: white;
  }

  .dropdown {
    position: absolute;
    right: 0;
    top: 100%;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    z-index: 10;
  }

  .dropdown button {
    display: block;
    width: 100%;
    padding: 0.5rem 1rem;
    text-align: left;
    background: none;
    border: none;
    cursor: pointer;
    color: #333;
  }

  .dropdown button:hover {
    background-color: #f0f0f0;
  }
</style>