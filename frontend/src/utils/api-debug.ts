// Debug script to check API configuration
console.log('==== API Configuration Checker ====');
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('Default API URL:', 'http://localhost:3000/api');
console.log('Backend service locations:');
console.log('- Auth API: /auth/login, /auth/register, /auth/forgot-password');
console.log('- Events API: /events');
console.log('Checking network...');

// Function to check API endpoint
async function checkEndpoint(url) {
  try {
    const response = await fetch(url, {
      method: 'OPTIONS',
      headers: {
        'Accept': 'application/json',
      }
    });
    console.log(`Endpoint ${url}: ${response.status} ${response.statusText}`);
  } catch (error) {
    console.error(`Endpoint ${url} error: ${error.message}`);
  }
}

// Check a few endpoints
Promise.all([
  checkEndpoint('http://localhost:3000/api/auth/login'),
  checkEndpoint('http://localhost:3000/api/auth/forgot-password'),
]);
