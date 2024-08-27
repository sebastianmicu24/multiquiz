<script>
  import { goto } from '$app/navigation';
</script>

<main>
  <h1>User Profile</h1>
  <div class="profile-info">
    <p><strong>Name:</strong> Andrea Cappato</p>
    <p><strong>Email:</strong> Antonella.Polimeni@gmail.zi</p>
    <p><strong>Quizzes Completed:</strong> Tutti</p>
    <p><strong>Average Score:</strong> 104%</p>
  </div>
  <button on:click={() => goto('/')}>Back to Home</button>
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
    margin-bottom: 2rem;
  }

  .profile-info {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 2rem;
    margin-bottom: 2rem;
    text-align: left;
  }

  .profile-info p {
    margin: 0.5rem 0;
    font-size: 1.1rem;
    color: #444;
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