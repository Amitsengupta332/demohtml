function getCheckoutCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function formatCheckoutEuro(value) {
  return value.toFixed(2).replace(".", ",") + " €";
}

function renderCheckoutPage() {
  const checkoutItems = document.getElementById("checkoutItems");

  const checkoutSubtotalNet = document.getElementById("checkoutSubtotalNet");
  const checkoutTotalNet = document.getElementById("checkoutTotalNet");
  const checkoutTax = document.getElementById("checkoutTax");
  const checkoutTotalGross = document.getElementById("checkoutTotalGross");

  if (!checkoutItems) return;

  const cart = getCheckoutCart();

  if (cart.length === 0) {
    checkoutItems.innerHTML = `
      <div class="p-8 text-center text-gray-500">
        Your cart is empty.
      </div>
    `;

    if (checkoutSubtotalNet) checkoutSubtotalNet.textContent = "0,00 €";
    if (checkoutTotalNet) checkoutTotalNet.textContent = "0,00 €";
    if (checkoutTax) checkoutTax.textContent = "0,00 €";
    if (checkoutTotalGross) checkoutTotalGross.textContent = "0,00 €";

    return;
  }

  checkoutItems.innerHTML = cart
    .map((item, index) => {
      const grossSingle = item.price;
      const grossTotal = item.price * item.quantity;
      const netSingle = grossSingle / 1.19;
      const netTotal = grossTotal / 1.19;

      return `
        <div class="grid grid-cols-[1.7fr_1fr_1fr_1fr] items-center border-b px-4 py-4 text-sm">
          <div>
            <p class="font-medium mb-3">
              ${index + 1}. ${item.name}
            </p>

            <div class="flex items-center gap-4">
              <img
                src="${item.image}"
                alt="${item.name}"
                class="w-16 h-12 object-contain"
              />

              <a href="product.html?id=${item.id}" class="text-[#078b94] underline text-xs">
                Details
              </a>
            </div>
          </div>

          <div class="text-center">
            <p class="font-bold">${formatCheckoutEuro(grossSingle)}</p>
            <p class="text-xs text-gray-500">( Netto: ${formatCheckoutEuro(netSingle)} )</p>
          </div>

          <div class="text-center">
            ${item.quantity}
          </div>

          <div class="text-center">
            <p class="font-bold">${formatCheckoutEuro(grossTotal)}</p>
            <p class="text-xs text-gray-500">( Netto: ${formatCheckoutEuro(netTotal)} )</p>
          </div>
        </div>
      `;
    })
    .join("");

  const grossTotal = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const netTotal = grossTotal / 1.19;
  const tax = grossTotal - netTotal;

  if (checkoutSubtotalNet) checkoutSubtotalNet.textContent = formatCheckoutEuro(netTotal);
  if (checkoutTotalNet) checkoutTotalNet.textContent = formatCheckoutEuro(netTotal);
  if (checkoutTax) checkoutTax.textContent = formatCheckoutEuro(tax);
  if (checkoutTotalGross) checkoutTotalGross.textContent = formatCheckoutEuro(grossTotal);
}

renderCheckoutPage();