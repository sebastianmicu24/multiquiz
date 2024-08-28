<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let questions = [];
  let filteredQuestions = [];
  let currentQuestionIndex = 0;
  let score = 0;
  let selectedOptions = [];
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
      const currentQuestion = filteredQuestions[currentQuestionIndex];
      if (currentQuestion.tipo_domanda === "Risposta multipla") {
        const index = selectedOptions.indexOf(option);
        if (index === -1) {
          selectedOptions = [...selectedOptions, option];
        } else {
          selectedOptions = selectedOptions.filter((_, i) => i !== index);
        }
      } else {
        selectedOptions = [option];
      }
    }
  }

  function submitAnswer() {
    if (selectedOptions.length === 0 || questionAnswered) return;

    questionAnswered = true;
    maxAnswers++;
    const currentQuestion = filteredQuestions[currentQuestionIndex];
    
    if (currentQuestion.tipo_domanda === "Risposta singola" || currentQuestion.tipo_domanda === "Vero o Falso") {
      if (selectedOptions[0] === currentQuestion.opzione_corretta) {
        score += 1;
      }
    } else if (currentQuestion.tipo_domanda === "Risposta multipla") {
      const correctOptions = currentQuestion.opzione_corretta.split(',').sort().join(',');
      const selectedOptionsStr = selectedOptions.sort().join('');
      console.log(selectedOptionsStr)
      console.log(correctOptions)
      if (correctOptions === selectedOptionsStr) {
        score += 1;
      }
    }

    // Round the score to 2 decimal places
    score = Math.round(score * 100) / 100;
  }

  function nextQuestion() {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      currentQuestionIndex++;
      selectedOptions = [];
      questionAnswered = false;
    } else {
      quizCompleted = true;
    }
  }

  function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    selectedOptions = [];
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
      <h2>Domanda {currentQuestionIndex + 1}</h2>
      <p class="explanation"><b>{filteredQuestions[currentQuestionIndex].tipo_domanda}</b></p> 
      <p>{filteredQuestions[currentQuestionIndex].domanda}</p>
      <div class="options">
        {#each filteredQuestions[currentQuestionIndex].opzioni as option}
          <button
            class:selected={selectedOptions.includes(Object.keys(option)[0])}
            class:correct={questionAnswered && filteredQuestions[currentQuestionIndex].opzione_corretta.split(',').includes(Object.keys(option)[0])}
            class:incorrect={questionAnswered && !filteredQuestions[currentQuestionIndex].opzione_corretta.split(',').includes(Object.keys(option)[0]) && selectedOptions.includes(Object.keys(option)[0])}
            on:click={() => selectOption(Object.keys(option)[0])}
            disabled={questionAnswered}
          >
            {Object.keys(option)[0]}: {Object.values(option)[0]}
          </button>
        {/each}
      </div>
      {#if !questionAnswered}
        <button class="submit-btn" on:click={submitAnswer} disabled={selectedOptions.length === 0}>Submit Answer</button>
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
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
    position: relative;
  }

  h1 {
    color: var(--text-primary);
    font-size: 2rem;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  h2 {
    color: var(--text-primary);
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }

  .question-container {
    background-color: var(--bg-secondary);
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-top: 60px; /* Add margin-top to create space for the top-right menu */
  }

  .options {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  button {
    background-color: var(--accent-color);
    border: none;
    color: var(--bg-primary);
    padding: 12px 24px;
    text-align: left;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s, transform 0.2s;
    width: 100%;
    word-wrap: break-word;
  }

  button:hover:not(:disabled) {
    background-color: #9a67ea;
    transform: translateY(-2px);
  }

  button.selected {
    border: 2px solid var(--text-primary);
  }

  button.correct {
    background-color: var(--success-color) !important;
    color: var(--bg-primary);
    font-weight: bold;
  }

  button.incorrect {
    background-color: var(--error-color) !important;
    color: var(--text-secondary);
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  .submit-btn, .next-btn {
    display: block;
    margin: 0 auto;
    background-color: var(--accent-color);
    max-width: 200px;
  }

  .submit-btn:hover, .next-btn:hover {
    background-color: #9a67ea;
  }

  .quiz-completed {
    text-align: center;
  }

  .quiz-completed button {
    margin: 1rem;
  }

  .explanation {
    margin-top: 1rem;
    color: var(--text-secondary);
    font-size: 18px;
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
    stroke: var(--bg-primary);
    stroke-width: 3.8;
  }

  .circle {
    fill: none;
    stroke-width: 2.8;
    stroke-linecap: round;
    animation: progress 1s ease-out forwards;
    stroke: var(--accent-color);
  }

  .score-circle {
    stroke: var(--success-color);
  }

  .percentage {
    fill: var(--text-secondary);
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
    position: fixed; /* Change to fixed positioning */
    top: 10px;
    right: 10px;
    display: flex;
    gap: 10px;
    z-index: 1001; /* Increase z-index to ensure it's always on top */
  }

  .icon-button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    padding: 5px;
    color: var(--text-primary);
    transition: color 0.3s ease;
  }

  .icon-button:hover {
    color: var(--accent-color);
  }

  .dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: var(--bg-secondary);
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
    z-index: 1000;
    min-width: 200px;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .dropdown-header {
    background-color: var(--bg-primary);
    color: var(--text-primary);
    font-size: 16px;
    font-weight: bold;
    padding: 12px 16px;
    margin: 0;
    border-bottom: 1px solid var(--bg-secondary);
  }

  .dropdown-menu button {
    display: block;
    width: 100%;
    padding: 12px 16px;
    text-align: left;
    background: none;
    border: none;
    color: var(--text-primary);
    cursor: pointer;
    transition: background-color 0.2s ease;
    font-size: 14px;
  }

  .dropdown-menu button:hover {
    background-color: var(--bg-primary);
  }

  .dropdown-menu button:active {
    background-color: var(--accent-color);
    color: var(--bg-primary);
  }

  .dropdown-menu button.active {
    background-color: var(--accent-color);
    color: var(--bg-primary);
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
      margin-top: 60px; /* Add margin-top to create space for the top-right menu */
    }

    h2 {
      font-size: 1.1rem;
    }

    .question-container {
      padding: 0.75rem;
      margin-top: 0; /* Remove margin-top for mobile */
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

    .top-right-menu {
      top: 5px;
      right: 5px;
    }
  }
</style>