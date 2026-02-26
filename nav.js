/* ============================================
   AI Teacher v2.0 — Shared Navigation & Helpers
   ============================================ */

const BACKEND = "https://ai-teacher-backend-ngbs.onrender.com"; // ← Render URL yahan daalo

// ===== AUTH =====
function getToken()    { return localStorage.getItem("at_token"); }
function getUserName() { return localStorage.getItem("at_name") || ""; }
function isLoggedIn()  { return !!getToken(); }

function logout() {
  localStorage.removeItem("at_token");
  localStorage.removeItem("at_name");
  localStorage.removeItem("at_avatar");
  window.location.href = "login.html";
}

function requireAuth() {
  if (!isLoggedIn()) { window.location.href = "login.html"; return false; }
  return true;
}

// ===== API CALL =====
async function api(endpoint, method = "GET", body = null) {
  const opts = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(getToken() ? { "Authorization": `Bearer ${getToken()}` } : {})
    }
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BACKEND}${endpoint}`, opts);
  return res.json();
}

// ===== ALERT =====
function showAlert(id, msg, type = "success", duration = 4000) {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = `alert alert-${type}`;
  el.innerHTML = (type==="success"?"✅ ":type==="error"?"❌ ":"ℹ️ ") + msg;
  el.style.display = "flex";
  if (duration > 0) setTimeout(() => el.style.display = "none", duration);
}

// ===== NAV HTML =====
function buildNav() {
  const page  = window.location.pathname.split("/").pop() || "index.html";
  const loggedIn = isLoggedIn();
  const name  = getUserName();

  const links = [
    { href:"index.html",       icon:"🏠", label:"Home" },
    { href:"courses.html",     icon:"📚", label:"Courses" },
    { href:"quiz.html",        icon:"🧠", label:"Quiz" },
    { href:"leaderboard.html", icon:"🏆", label:"Leaderboard" },
    { href:"about.html",       icon:"ℹ️",  label:"About" },
    { href:"contact.html",     icon:"📞", label:"Contact" },
  ];

  const linksHTML = links.map(l =>
    `<li><a href="${l.href}" class="${l.href===page?'active':''}">${l.icon} ${l.label}</a></li>`
  ).join("");

  const authHTML = loggedIn
    ? `<li><span class="nav-user">👤 ${name}</span></li>
       <li><a href="#" onclick="logout()" style="color:var(--muted);font-size:13px">Logout</a></li>`
    : `<li><a href="login.html" class="nav-login">🔐 Login</a></li>`;

  return `
    <nav>
      <a href="index.html" class="nav-logo">🧑‍🏫 AI Teacher <span>by Raju Ram</span></a>
      <button class="nav-toggle" onclick="toggleNav()">☰</button>
      <ul id="navLinks">
        ${linksHTML}
        ${authHTML}
      </ul>
    </nav>`;
}

function buildFooter() {
  return `
    <footer class="page-footer">
      <p>© 2025 AI Teacher — राजू राम | गरीब बच्चों को मुफ्त शिक्षा 🇮🇳</p>
    </footer>
    <div class="ad-banner">
      <span class="ad-label">Ad</span>
      <!-- Google AdSense yahan add karo -->
      <span style="font-size:13px;color:var(--muted)">📢 यहाँ advertisement आएगी — इससे website चलती है!</span>
      <span class="ad-label">Ad</span>
    </div>`;
}

function toggleNav() {
  document.getElementById("navLinks")?.classList.toggle("active");
}

// ===== INIT ON LOAD =====
document.addEventListener("DOMContentLoaded", () => {
  const navEl = document.getElementById("nav-placeholder");
  if (navEl) navEl.innerHTML = buildNav();

  const footerEl = document.getElementById("footer-placeholder");
  if (footerEl) footerEl.innerHTML = buildFooter();

  // Ping backend on load (cold start fix)
  setTimeout(() => {
    fetch(`${BACKEND}/ping`).catch(() => {});
  }, 300);
});
