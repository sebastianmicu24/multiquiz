<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let questions = [];
  let filteredQuestions = [];
  let currentQuestionIndex = 0;
  let score = 0;
  let selectedOption = null;
  let quizCompleted = false;
  let questionAnswered = false;
  let scoreDisplayOption = 'fraction';
  let displayedScore = '';
  let isSettingsOpen = false;
  let isFilterOpen = false;
  let maxAnswers = 0;
  let uniqueChapters = [];
  let selectedChapter = 'All';

  onMount(async () => {
    const response = await fetch('/Anatomia_patologica.json');
    const data = await response.json();
    questions = data.Quiz.map(q => ({
      domanda: q.Domanda,
      opzioni: Object.entries(q).filter(([key]) => key.match(/^[A-E]$/)).map(([key, value]) => ({ [key]: value })),
      opzione_corretta: q.Risposta,
      tipo_domanda: q["Tipo Domanda"],
      argomento: q.Argomento,
      spiegazione: q.Spiegazione
    }));
    filteredQuestions = [...questions];
    uniqueChapters = ['All', ...new Set(questions.map(q => q.argomento))];
  });

  function selectOption(option) {
    if (!questionAnswered) {
      selectedOption = option;
    }
  }

  function submitAnswer() {
    if (selectedOption === null || questionAnswered) return;

    questionAnswered = true;
    maxAnswers++;
    const currentQuestion = filteredQuestions[currentQuestionIndex];
    
    if (currentQuestion.tipo_domanda === "Risposta singola" || currentQuestion.tipo_domanda === "Vero o Falso") {
      if (selectedOption === currentQuestion.opzione_corretta) {
        score += 1;
      } else {
        score -= 0;
      }
    } else if (currentQuestion.tipo_domanda === "Risposta multipla") {
      const correctOptions = currentQuestion.opzione_corretta.split(',');
      const selectedOptions = selectedOption.split(',');
      const correctCount = selectedOptions.filter(option => correctOptions.includes(option)).length;
      const incorrectCount = selectedOptions.length - correctCount;
      score += (correctCount / correctOptions.length) - (incorrectCount * 0.25);
    }

    // Round the score to 2 decimal places
    score = Math.round(score * 100) / 100;
  }

  function nextQuestion() {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
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
    maxAnswers = 0;
  }

  function setScoreDisplayOption(option) {
    scoreDisplayOption = option;
    isSettingsOpen = false;
  }

  function toggleSettings() {
    isSettingsOpen = !isSettingsOpen;
    isFilterOpen = false;
  }

  function toggleFilter() {
    isFilterOpen = !isFilterOpen;
    isSettingsOpen = false;
  }

  function filterQuestions(chapter) {
    selectedChapter = chapter;
    if (chapter === 'All') {
      filteredQuestions = [...questions];
    } else {
      filteredQuestions = questions.filter(q => q.argomento === chapter);
    }
    restartQuiz();
    isFilterOpen = false;
  }

  $: progress = (currentQuestionIndex / filteredQuestions.length) * 100;
  $: scoreProgress = maxAnswers > 0 ? (score / maxAnswers) * 100 : 0;
  $: {
    if (maxAnswers > 0) {
      switch (scoreDisplayOption) {
        case 'fraction':
          displayedScore = `${score}/${maxAnswers}`;
          break;
        case 'percentage':
          displayedScore = `${Math.round((score / maxAnswers) * 100)}%`;
          break;
        case 'outOf30':
          displayedScore = `${Math.round((score / maxAnswers) * 30)}/30`;
          break;
      }
    } else {
      switch (scoreDisplayOption) {
        case 'fraction':
          displayedScore = `0/0`;
          break;
        case 'percentage':
          displayedScore = `0%`;
          break;
        case 'outOf30':
          displayedScore = `0/30`;
          break;
      }
    }
  }
</script>

<main>
  <h1>Anatomia Patologica Quiz</h1>
  <div class="top-right-menu">
    <button on:click={toggleFilter} class="icon-button">🔍</button>
    <button on:click={toggleSettings} class="icon-button">⚙️</button>
    {#if isFilterOpen}
      <div class="dropdown-menu filter-menu">
        <h3 class="dropdown-header">Filter by Argomento</h3>
        {#each uniqueChapters as chapter}
          <button on:click={() => filterQuestions(chapter)} class:active={selectedChapter === chapter}>{chapter}</button>
        {/each}
      </div>
    {/if}
    {#if isSettingsOpen}
      <div class="dropdown-menu">
        <h3 class="dropdown-header">Display Punteggio</h3>
        <button on:click={() => setScoreDisplayOption('fraction')}>Frazione</button>
        <button on:click={() => setScoreDisplayOption('percentage')}>Percentuale</button>
        <button on:click={() => setScoreDisplayOption('outOf30')}>Trentesimi</button>
      </div>
    {/if}
  </div>
  {#if filteredQuestions.length === 0}
    <p>Loading quiz...</p>
  {:else if quizCompleted}
    <div class="quiz-completed">
      <h2>Quiz Completed!</h2>
      <p>Your final score: {displayedScore}</p>
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
            <text x="18" y="20.35" class="percentage">{currentQuestionIndex + 1}/{filteredQuestions.length}</text>
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
            <text x="18" y="20.35" class="percentage">{displayedScore}</text>
          </svg>
          <p>Score</p>
        </div>
      </div>
      <h2>Question {currentQuestionIndex + 1}</h2>
      <p>{filteredQuestions[currentQuestionIndex].domanda}</p>
      <div class="options">
        {#each filteredQuestions[currentQuestionIndex].opzioni as option}
          <button
            class:selected={selectedOption === Object.keys(option)[0]}
            class:correct={questionAnswered && Object.keys(option)[0] === filteredQuestions[currentQuestionIndex].opzione_corretta}
            class:incorrect={questionAnswered && Object.keys(option)[0] !== filteredQuestions[currentQuestionIndex].opzione_corretta}
            on:click={() => selectOption(Object.keys(option)[0])}
            disabled={questionAnswered}
          >
            {Object.keys(option)[0]}: {Object.values(option)[0]}
          </button>
        {/each}
      </div>
      {#if !questionAnswered}
        <button class="submit-btn" on:click={submitAnswer} disabled={selectedOption === null}>Submit Answer</button>
      {:else}
      <p class="explanation"><b>Risposta Corretta:</b> {filteredQuestions[currentQuestionIndex].opzione_corretta}</p>
      <p class="explanation"><b>Spiegazione:</b> {filteredQuestions[currentQuestionIndex].spiegazione}</p> 
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
    padding: 1rem;
    position: relative;
  }

  h1 {
    color: #333;
    font-size: 2rem;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  h2 {
    color: #444;
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }

  .question-container {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .options {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  button {
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 12px 24px;
    text-align: left;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s;
    width: 100%;
    word-wrap: break-word;
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
    max-width: 200px;
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
    font-size: 14px;
  }

  .charts-container {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .progress-container, .score-container {
    width: 80px;
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

  .top-right-menu {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    gap: 10px;
  }

  .icon-button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    padding: 5px;
    color: #333;
    transition: color 0.3s ease;
  }

  .icon-button:hover {
    color: #3498db;
  }

  .dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
    z-index: 1000;
    min-width: 200px;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .dropdown-header {
    background-color: #f0f0f0;
    color: #333;
    font-size: 16px;
    font-weight: bold;
    padding: 12px 16px;
    margin: 0;
    border-bottom: 1px solid #e0e0e0;
  }

  .dropdown-menu button {
    display: block;
    width: 100%;
    padding: 12px 16px;
    text-align: left;
    background: none;
    border: none;
    color: #333;
    cursor: pointer;
    transition: background-color 0.2s ease;
    font-size: 14px;
  }

  .dropdown-menu button:hover {
    background-color: #f0f0f0;
  }

  .dropdown-menu button:active {
    background-color: #e0e0e0;
  }

  .dropdown-menu button.active {
    background-color: #e0e0e0;
    font-weight: bold;
  }

  .filter-menu {
    max-height: 300px;
    overflow-y: auto;
  }

  /* Mobile-specific styles */
  @media (max-width: 600px) {
    main {
      padding: 0.5rem;
    }

    h1 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }

    h2 {
      font-size: 1.1rem;
    }

    .question-container {
      padding: 0.75rem;
    }

    button {
      padding: 10px 16px;
      font-size: 13px;
    }

    .charts-container {
      flex-direction: column;
      align-items: center;
    }

    .progress-container, .score-container {
      width: 60px;
    }

    .explanation {
      font-size: 13px;
    }

    .dropdown-menu {
      min-width: 180px;
    }

    .dropdown-header {
      font-size: 14px;
      padding: 10px 14px;
    }

    .dropdown-menu button {
      padding: 10px 14px;
      font-size: 13px;
    }

    .filter-menu {
      max-height: 250px;
    }
  }
</style>