import { renderHeader } from "./checkout/checkoutHeader.js";
import { renderOrderSummary } from "./checkout/orderSummary.js"
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import '../data/cart-class.js'
import { requireAuthOrRedirect } from './auth.js';
import { initCart } from '../data/cart.js';

requireAuthOrRedirect();
(async function bootCheckout() {
  await initCart();
  renderHeader();
  renderOrderSummary();
  renderPaymentSummary();
}());

