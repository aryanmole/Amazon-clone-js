import { initCart, updateCartQuantity } from '../data/cart.js';

function getParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    orderId: params.get('orderId'),
    itemId: params.get('itemId')
  };
}

function applyStatus(stage) {
  const preparing = document.querySelector('.js-status-preparing');
  const shipped = document.querySelector('.js-status-shipped');
  const delivered = document.querySelector('.js-status-delivered');

  [preparing, shipped, delivered].forEach((el) => el.classList.remove('current-status'));

  if (stage === 'delivered') {
    delivered.classList.add('current-status');
  } else if (stage === 'shipped') {
    shipped.classList.add('current-status');
  } else {
    preparing.classList.add('current-status');
  }
}

async function refreshTracking(orderId, itemId) {
  const response = await fetch(`http://localhost:4000/api/orders/${orderId}/items/${itemId}/tracking`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('amazon_auth_token')}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    document.querySelector('.js-order-tracking').innerHTML = `<p>${data.message || 'Tracking unavailable'}</p>`;
    return;
  }

  document.querySelector('.js-delivery-date').textContent = `Arriving on ${new Date(data.expectedDeliveryDate).toLocaleString()}`;
  document.querySelector('.js-product-name').textContent = data.item.name;
  document.querySelector('.js-product-quantity').textContent = `Quantity: ${data.item.quantity}`;
  document.querySelector('.js-product-image').src = data.item.image;

  const progressBar = document.querySelector('.js-progress-bar');
  progressBar.style.transition = 'width 1s linear';
  progressBar.style.width = `${data.progressPercent}%`;

  applyStatus(data.stage);
}

async function initTrackingPage() {
  const { orderId, itemId } = getParams();
  if (!orderId || !itemId) {
    document.querySelector('.js-order-tracking').innerHTML = '<p>Missing tracking details.</p>';
    return;
  }

  await initCart();
  updateCartQuantity();

  await refreshTracking(orderId, itemId);
  setInterval(() => refreshTracking(orderId, itemId), 1000);
}

initTrackingPage();
