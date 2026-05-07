import { addToCart, updateCartQuantity, initCart } from '../data/cart.js';
import { loadProductsFromApi } from '../data/apiProducts.js';
import { requireAuthOrRedirect } from './auth.js';

const token = requireAuthOrRedirect();
let productsHTML = '';

async function renderProducts() {
  try {
    await initCart();
    const products = await loadProductsFromApi(token);

    products.forEach((product) => {
      productsHTML +=
    `<div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="${product.getDtarsUrl()}">
            <div class="product-rating link-primary">
              ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            ${product.getPrice()}
          </div>

          <div class="product-quantity-container">
            <select>
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          ${product.extraInfoHTML()}

          <div class="product-spacer"></div>

          <div class="added-to-cart">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button 
          button-primary js-add-to-cart"
          data-product-id="${product.id}">
            Add to Cart
          </button>
        </div>`;
    });

    updateCartQuantity();

    document.querySelector('.js-products-grid').innerHTML = productsHTML;

    document.querySelectorAll('.js-add-to-cart').forEach((button) => {
      button.addEventListener('click', async () => {
        const productId = button.dataset.productId;

        const productContainer = button.closest('.product-container');
        const addedToCart = productContainer.querySelector('.added-to-cart');

        addedToCart.style.opacity = 1;
        setTimeout(() => {
          addedToCart.style.opacity = 0;
        }, 2000);

        await addToCart(productId);
        updateCartQuantity();
      });
    });
  } catch (error) {
    document.querySelector('.js-products-grid').innerHTML = `
      <div style="padding: 16px;">
        ${error.message}. Please <a href="login.html">login again</a>.
      </div>
    `;
  }
}

renderProducts();