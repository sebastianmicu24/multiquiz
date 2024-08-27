<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let questions = [];
  let currentQuestionIndex = 0;
  let score = 0;
  let selectedOption = null;
  let quizCompleted = false;
  let questionAnswered = false;

  onMount(async () => {
    const response = await fetch('/Psichiatria.json');
    const data = await response.json();
    questions = data.notes.map(note => ({
      domanda: note.fields[0],
      opzioni: note.fields.slice(1, 6).map((option, index) => ({ [String.fromCharCode(97 + index)]: option })),
      opzione_corretta: note.fields[6].split(' ').findIndex(val => val === '1'),
      spiegazione: note.fields[8] || "No explanation provided."
    }));
  });

  function selectOption(option) {
    if (!questionAnswered) {
      selectedOption = option;
    }
  }

  function submitAnswer() {
    if (selectedOption === null || questionAnswered) return;

    questionAnswered = true;
    const currentQuestion = questions[currentQuestionIndex];
    
    if (selectedOption === currentQuestion.opzione_corretta) {
      score += 1;
    } else {
      score -= 0.25;
    }

    // Round the score to 2 decimal places
    score = Math.round(score * 100) / 100;
  }

  function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      selectedOption = null;
      questionAnswered = false;
    } else {
      quizCompleted = true;
    }
  }

  function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    selectedOption = null;
    quizCompleted = false;
    questionAnswered = false;
  }

  $: progress = (currentQuestionIndex / questions.length) * 100;
  $: scoreProgress = (score / questions.length) * 100;
</script>

<main>
  <h1>Psichiatria Quiz</h1>
  {#if questions.length === 0}
    <p>Loading quiz...</p>
  {:else if quizCompleted}
    <div class="quiz-completed">
      <h2>Quiz Completed!</h2>
      <p>Your final score: {score} out of {questions.length}</p>
      <button on:click={restartQuiz}>Restart Quiz</button>
      <button on:click={() => goto('/')}>Back to Home</button>
    </div>
  {:else}
    <div class="question-container">
      <div class="charts-container">
        <div class="progress-container">
          <svg viewBox="0 0 36 36" class="circular-chart">
            <path class="circle-bg"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path class="circle"
              stroke-dasharray="{progress}, 100"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <text x="18" y="20.35" class="percentage">{currentQuestionIndex + 1}/{questions.length}</text>
          </svg>
          <p>Progress</p>
        </div>
        <div class="score-container">
          <svg viewBox="0 0 36 36" class="circular-chart">
            <path class="circle-bg"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path class="circle score-circle"
              stroke-dasharray="{scoreProgress}, 100"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <text x="18" y="20.35" class="percentage">{score}/{questions.length}</text>
          </svg>
          <p>Score</p>
        </div>
      </div>
      <h2>Question {currentQuestionIndex + 1}</h2>
      <p>{questions[currentQuestionIndex].domanda}</p>
      <div class="options">
        {#each questions[currentQuestionIndex].opzioni as option, index}
          <button
            class:selected={selectedOption === index}
            class:correct={questionAnswered && index === questions[currentQuestionIndex].opzione_corretta}
            class:incorrect={questionAnswered && index !== questions[currentQuestionIndex].opzione_corretta}
            on:click={() => selectOption(index)}
            disabled={questionAnswered}
          >
            {Object.keys(option)[0]}: {Object.values(option)[0]}
          </button>
        {/each}
      </div>
      {#if !questionAnswered}
        <button class="submit-btn" on:click={submitAnswer} disabled={selectedOption === null}>Submit Answer</button>
      {:else}
        <p class="explanation">{questions[currentQuestionIndex].spiegazione}</p>
        <button class="next-btn" on:click={nextQuestion}>Next Question</button>
      {/if}
    </div>
  {/if}
</main>

<style>
  main {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  h1 {
    color: #333;
    font-size: 2.5rem;
    margin-bottom: 2rem;
    text-align: center;
  }

  h2 {
    color: #444;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .question-container {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 2rem;
    margin-bottom: 2rem;
  }

  .options {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  button {
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: left;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s;
  }

  button:hover:not(:disabled) {
    background-color: #45a049;
  }

  button.selected {
    border: 2px solid black;
  }

  button.correct {
    background-color: #2ecc71 !important;
    color: black;
    font-weight: bold;
  }

  button.incorrect {
    background-color: #808080 !important;
    color: #d3d3d3;
  }

  button:disabled {
    cursor: not-allowed;
  }

  .submit-btn, .next-btn {
    display: block;
    margin: 0 auto;
    background-color: #3498db;
  }

  .submit-btn:hover, .next-btn:hover {
    background-color: #2980b9;
  }

  .quiz-completed {
    text-align: center;
  }

  .quiz-completed button {
    margin: 1rem;
  }

  .explanation {
    margin-top: 1rem;
    font-style: italic;
    color: #666;
  }

  .charts-container {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .progress-container, .score-container {
    width: 100px;
    text-align: center;
  }

  .circular-chart {
    display: block;
    margin: 10px auto;
    max-width: 80%;
    max-height: 250px;
  }

  .circle-bg {
    fill: none;
    stroke: #eee;
    stroke-width: 3.8;
  }

  .circle {
    fill: none;
    stroke-width: 2.8;
    stroke-linecap: round;
    animation: progress 1s ease-out forwards;
    stroke: #4CAF50;
  }

  .score-circle {
    stroke: #3498db;
  }

  .percentage {
    fill: #666;
    font-family: sans-serif;
    font-size: 0.5em;
    text-anchor: middle;
  }

  @keyframes progress {
    0% {
      stroke-dasharray: 0 100;
    }
  }
</style>