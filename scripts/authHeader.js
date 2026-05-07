import { clearSession, getUser } from './auth.js';

const headerRightSection = document.querySelector('.amazon-header-right-section');

if (headerRightSection) {
  const user = getUser();

  if (user) {
    headerRightSection.insertAdjacentHTML(
      'afterbegin',
      `
      <div class="header-link auth-user-pill" title="${user.email}">
        <span class="returns-text">Hello</span>
        <span class="orders-text">${user.name}</span>
      </div>
      <a class="header-link auth-link" href="#" id="logout-link">
        <span class="returns-text">Sign</span>
        <span class="orders-text">Out</span>
      </a>
      `
    );

    const logoutLink = document.getElementById('logout-link');
    logoutLink?.addEventListener('click', (event) => {
      event.preventDefault();
      clearSession();
      window.location.href = 'login.html';
    });
  } else {
    headerRightSection.insertAdjacentHTML(
      'afterbegin',
      `
      <a class="header-link auth-link" href="login.html">
        <span class="returns-text">Sign</span>
        <span class="orders-text">In</span>
      </a>
      `
    );
  }
}
