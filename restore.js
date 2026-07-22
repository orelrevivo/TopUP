const { execSync } = require('child_process');
try {
  execSync('git checkout -- "app/components/sidebar/Menu.client.tsx"', { stdio: 'inherit' });
  console.log("Restored!");
} catch (e) {
  console.error("Error:", e.message);
}
