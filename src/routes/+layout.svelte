<script>
  import Header from '$lib/Header.svelte';
  import Footer from '$lib/Footer.svelte';
  import KeywordAlarm from '$lib/KeywordAlarm.svelte';
  import '$lib/darkTheme.css';
</script>

<div class="app">
  <Header />
  <main>
    <slot />
  </main>
  <Footer />
  <KeywordAlarm />
</div>

<style>
  :global(body) {
    margin: 0;
    min-height: 100vh;
  }

  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
    padding: 2rem;
    background-color: var(--bg-secondary);
  }
</style>