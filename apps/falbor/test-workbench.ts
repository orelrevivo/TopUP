import { applyPatch } from './app/utils/fileUtils';

const originalContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Task Manager</title>
  <style>
    /* Reset and base styles */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body>
  <h1>Task Manager</h1>
  <button class="add-button" style="background-color: green;">Add Task</button>
</body>
</html>
`;

const patchContent = `
<<<<
  <h1>Task Manager</h1>
  <button class="add-button" style="background-color: green;">Add Task</button>
====
  <h1>The way you going to mange build develop and do all of your task at one place</h1>
  <button class="add-button" style="background-color: blue;">Add Task</button>
>>>>
`;

console.log(applyPatch(originalContent, patchContent) !== originalContent ? "SUCCESS" : "FAIL");
