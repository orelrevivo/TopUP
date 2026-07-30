fetch('http://localhost:5173/api/mcp/connections', {
  headers: {
    'Cookie': '' 
  }
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);
