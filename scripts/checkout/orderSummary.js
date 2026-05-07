import { cart, removeFromCart, updateCheckoutQuantity, updateQuantity, updateCartQuantity, updateDeliveryQuantity } from '../../data/cart.js';
import { products } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import {hello} from 'https://unpkg.com/supersimpledev@1.0.1/hello.esm.js'
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js'
import {deliveryOptions,getDeliveryOption} from '../../data/deliveryOptions.js'
import { renderPaymentSummary } from './paymentSummary.js';
import { calculateDeliveryDate } from '../../data/deliveryOptions.js';

export function renderOrderSummary(){
let cartSummaryHTML = '';


cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  const matchproduct = products.find((product) => product.id === productId);

let deliveryOptionId = cartItem.deliveryOptionId ?? deliveryOptions[0]?.id;

let deliveryOption =getDeliveryOption(deliveryOptionId)

if (!deliveryOption) deliveryOption = deliveryOptions[0] ?? { deliveryDays: 0, priceCents: 0 };

const dateString=calculateDeliveryDate(deliveryOption)

  cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container-${matchproduct.id}">
      <div class="delivery-date">
        Delivery date: ${dateString}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image" src="${matchproduct.image}">

        <div class="cart-item-details">
          <div class="product-name">${matchproduct.name}</div>
          <div class="product-price">${matchproduct.getPrice()}</div>

          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label js-quantity-label-${matchproduct.id}">${cartItem.quantity}</span>
            </span>

            <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchproduct.id}">
              Update
            </span>

            <input type="number" min="1" class="quantity-input js-quantity-input-${matchproduct.id}" value="${cartItem.quantity}" />

            <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchproduct.id}">
              Save
            </span>

            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchproduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">Choose a delivery option:</div>
          ${deliveryOptionsHTML(matchproduct,cartItem)}
        </div>
      </div>
    </div>
  `;
});



function deliveryOptionsHTML(matchproduct,cartItem){

  let html=''
   
    deliveryOptions.forEach((deliveryOption)=>{
      
    const dateString=calculateDeliveryDate(deliveryOption)

      const priceString=deliveryOption.priceCents===0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} -`;
      
      const isChecked=deliveryOption.id===cartItem.deliveryOptionId
   
      html+= ` <div class="delivery-option js-delivery-option"
              data-product-id="${matchproduct.id}" 
              data-delivery-option-id="${deliveryOption.id}">
            <input type="radio" ${isChecked ? 'checked' : ''} class="delivery-option-input" name="delivery-option-${matchproduct.id}">
            <div>
              <div class="delivery-option-date">${dateString}</div>
              <div class="delivery-option-price">${priceString}- Shipping</div>
            </div>
          </div>`
    });
    return html;
}

document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

updateCheckoutQuantity();

document.querySelectorAll('.js-update-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    container.classList.add('is-editing-quantity');
  });
});

document.querySelectorAll('.js-save-link').forEach((link) => {
  link.addEventListener('click', async () => {
    const productId = link.dataset.productId;
    const container = document.querySelector(`.js-cart-item-container-${productId}`);

    const quantityInput = container.querySelector(`.js-quantity-input-${productId}`);
    const quantityLabel = container.querySelector(`.js-quantity-label-${productId}`);

    const newQuantity = Number(quantityInput.value);
    if(newQuantity<0 || newQuantity>1000){
        alert('not valid number')
        return
    }else{
         await updateQuantity(productId, newQuantity);

    quantityLabel.innerHTML = newQuantity;

    container.classList.remove('is-editing-quantity');
    renderPaymentSummary()
    updateCheckoutQuantity();
    updateCartQuantity();
    
    }
   
  });
});

document.querySelectorAll('.js-delete-link').forEach((link) => {
  link.addEventListener('click', async () => {
    const productId = link.dataset.productId;
    await removeFromCart(productId);

    renderOrderSummary()

    renderPaymentSummary()
    updateCheckoutQuantity();
    updateCartQuantity();
    
  });
});


document.querySelectorAll('.js-delivery-option').forEach((ele)=>{
    ele.addEventListener('click', async ()=>{
        const { productId, deliveryOptionId } = ele.dataset;
        
        await updateDeliveryQuantity(productId, deliveryOptionId); 
        renderPaymentSummary()
        renderOrderSummary() 
    });
});
}
