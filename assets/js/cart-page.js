function getCartPageCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCartPageCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function formatEuro(value) {
  return value.toFixed(2).replace(".", ",") + " €";
}

function updateNavbarCartCountFromPage() {
  const cartCount = document.getElementById("cartCount");
  const cart = getCartPageCart();

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  if (cartCount) {
    cartCount.textContent = totalItems;
  }
}

function renderCartPage() {
  const cartPageItems = document.getElementById("cartPageItems");

  const summarySubtotalNet = document.getElementById("summarySubtotalNet");
  const summaryTotalNet = document.getElementById("summaryTotalNet");
  const summaryTax = document.getElementById("summaryTax");
  const summaryTotalGross = document.getElementById("summaryTotalGross");

  if (!cartPageItems) return;

  const cart = getCartPageCart();

  if (cart.length === 0) {
    cartPageItems.innerHTML = `
      <div class="p-10 text-center text-gray-500">
        Your cart is empty.
      </div>
    `;

    if (summarySubtotalNet) summarySubtotalNet.textContent = "0,00 €";
    if (summaryTotalNet) summaryTotalNet.textContent = "0,00 €";
    if (summaryTax) summaryTax.textContent = "0,00 €";
    if (summaryTotalGross) summaryTotalGross.textContent = "0,00 €";

    updateNavbarCartCountFromPage();
    return;
  }

  cartPageItems.innerHTML = cart
    .map((item) => {
      const grossTotal = item.price * item.quantity;
      const netTotal = grossTotal / 1.19;
      const singleNet = item.price / 1.19;

      return `
        <div class="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_80px] items-center border-b p-4 gap-4">

          <!-- Product -->
          <div class="flex items-center gap-5">
            <img
              src="${item.image}"
              alt="${item.name}"
              class="w-[150px] h-[110px] object-contain"
            />

            <div>
              <span class="inline-block bg-[#e8f5ff] text-[#1f5570] font-bold text-sm px-2 py-1 rounded mb-2">
                CLSA${String(item.id).padStart(5, "0")}
              </span>

              <h3 class="font-semibold leading-snug max-w-[260px]">
                ${item.name}
              </h3>

              <a href="product.html?id=${item.id}" class="text-sm text-[#007c89] underline mt-2 inline-block">
                Details
              </a>
            </div>
          </div>

          <!-- Single Price -->
          <div class="text-center">
            <p class="font-bold">${formatEuro(item.price)}</p>
            <p class="text-xs text-gray-500">( Netto : ${formatEuro(singleNet)} )</p>
          </div>

          <!-- Quantity -->
          <div class="flex justify-center">
            <div class="flex border">
              <button
                type="button"
                class="cart-page-minus w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100"
                data-id="${item.id}"
              >
                −
              </button>

              <span class="w-9 h-8 border-x flex items-center justify-center text-sm">
                ${item.quantity}
              </span>

              <button
                type="button"
                class="cart-page-plus w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100"
                data-id="${item.id}"
              >
                +
              </button>
            </div>
          </div>

          <!-- Total Price -->
          <div class="text-center">
            <p class="font-bold text-[#007cbd]">${formatEuro(grossTotal)}</p>
            <p class="text-xs text-gray-500">( Netto : ${formatEuro(netTotal)} )</p>
          </div>

          <!-- Remove -->
          <div class="text-center">
            <button
              type="button"
              class="cart-page-remove text-[#0c4058] hover:text-red-500"
              data-id="${item.id}"
            >
              <i data-lucide="trash-2" class="w-6 h-6"></i>
            </button>
          </div>

        </div>
      `;
    })
    .join("");

  const grossTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const netTotal = grossTotal / 1.19;
  const tax = grossTotal - netTotal;

  if (summarySubtotalNet) summarySubtotalNet.textContent = formatEuro(netTotal);
  if (summaryTotalNet) summaryTotalNet.textContent = formatEuro(netTotal);
  if (summaryTax) summaryTax.textContent = formatEuro(tax);
  if (summaryTotalGross) summaryTotalGross.textContent = formatEuro(grossTotal);

  if (window.lucide) {
    lucide.createIcons();
  }

  bindCartPageButtons();
  updateNavbarCartCountFromPage();
}

function increaseCartPageQuantity(id) {
  const cart = getCartPageCart();
  const item = cart.find((product) => product.id === id);

  if (item) {
    item.quantity += 1;
  }

  saveCartPageCart(cart);
  renderCartPage();
}

function decreaseCartPageQuantity(id) {
  let cart = getCartPageCart();
  const item = cart.find((product) => product.id === id);

  if (item) {
    item.quantity -= 1;

    if (item.quantity <= 0) {
      cart = cart.filter((product) => product.id !== id);
    }
  }

  saveCartPageCart(cart);
  renderCartPage();
}

function removeCartPageItem(id) {
  const cart = getCartPageCart().filter((product) => product.id !== id);

  saveCartPageCart(cart);
  renderCartPage();
}

function bindCartPageButtons() {
  document.querySelectorAll(".cart-page-plus").forEach((button) => {
    button.onclick = function () {
      increaseCartPageQuantity(this.dataset.id);
    };
  });

  document.querySelectorAll(".cart-page-minus").forEach((button) => {
    button.onclick = function () {
      decreaseCartPageQuantity(this.dataset.id);
    };
  });

  document.querySelectorAll(".cart-page-remove").forEach((button) => {
    button.onclick = function () {
      removeCartPageItem(this.dataset.id);
    };
  });
}

renderCartPage();