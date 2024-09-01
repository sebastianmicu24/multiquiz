<script>
import { onMount } from 'svelte';

let appunti = [];
let selectedCategory = '';
let selectedSubcategory = '';
let selectedArray = '';
let errorMessage = '';
let filePath = '';
let errorStack = '';
let editorContent = '';
let deletionIndex = -1;
let editingIndex = -1;
let deletionInstructions = '';

async function loadAppunti() {
  try {
    const response = await fetch('/api/getAppunti');
    if (!response.ok) {
      const errorData = await response.json();
      filePath = errorData.path;
      errorStack = errorData.stack;
      throw new Error(errorData.error || 'Failed to fetch appunti');
    }
    appunti = await response.json();
    errorMessage = '';
    filePath = '';
    errorStack = '';
  } catch (error) {
    console.error('Error fetching appunti:', error);
    errorMessage = `Failed to load appunti: ${error.message}. Please check the server logs for more information.`;
  }
}

onMount(loadAppunti);

$: categories = appunti.map(item => Object.keys(item)[0]);
$: subcategories = selectedCategory ? Object.keys(appunti.find(item => Object.keys(item)[0] === selectedCategory)[selectedCategory]) : [];
$: arrays = selectedSubcategory ? Object.entries(appunti.find(item => Object.keys(item)[0] === selectedCategory)[selectedCategory][selectedSubcategory]).map(([name, elements]) => ({ name, count: elements.length })) : [];
$: selectedArrayElements = selectedArray ? appunti.find(item => Object.keys(item)[0] === selectedCategory)[selectedCategory][selectedSubcategory][selectedArray] : [];

function selectArray(arrayName) {
  selectedArray = arrayName;
}

async function addElement() {
  if (editorContent.trim()) {
    const wrappedContent = `<div>${editorContent}</div>`;
    appunti = appunti.map(item => {
      if (Object.keys(item)[0] === selectedCategory) {
        item[selectedCategory][selectedSubcategory][selectedArray] = [...item[selectedCategory][selectedSubcategory][selectedArray], wrappedContent];
      }
      return item;
    });
    editorContent = '';
    await saveChanges();
  }
}

function confirmDeletion(index) {
  deletionIndex = index;
  deletionInstructions = 'Press Enter to delete, or any other key to cancel';
}

function handleKeyDown(event) {
  if (deletionIndex !== -1) {
    if (event.key === 'Enter') {
      deleteElement();
    } else {
      cancelDeletion();
    }
  } else if (event.ctrlKey && event.key === 'Enter') {
    if (editingIndex !== -1) {
      saveEdit();
    } else {
      addElement();
    }
  }
}

async function deleteElement() {
  appunti = appunti.map(item => {
    if (Object.keys(item)[0] === selectedCategory) {
      item[selectedCategory][selectedSubcategory][selectedArray] = item[selectedCategory][selectedSubcategory][selectedArray].filter((_, i) => i !== deletionIndex);
    }
    return item;
  });
  await saveChanges();
  cancelDeletion();
}

function cancelDeletion() {
  deletionIndex = -1;
  deletionInstructions = '';
}

function startEditing(index) {
  editingIndex = index;
  editorContent = selectedArrayElements[index];
}

async function saveEdit() {
  if (editorContent.trim()) {
    appunti = appunti.map(item => {
      if (Object.keys(item)[0] === selectedCategory) {
        item[selectedCategory][selectedSubcategory][selectedArray][editingIndex] = editorContent;
      }
      return item;
    });
    await saveChanges();
    editorContent = '';
    editingIndex = -1;
  }
}

function cancelEdit() {
  editingIndex = -1;
  editorContent = '';
}

async function saveChanges() {
  try {
    const response = await fetch('/api/saveAppunti', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appunti),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Unknown error occurred');
    }
    const result = await response.json();
    if (result.success) {
      console.log('Changes saved successfully!');
    } else {
      throw new Error('Failed to save changes');
    }
  } catch (error) {
    console.error('Error saving changes:', error);
    errorMessage = `Error saving changes: ${error.message}`;
  }
}

function formatText(command) {
  document.execCommand(command, false, null);
}

function downloadAppunti() {
  const jsonString = JSON.stringify(appunti, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'appunti.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
</script>

<svelte:window on:keydown={handleKeyDown}/>

<main>
  <h1>Appunti Editor</h1>
  
  <button on:click={downloadAppunti} class="download-button">Download appunti.json</button>
  
  {#if errorMessage}
    <p style="color: red;">{errorMessage}</p>
    {#if filePath}
      <p>File path: {filePath}</p>
    {/if}
    {#if errorStack}
      <details>
        <summary>Error Stack</summary>
        <pre>{errorStack}</pre>
      </details>
    {/if}
    <button on:click={loadAppunti}>Retry Loading Appunti</button>
  {/if}

  {#if appunti.length > 0}
    <div>
      <label for="category">Sistema:</label>
      <select id="category" bind:value={selectedCategory}>
        <option value="">Seleziona un Sistema</option>
        {#each categories as category}
          <option value={category}>{category}</option>
        {/each}
      </select>
    </div>

    {#if selectedCategory}
      <div>
        <label for="subcategory">Patologia:</label>
        <select id="subcategory" bind:value={selectedSubcategory}>
          <option value="">Seleziona una Patologia</option>
          {#each subcategories as subcategory}
            <option value={subcategory}>{subcategory}</option>
          {/each}
        </select>
      </div>
    {/if}

    {#if selectedSubcategory}
      <div>
        <table>
          <thead>
            <tr>
              <th>{selectedSubcategory}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {#each arrays as array, index}
              <tr class={selectedArray === array.name ? 'selected' : ''} on:click={() => selectArray(array.name)}>
                <td class={index === 0 ? 'first-row' : ''}>{array.name}</td>
                <td class={index === 0 ? 'first-row' : ''}>
                  <span class="element-count" class:zero={array.count === 0}>
                    {array.count}
                  </span>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}

    {#if selectedArray}
      <div>
        {#if deletionInstructions}
          <p class="deletion-instructions">{deletionInstructions}</p>
        {/if}
        <ul>
          {#each selectedArrayElements as element, index}
            <li class={deletionIndex === index ? 'confirm-delete' : ''}>
              <button class="action-button delete-button" on:click={() => confirmDeletion(index)} title="Click to delete">🗑️</button>
              <button class="action-button edit-button" on:click={() => startEditing(index)} title="Click to edit">✏️</button>
              {#if editingIndex === index}
                <div class="editor-container">
                  <div class="editor-toolbar">
                    <button on:click={() => formatText('bold')}><strong>B</strong></button>
                    <button on:click={() => formatText('italic')}><em>I</em></button>
                    <button on:click={() => formatText('hiliteColor')}>H</button>
                  </div>
                  <div 
                    class="rich-text-editor" 
                    contenteditable="true"
                    bind:innerHTML={editorContent}
                  ></div>
                  <button class="addElement" on:click={saveEdit}>Save</button>
                  <button class="addElement" on:click={cancelEdit}>Cancel</button>
                </div>
              {:else}
                <div class="li-text">
                  {@html element}
                </div>
              {/if}
            </li>
          {/each}
        </ul>
        <div class="editor-container">
          
          <div class="editor-toolbar">
            <button on:click={() => formatText('bold')}><strong>B</strong></button>
            <button on:click={() => formatText('italic')}><em>I</em></button>
            <button class="hiliteColor" on:click={() => formatText('hiliteColor')}>S</button>
          </div>
          <div 
            class="rich-text-editor" 
            contenteditable="true"
            bind:innerHTML={editorContent}
          ></div>
          <button class="addElement" on:click={addElement}>Add Element</button>
          <p class="help-text">Press Ctrl+Enter to add and save changes</p>
        </div>
      </div>
    {/if}
  {/if}
</main>

<style>
  main {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
  }

  div {
    margin-bottom: 20px;
  }

  label {
    display: block;
    margin-bottom: 5px;
  }

  select {
    width: 100%;
    padding: 5px;
  }

  button {
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
  }

  .download-button {
    background-color: #008CBA;
    margin-bottom: 20px;
  }

  details {
    margin-top: 10px;
    padding: 10px;
    background-color: #f0f0f0;
    border: 1px solid #ddd;
  }

  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .editor-toolbar {
    margin-bottom: 5px;
  }

  .editor-toolbar button {
    padding: 5px 10px;
    margin-right: 5px;
  }

  .rich-text-editor {
    border: 1px solid #ccc;
    min-height: 100px;
    padding: 10px;
    margin-bottom: 10px;
    width: 90%;
  }

  .action-button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    font-size: 18px;
    padding: 0 5px;
    margin-right: 10px;
  }

  .delete-button {
    color: red;
  }

  .edit-button {
    color: blue;
  }

  .help-text {
    font-size: 12px;
    color: #666;
    margin-top: 5px;
  }

  .hiliteColor{
    text-decoration: underline;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding: 5px;
    transition: background-color 0.3s ease;
    min-height: 30px;
  }

  .li-text {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100% !important;
    margin-top: 0px;
    margin-bottom: 0px;
  }

  .confirm-delete {
    background-color: #ffeeee;
    color: black;
  }

  .deletion-instructions {
    font-size: 14px;
    color: #666;
    font-style: italic;
    margin-bottom: 10px;
  }

  .editor-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
  }

  .addElement{
    max-width: 300px;
  }

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 10px;
    overflow: hidden;
  }

  th, td {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #4CAF50;
    color: white;
    font-weight: bolder;
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover {
    background-color: #f5f5f5;
    cursor: pointer;
    color: black;
  }

  tr.selected {
    background-color: #e0e0e0;
    color: black;
    font-weight: bold;
  }

  .element-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #4CAF50;
    color: white;
    font-weight: bold;
    float: right;
  }

  .element-count.zero {
    background-color: #8B0000;
  }

  .first-row td:first-child {
    border-top-left-radius: 10px;
  }

  .first-row td:last-child {
    border-top-right-radius: 10px;
  }

  tbody tr:last-child td:first-child {
    border-bottom-left-radius: 10px;
  }

  tbody tr:last-child td:last-child {
    border-bottom-right-radius: 10px;
  }
</style>