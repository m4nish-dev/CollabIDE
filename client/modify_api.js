const fs = require('fs');
let code = fs.readFileSync('src/lib/api.js', 'utf8');

// Add logout method
if (!code.includes('logout: async')) {
  code = code.replace(
    /login: async \(\{ email, password \}\) => \{/,
    `logout: async () => {
      if (BASE_URL) return request("POST", "/auth/logout");
      console.warn("Using mock data for POST /auth/logout");
      await delay(400);
      return { success: true };
    },
    login: async ({ email, password }) => {`
  );
}

// Add console.warn for all delay calls
// Match: `if (BASE_URL) return request("METHOD", "/path", ...); \n await delay(ms);`
// Actually, let's just replace `await delay(ms);` with a warn and delay.
// But we want to know the endpoint name. 
// A simpler way: change `delay` function to log
code = code.replace(
  /const delay = \(ms\) => new Promise\(\(resolve\) => setTimeout\(\resolve, ms\)\);/,
  `const delay = (ms) => {
  console.warn("Using mock data for API request");
  return new Promise((resolve) => setTimeout(resolve, ms));
};`
);

fs.writeFileSync('src/lib/api.js', code);
console.log('Modified api.js');
