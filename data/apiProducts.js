import { formatCurrency } from '../scripts/utils/money.js';

class Product {
  constructor(productDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
  }

  getDtarsUrl() {
    return `images/ratings/rating-${this.rating.stars * 10}.png`;
  }

  getPrice() {
    return `$${formatCurrency(this.priceCents)}`;
  }

  extraInfoHTML() {
    return '';
  }
}

class Clothing extends Product {
  constructor(productDetails) {
    super(productDetails);
    this.sizeChartLink = productDetails.sizeChartLink;
  }

  extraInfoHTML() {
    return `
    <a href="${this.sizeChartLink}" target="_blank">
      Size Chart
    </a>
    `;
  }
}

export async function loadProductsFromApi(token) {
  const response = await fetch('http://localhost:4000/api/products', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to load products');
  }

  const data = await response.json();
  return data.products.map((productDetails) =>
    productDetails.type === 'clothing'
      ? new Clothing(productDetails)
      : new Product(productDetails)
  );
}
