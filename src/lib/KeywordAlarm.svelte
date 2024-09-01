<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  let showAlarm = false;
  let keyword = '';
  let error = '';

  onMount(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      showAlarm = true;
    }
  });

  function checkKeyword() {
    if (keyword === 'Anne-D-Cappato') {
      localStorage.setItem('hasVisited', 'true');
      showAlarm = false;
    } else {
      error = 'Incorrect keyword. Please try again.';
    }
  }
</script>

{#if showAlarm}
  <div class="alarm-overlay" transition:fade>
    <div class="alarm-content">
      <h2>Sito ad utilizzo privato</h2>
      <p>Questo sito contiene materiale protetto, siete pregati di non accedervi se non autorizzati direttamente dal proprietario. Il sito non si assume alcuna responabilità per quanto riguarda un utilizzo improprio da parte dell'utente.</p>
      <input type="text" bind:value={keyword} placeholder="Enter keyword">
      <button on:click={checkKeyword}>Submit</button>
      {#if error}
        <p class="error">{error}</p>
      {/if}
    </div>
  </div>
{/if}

<style>
  .alarm-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .alarm-content {
    background-color: darkslategrey;
    padding: 2rem;
    border-radius: 8px;
    text-align: center;
  }

  input {
    margin: 1rem 0;
    padding: 0.5rem;
    width: 100%;
  }

  button {
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 0.5rem 1rem;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
  }

  .error {
    color: red;
    margin-top: 1rem;
  }
</style>