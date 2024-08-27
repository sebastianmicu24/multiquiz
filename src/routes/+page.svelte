<script>
  import { goto } from '$app/navigation';
</script>

<main>
  <h1>Quiz Sapienza C</h1>
  <p>Preparati per gli esami svolgendo dei quiz!</p>
  <div class="button-container">
    <button on:click={() => goto('/quiz/psichiatria')}>Psichiatria</button>
    <button on:click={() => goto('/quiz/sanita_pubblica')}>Sanità Pubblica</button>
    <button on:click={() => goto('/quiz/igiene')}>Igiene</button>
    <button on:click={() => goto('/quiz/anatomia_patologica')}>Anatomia Patologica</button>
  </div>
</main>

<style>
  main {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
  }

  h1 {
    color: #333;
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  p {
    color: #666;
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }

  .button-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }

  button {
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s;
  }

  button:hover {
    background-color: #45a049;
  }
</style>
