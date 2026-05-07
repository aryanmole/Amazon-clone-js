import { initCart, updateCartQuantity } from '../data/cart.js';
import { formatCurrency } from './utils/money.js';

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

function renderOrders(orders) {
  const grid = document.querySelector('.js-orders-grid');
  if (!orders.length) {
    grid.innerHTML = '<p>No orders yet. Place your first order from checkout.</p>';
    return;
  }

  grid.innerHTML = orders
    .map(
      (order) => `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${formatDate(order.createdAt)}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatCurrency(order.totalCents)}</div>
            </div>
          </div>
          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>
        <div class="order-details-grid">
          ${order.items
            .map(
              (item) => `
              <div class="product-image-container">
                <img src="${item.image}">
              </div>
              <div class="product-details">
                <div class="product-name">${item.name}</div>
                <div class="product-delivery-date">
                  Arriving on: ${formatDate(item.expectedDeliveryDate)}
                </div>
                <div class="product-quantity">Quantity: ${item.quantity}</div>
              </div>
              <div class="product-actions">
                <a href="tracking.html?orderId=${order.id}&itemId=${item.id}">
                  <button class="track-package-button button-secondary">
                    Track package
                  </button>
                </a>
              </div>
            `
            )
            .join('')}
        </div>
      </div>
    `
    )
    .join('');
}

async function initOrdersPage() {
  await initCart();
  updateCartQuantity();

  const response = await fetch('http://localhost:4000/api/orders', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('amazon_auth_token')}`
    }
  });
  const data = await response.json();
  if (!response.ok) {
    document.querySelector('.js-orders-grid').innerHTML = `<p>${data.message || 'Failed to load orders'}</p>`;
    return;
  }

  renderOrders(data.orders);
}

initOrdersPage();
