import { renderProductsCards } from './modules/productCards.js'
import { setupCartHandlers } from './modules/cart.js'
import { setupFilters } from './modules/filters.js'
import { attachAddToCartListeners } from './modules/productHandlers.js'

document.addEventListener('DOMContentLoaded', () => {
  setupCartHandlers()
  setupFilters()

  fetch('../products.json')
    .then(res => res.json())
    .then(products => {
      renderProductsCards(products, document.querySelector('.js-products-list'))
      attachAddToCartListeners(products)
    })
    .catch(error => console.error('Ошибка загрузки данных:', error))
})
