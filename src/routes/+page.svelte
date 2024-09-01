<script>
  import { goto } from '$app/navigation';
</script>

<main>
  <h1>Quiz Sapienza C</h1>
  <p>Quiz di materie vecchie</p>
  <div class="button-container">
    <button on:click={() => goto('/quiz/psichiatria')}>Psichiatria</button>
    <button on:click={() => goto('/quiz/sanita_pubblica')}>Sanità Pubblica</button>
    <button on:click={() => goto('/quiz/igiene')}>Igiene</button>
  </div><br>
  <h2>Anatomia Patologica</h2>
    <div class="button-container"><button on:click={() => goto('/quiz/anatomia_patologica')}>Quiz</button>
    <button on:click={() => goto('/quiz/anatomia_patologica/Teoria_Anapat')}>Teoria</button>
    <!-- <button on:click={() => goto('/quiz/AppuntiEditor')}>Editor</button> -->
  </div>
</main>

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
  }

  h1 {
    color: var(--text-primary);
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  p {
    color: var(--text-secondary);
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
    background-color: var(--accent-color);
    color: var(--bg-primary);
    border: none;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s, transform 0.2s;
  }

  button:hover {
    background-color: #9a67ea;
    transform: translateY(-2px);
  }
</style>
