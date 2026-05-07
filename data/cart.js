import { getToken } from '../scripts/auth.js';

export let cart = [];

function authHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
}

export async function initCart() {
  const response = await fetch('http://localhost:4000/api/cart', {
    headers: authHeaders()
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to load cart');
  }
  cart = data.items;
  return cart;
}

export async function addToCart(productId, quantityDelta = 1) {
  const response = await fetch('http://localhost:4000/api/cart/items', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ productId, quantityDelta: Number(quantityDelta) || 1 })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to add item');
  }
  cart = data.items;
}

export async function removeFromCart(productId) {
  const response = await fetch(`http://localhost:4000/api/cart/items/${productId}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to remove item');
  }
  cart = data.items;
}

export function updateCartQuantity() {
  const cartQuantity = cart.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
  const cartElement = document.querySelector('.cart-quantity');
  if (cartElement) {
    cartElement.innerHTML = cartQuantity;
  }
}

export function updateCheckoutQuantity() {
  const cartQuantity = cart.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
  const checkoutElement = document.querySelector('.js-checkout-item');
  if (checkoutElement) {
    checkoutElement.innerHTML = cartQuantity;
  }
}

export async function updateQuantity(productId, newQuantity) {
  const response = await fetch(`http://localhost:4000/api/cart/items/${productId}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ quantity: newQuantity })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update quantity');
  }
  cart = data.items;
}

export async function updateDeliveryQuantity(productId, deliveryOptionId) {
  const response = await fetch(`http://localhost:4000/api/cart/items/${productId}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ deliveryOptionId })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update delivery option');
  }
  cart = data.items;
}

