// --- Storage helpers ---
const CART_KEY = "cart";
function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// --- State ---
let cart = loadCart();

// --- Totals & header UI ---
function getTotals() {
  return cart.reduce(
    (acc, item) => {
      acc.count += item.quantity;
      acc.total += item.price * item.quantity;
      return acc;
    },
    { count: 0, total: 0 }
  );
}

function updateHeader() {
  const { count, total } = getTotals();
  const countEl = document.getElementById("cart-count");
  const totalEl = document.getElementById("cart-total");
  if (countEl) countEl.textContent = count;
  if (totalEl) totalEl.textContent = total.toFixed(2);
}

// --- Add to cart ---
function addToCart(name, price) {
  price = Number(price); // ensure numeric
  if (!Number.isFinite(price)) return;

  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  saveCart();
  updateHeader();
  // If we're on cart page, refresh it
  if (document.getElementById("cart-items")) {
    updateCartPage();
  }
  // Optional toast
  // alert(`${name} added to cart!`);
}

// --- Cart page rendering ---
function updateCartPage() {
  const container = document.getElementById("cart-items");
  if (!container) return;

  container.innerHTML = "";
  cart.forEach((item, idx) => {
    const itemTotal = item.price * item.quantity;

    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div style="flex:1;">
        <strong>${item.name}</strong><br/>
        $${item.price.toFixed(2)} ×
        <button class="qty-btn" onclick="decQty(${idx})">−</button>
        <span>${item.quantity}</span>
        <button class="qty-btn" onclick="incQty(${idx})">+</button>
      </div>
      <div style="min-width:140px; text-align:right;">
        = $${itemTotal.toFixed(2)}<br/>
        <button class="remove-btn" onclick="deleteLine(${idx})">Remove</button>
      </div>
    `;
    container.appendChild(row);
  });

  // Update totals on cart page + header
  const totals = getTotals();
  const totalEl = document.getElementById("total");
  if (totalEl) totalEl.textContent = `Total: $${totals.total.toFixed(2)}`;
  updateHeader();
}

// --- Quantity controls ---
function incQty(index) {
  if (!cart[index]) return;
  cart[index].quantity += 1;
  saveCart();
  updateCartPage();
}

function decQty(index) {
  if (!cart[index]) return;
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    cart.splice(index, 1);
  }
  saveCart();
  updateCartPage();
}

function deleteLine(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartPage();
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartPage();
}

// --- Init on load ---
document.addEventListener("DOMContentLoaded", () => {
  updateHeader();
  updateCartPage(); // safe to call; no-op on home page
});

