import { addToCart } from './cart.js'

export function attachAddToCartListeners (products) {
  document.querySelectorAll('.add-to-cart').forEach((button, index) => {
    button.addEventListener('click', () => {
      const product = products[index]
      addToCart({
        name: product.name,
        price:
          parseFloat(product.prices[0].replace(/\$/g, '').replace(/\s/g, '')) ||
          0,
        image: Array.isArray(product.image) ? product.image[0] : product.image,
        quantity: 1
      })
    })
  })
}
