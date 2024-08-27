<script>
  import Header from '$lib/Header.svelte';
  import Footer from '$lib/Footer.svelte';
</script>

<div class="app">
  <Header />
  <main>
    <slot />
  </main>
  <Footer />
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: Arial, sans-serif;
    min-height: 100vh;
    position: relative;
    padding-bottom: 60px; /* Height of the footer */
  }

  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
    padding: 2rem;
  }
</style>