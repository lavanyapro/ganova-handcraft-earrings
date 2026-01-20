// ====== CONFIG (change these) ======

// Demo login (client-side only)
const VALID_USERNAME = "admin";
const VALID_PASSWORD = "ganova123";

// Earrings list: £5–£30
const EARRINGS = [
  { id: "studs_basic", name: "Basic Studs", price: 5 },
  { id: "hoops_small", name: "Small Hoops", price: 10 },
  { id: "dangles_classic", name: "Classic Dangles", price: 15 },
  { id: "beaded_handmade", name: "Handmade Beaded", price: 20 },
  { id: "statement_gold", name: "Gold Statement", price: 25 },
  { id: "premium_custom", name: "Premium Custom", price: 30 }
];

// Gallery images (put files into assets/images/)
const GALLERY = [
  { file: "earring1.jpg", alt: "Earring photo 1" },
  { file: "earring2.jpg", alt: "Earring photo 2" },
  { file: "earring3.jpg", alt: "Earring photo 3" }
];

// ====== HELPERS ======
function formatGBP(v) { return "£" + Number(v).toFixed(0); }
function setLoggedIn(value) { localStorage.setItem("ganova_logged_in", value ? "1" : "0"); }
function isLoggedIn() { return localStorage.getItem("ganova_logged_in") === "1"; }

function protectPages() {
  const path = (location.pathname || "").toLowerCase();
  const isLoginPage = path.endsWith("/") || path.endsWith("index.html");
  if (!isLoginPage && !isLoggedIn()) {
    location.href = "index.html";
  }
}

function setupLogout() {
  const btns = document.querySelectorAll("#logoutBtn");
  btns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      setLoggedIn(false);
      location.href = "index.html";
    });
  });
}

// ====== LOGIN PAGE ======
function setupLogin() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  // If already logged in, go to about page
  if (isLoggedIn()) location.href = "about.html";

  const alertBox = document.getElementById("loginAlert");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const u = document.getElementById("username").value.trim();
    const p = document.getElementById("password").value.trim();

    if (u === VALID_USERNAME && p === VALID_PASSWORD) {
      setLoggedIn(true);
      location.href = "about.html";
    } else {
      alertBox.textContent = "Invalid username or password.";
      alertBox.classList.remove("hidden");
    }
  });
}

// ====== SHOP PAGE ======
function setupShop() {
  const select = document.getElementById("earringSelect");
  if (!select) return;

  const priceText = document.getElementById("priceText");
  const addBtn = document.getElementById("addToCartBtn");
  const clearBtn = document.getElementById("clearCartBtn");
  const cartList = document.getElementById("cartList");
  const totalText = document.getElementById("totalText");

  // Populate dropdown
  select.innerHTML = EARRINGS.map(e =>
    `<option value="${e.id}">${e.name}</option>`
  ).join("");

  const cart = [];

  function getSelected() {
    return EARRINGS.find(e => e.id === select.value);
  }

  function updatePrice() {
    const item = getSelected();
    if (!item) return;
    priceText.textContent = formatGBP(item.price);
  }

  function renderCart() {
    cartList.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
      total += item.price;
      const li = document.createElement("li");
      li.textContent = `${item.name} — ${formatGBP(item.price)}`;
      cartList.appendChild(li);
    });

    totalText.textContent = formatGBP(total);
  }

  select.addEventListener("change", updatePrice);

  addBtn.addEventListener("click", () => {
    const item = getSelected();
    if (!item) return;
    cart.push(item);
    renderCart();
  });

  clearBtn.addEventListener("click", () => {
    cart.length = 0;
    renderCart();
  });

  updatePrice();
  renderCart();
}

// ====== GALLERY + CONTACT PAGE ======
function setupGallery() {
  const grid = document.getElementById("galleryGrid");
  if (!grid) return;

  grid.innerHTML = GALLERY.map(img => `
    <figure class="photo">
      <img src="assets/images/${img.file}" alt="${img.alt}">
      <figcaption class="muted">${img.alt}</figcaption>
    </figure>
  `).join("");
}

function setupContact() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const success = document.getElementById("contactSuccess");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("cName").value.trim();
    const email = document.getElementById("cEmail").value.trim();
    const msg = document.getElementById("cMessage").value.trim();

    // Opens the user's email app (no backend needed)
    const to = "your-email@example.com"; // <-- CHANGE THIS
    const subject = encodeURIComponent("Ganova Handcraft earrings - Contact");
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}`
    );

    success.classList.remove("hidden");
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  });
}

// ====== INIT ======
protectPages();
setupLogout();
setupLogin();
setupShop();
setupGallery();
setupContact();
