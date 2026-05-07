import { cart, updateCartQuantity, updateCheckoutQuantity } from '../../data/cart.js'
import { products } from '../../data/products.js';
import { getDeliveryOption } from '../../data/deliveryOptions.js';
import {formatCurrency} from '../utils/money.js'
import { getToken } from '../auth.js';

export function renderPaymentSummary(){
    let productPriceCents=0;
    let shippingPricecents=0
    cart.forEach((cartItem) => {
       const productId= cartItem.productId

       const matchingproduct=products.find((product)=>product.id===productId)

       productPriceCents+=cartItem.quantity*matchingproduct.priceCents

       const deliveryOptions=getDeliveryOption(cartItem.deliveryOptionId)

       shippingPricecents+=deliveryOptions.priceCents
    });
    const totalBeforeTaxCents=productPriceCents+shippingPricecents
    const taxCents=totalBeforeTaxCents*0.1
    const totalCents=totalBeforeTaxCents+taxCents
     let cartQuantity=0
            cart.forEach((cartItem)=>{
                cartQuantity+=cartItem.quantity
            })
    const paymentSummaryHTML=
    `
    <div class="payment-summary">
          <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (${cartQuantity})</div>
            <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(shippingPricecents)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
          </div>

          <button class="place-order-button button-primary js-place-order-button">
            Place your order
          </button>
        </div>
    `;

    document.querySelector('.js-payment-summary').innerHTML=paymentSummaryHTML

    document.querySelector('.js-place-order-button')?.addEventListener('click', async () => {
      const response = await fetch('http://localhost:4000/api/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        }
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || 'Unable to place order');
        return;
      }

      updateCartQuantity();
      updateCheckoutQuantity();
      window.location.href = 'orders.html';
    });
}