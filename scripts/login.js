import { saveSession } from './auth.js';

const form = document.querySelector('.js-login-form');
const messageElement = document.querySelector('.js-auth-message');

form?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.querySelector('.js-email').value.trim();
  const password = document.querySelector('.js-password').value;

  messageElement.textContent = '';
  messageElement.classList.remove('success');

  try {
    const response = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    saveSession(data.token, data.user);
    window.location.href = 'amazon.html';
  } catch (error) {
    messageElement.textContent = error.message;
  }
});
