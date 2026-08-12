import { applyPatch } from './app/utils/fileUtils';

const originalContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Task Manager</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <div class="card">
      <h1 class="header">Task Manager</h1>
      <div class="input-group">
        <input type="text" placeholder="Add a new task" class="task-input">
        <input type="date" class="date-input">
        <button class="add-button">Add Task</button>
      </div>
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>
`;

const patchContent = `
<<<<
<h1 class="header">Task Manager</h1>
====
<h1 class="header">The way you going to mange build develop and do all of your task at one place</h1>
>>>>
`;

console.log(applyPatch(originalContent, patchContent) !== originalContent ? "SUCCESS" : "FAIL");
