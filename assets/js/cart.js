function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function formatEuro(value) {
  return value.toFixed(2).replace(".", ",") + " €";
}

function updateCartCount() {
  const cartCount = document.getElementById("cartCount");
  const cartDrawerCount = document.getElementById("cartDrawerCount");
  const cart = getCart();

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  if (cartCount) {
    cartCount.textContent = totalItems;
  }

  if (cartDrawerCount) {
    cartDrawerCount.textContent = `${totalItems} Stück`;
  }
}

function updateCartDrawer() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const cartNetTotal = document.getElementById("cartNetTotal");

  if (!cartItems) return;

  const cart = getCart();

  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="text-sm text-gray-500">Your cart is empty.</p>`;

    if (cartTotal) cartTotal.textContent = "0,00 €";
    if (cartNetTotal) cartNetTotal.textContent = "( Netto : 0,00 € )";

    return;
  }

  cartItems.innerHTML = cart
    .map((item) => {
      const itemTotal = item.price * item.quantity;
      const netTotal = itemTotal / 1.19;

      return `
        <div class="flex gap-3 border-b pb-4 mb-4">
          <img
            src="${item.image}"
            alt="${item.name}"
            class="w-16 h-16 object-contain border"
          />

          <div class="flex-1">
            <h3 class="text-sm font-semibold text-gray-700 leading-tight mb-3">
              ${item.name}
            </h3>

            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center border">
                <button
                  type="button"
                  class="cart-minus w-8 h-8 flex items-center justify-center text-lg"
                  data-id="${item.id}"
                >
                  −
                </button>

                <span class="w-8 h-8 flex items-center justify-center border-x text-sm">
                  ${item.quantity}
                </span> 

                <button
                  type="button"
                  class="cart-plus w-8 h-8 flex items-center justify-center text-lg"
                  data-id="${item.id}"
                >
                  +
                </button>
              </div>

              <div class="text-right">
                <p class="font-bold text-sm">${formatEuro(itemTotal)}</p>
                <p class="text-xs text-gray-500">( Netto : ${formatEuro(netTotal)} )</p>
              </div>

              <button
                type="button"
                class="cart-remove text-gray-700"
                data-id="${item.id}"
              >
                <i data-lucide="trash-2" class="w-5 h-5"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const netTotal = total / 1.19;

  if (cartTotal) {
    cartTotal.textContent = formatEuro(total);
  }

  if (cartNetTotal) {
    cartNetTotal.textContent = `( Netto : ${formatEuro(netTotal)} )`;
  }

  if (window.lucide) {
    lucide.createIcons();
  }

  bindCartDrawerButtons();
}

function addToCart(product, quantity = 1) {
  const cart = getCart();

  const existingProduct = cart.find((item) => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity
    });
  }

  saveCart(cart);
  updateCartCount();
  updateCartDrawer();
}

function increaseQuantity(id) {
  const cart = getCart();
  const item = cart.find((product) => product.id === id);

  if (item) {
    item.quantity += 1;
  }

  saveCart(cart);
  updateCartCount();
  updateCartDrawer();
}

function decreaseQuantity(id) {
  let cart = getCart();
  const item = cart.find((product) => product.id === id);

  if (item) {
    item.quantity -= 1;

    if (item.quantity <= 0) {
      cart = cart.filter((product) => product.id !== id);
    }
  }

  saveCart(cart);
  updateCartCount();
  updateCartDrawer();
}

function removeFromCart(id) {
  const cart = getCart().filter((product) => product.id !== id);

  saveCart(cart);
  updateCartCount();
  updateCartDrawer();
}

function openCartDrawer() {
  const cartDrawer = document.getElementById("cartDrawer");
  const cartOverlay = document.getElementById("cartOverlay");

  if (cartDrawer) {
    cartDrawer.classList.remove("translate-x-full");
  }

  if (cartOverlay) {
    cartOverlay.classList.remove("hidden");
  }

  updateCartDrawer();
}

function closeCartDrawer() {
  const cartDrawer = document.getElementById("cartDrawer");
  const cartOverlay = document.getElementById("cartOverlay");

  if (cartDrawer) {
    cartDrawer.classList.add("translate-x-full");
  }

  if (cartOverlay) {
    cartOverlay.classList.add("hidden");
  }
}

function bindCartDrawerButtons() {
  document.querySelectorAll(".cart-plus").forEach((button) => {
    button.onclick = function () {
      increaseQuantity(this.dataset.id);
    };
  });

  document.querySelectorAll(".cart-minus").forEach((button) => {
    button.onclick = function () {
      decreaseQuantity(this.dataset.id);
    };
  });

  document.querySelectorAll(".cart-remove").forEach((button) => {
    button.onclick = function () {
      removeFromCart(this.dataset.id);
    };
  });
}

function initCart() {
  updateCartCount();
  updateCartDrawer();

  const addToCartButtons = document.querySelectorAll(".add-to-cart");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      let quantity = 1;

      const quantityInputId = this.dataset.quantityInput;

      if (quantityInputId) {
        const quantityInput = document.getElementById(quantityInputId);

        if (quantityInput) {
          quantity = Number(quantityInput.value) || 1;
        }
      }

      const product = {
        id: this.dataset.id,
        name: this.dataset.name,
        price: Number(this.dataset.price),
        image: this.dataset.image
      };

      addToCart(product, quantity);
      openCartDrawer();
    });
  });

  const cartButton = document.getElementById("cartButton");
  const cartClose = document.getElementById("cartClose");
  const cartOverlay = document.getElementById("cartOverlay");

  if (cartButton) {
    cartButton.addEventListener("click", openCartDrawer);
  }

  if (cartClose) {
    cartClose.addEventListener("click", closeCartDrawer);
  }

  if (cartOverlay) {
    cartOverlay.addEventListener("click", closeCartDrawer);
  }
}

initCart();