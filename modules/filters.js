import { renderProductsCards } from './productCards.js'
import { attachAddToCartListeners } from './productHandlers.js'

const productContainer = document.querySelector('.js-products-list')
const inputSearch = document.getElementById('inputSearch')
const resetFiltersBtn = document.getElementById('resetFilters')

function parsePrice (priceStr) {
  return Number(priceStr.replace(/\D/g, ''))
}

export function filterProducts (filter, priceRange) {
  fetch('../products.json')
    .then(res => res.json())
    .then(products => {
      const searchValue = inputSearch.value.toLowerCase()
      let filteredProducts = products

      if (filter !== 'All') {
        filteredProducts = filteredProducts.filter(
          product => product.series === filter
        )
      }

      if (searchValue) {
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(searchValue)
        )
      }

      if (priceRange) {
        const [min, max] = priceRange.split('-').map(num => Number(num) * 1000)
        filteredProducts = filteredProducts.filter(product => {
          const price = parsePrice(product.prices[0])
          return price >= min && price <= max
        })
      }

      productContainer.innerHTML = ''
      renderProductsCards(filteredProducts, productContainer)
      attachAddToCartListeners(filteredProducts)
    })
    .catch(error => console.error('Ошибка загрузки данных:', error))
}

export function updateURLParams (filter, priceRange) {
  const params = new URLSearchParams(window.location.search)

  if (filter === 'All') {
    params.delete('filter')
  } else {
    params.set('filter', filter)
  }

  if (priceRange) {
    params.set('price', priceRange)
  } else {
    params.delete('price')
  }

  history.pushState(null, '', '?' + params.toString())
}

export function setupFilters () {
  document.querySelectorAll('.filter-btn[data-f]').forEach(button => {
    button.addEventListener('click', event => {
      const filter = event.target.getAttribute('data-f')
      const priceRange = getPriceFromURL()
      filterProducts(filter, priceRange)
      updateURLParams(filter, priceRange)
    })
  })

  document
    .querySelectorAll('.filter-btn[data-price], .filter-price-btn')
    .forEach(button => {
      button.addEventListener('click', event => {
        const priceRange = event.target.getAttribute('data-price')
        const filter = getFilterFromURL()
        filterProducts(filter, priceRange)
        updateURLParams(filter, priceRange)
      })
    })

  inputSearch.addEventListener('input', () => {
    filterProducts(getFilterFromURL(), getPriceFromURL())
  })

  resetFiltersBtn.addEventListener('click', () => {
    inputSearch.value = ''
    updateURLParams('All', null)
    filterProducts('All', null)
  })

  filterProducts(getFilterFromURL(), getPriceFromURL())
}

function getFilterFromURL () {
  const params = new URLSearchParams(window.location.search)
  return params.get('filter') || 'All'
}

function getPriceFromURL () {
  const params = new URLSearchParams(window.location.search)
  return params.get('price') || null
}
