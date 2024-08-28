<script>
  import { page } from '$app/stores';
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
    background-color: var(--bg-secondary);
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
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
</style>