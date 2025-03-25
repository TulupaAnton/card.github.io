let cartItems = JSON.parse(localStorage.getItem('cartItems')) || []
let totalAmount = parseFloat(localStorage.getItem('totalAmount')) || 0

const cartItemCount = document.querySelector('.cart-count')
const cartItemList = document.querySelector('.cart-items')
const cartTotal = document.querySelector('.cart-total')

export function saveCartToLocalStorage () {
  localStorage.setItem('cartItems', JSON.stringify(cartItems))
  localStorage.setItem('totalAmount', totalAmount.toFixed(2))
}

export function updateCartUI () {
  updateCartItemCount(cartItems.reduce((acc, item) => acc + item.quantity, 0))
  updateCartItems()
  updateCartTotal()
  saveCartToLocalStorage()
}

function updateCartItemCount (count) {
  cartItemCount.textContent = count
}

function updateCartItems () {
  cartItemList.innerHTML = ''
  cartItems.forEach((item, index) => {
    const cartItem = document.createElement('div')
    cartItem.classList.add('cart-item', 'individual-cart-item')
    cartItem.innerHTML = `
      <span class="cart-item-name">${item.name}</span>
      <img src="${item.image}" alt="${
      item.name
    }" style="width: 200px; height: 200px; object-fit: cover;" class="cart-item-img" />
      <div class='cart-controls'>
        <button class="decrease-btn" data-index="${index}">-</button>
        <span>${item.quantity}</span>
        <button class="increase-btn" data-index="${index}">+</button>
      </div>
      <span class='cart-item-price'>$${(item.price * item.quantity).toFixed(
        2
      )}</span>
      <button class="remove-btn" data-index="${index}">
        <i class="fa-solid fa-times"></i>
      </button>`

    cartItemList.append(cartItem)
  })

  document.querySelectorAll('.remove-btn').forEach(button => {
    button.addEventListener('click', event => {
      const index = event.target.closest('.remove-btn').dataset.index
      removeItemsFromCart(index)
    })
  })

  document.querySelectorAll('.increase-btn').forEach(button => {
    button.addEventListener('click', event => {
      const index = event.target.dataset.index
      cartItems[index].quantity++
      totalAmount += cartItems[index].price
      updateCartUI()
    })
  })

  document.querySelectorAll('.decrease-btn').forEach(button => {
    button.addEventListener('click', event => {
      const index = event.target.dataset.index
      if (cartItems[index].quantity > 1) {
        cartItems[index].quantity--
        totalAmount -= cartItems[index].price
      } else {
        removeItemsFromCart(index)
      }
      updateCartUI()
    })
  })
}

function removeItemsFromCart (index) {
  const removedItem = cartItems.splice(index, 1)[0]
  totalAmount -= removedItem.price * removedItem.quantity
  updateCartUI()
}

function updateCartTotal () {
  cartTotal.textContent = `$${totalAmount.toFixed(2)}`
}

export function addToCart (product) {
  const existingItem = cartItems.find(
    cartItem => cartItem.name === product.name
  )
  if (existingItem) {
    existingItem.quantity++
  } else {
    cartItems.push(product)
  }

  totalAmount += product.price
  updateCartUI()
}

export function setupCartHandlers () {
  document.querySelector('.cart-container').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open')
  })

  document.querySelector('.sidebar-close').addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open')
  })
}

updateCartUI()
