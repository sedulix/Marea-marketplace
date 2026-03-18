
let currentCat = 'Все';
function applyFilters() {
    const q = document.getElementById('search-input').value.toLowerCase();
    const cards = document.querySelectorAll('.card');
    let count = 0;

    cards.forEach(c => {
        const matchCat  = currentCat === 'Все' || c.dataset.cat === currentCat;
        const matchName = c.dataset.name.includes(q) || c.querySelector('.card-name').textContent.toLowerCase().includes(q);
        const show = matchCat && matchName;

        c.style.display = show ? '' : 'none';
        if (show) count++;
    });

    document.getElementById('results-label').textContent = count + ' товаров';
    document.getElementById('total-count').textContent = count + ' товаров';
}

function filterCat(btn, cat) {
    currentCat = cat;
    document.querySelectorAll('.cat-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilters();
}

function filterBySearch() { applyFilters(); }

function sortProducts(val) {
    const grid = document.getElementById('grid');
    const cards = [...grid.querySelectorAll('.card')];

    cards.sort((a, b) => {
        if (val === 'cheap')     return +a.dataset.price - +b.dataset.price;
        if (val === 'expensive') return +b.dataset.price - +a.dataset.price;
        if (val === 'rating')    return +b.dataset.rating - +a.dataset.rating;
        return 0;
    });

    cards.forEach(c => grid.appendChild(c));
}

function setView(mode, btn) {
    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('grid').classList.toggle('list-view', mode === 'list');
}

function filterRating(btn) {
    document.querySelectorAll('.rating-row').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function toggleFav(e, btn) {
    e.stopPropagation();
    btn.classList.toggle('on');
    btn.textContent = btn.classList.contains('on') ? '❤️' : '🤍';
}

function addToCart(e, btn) {
    e.stopPropagation();

    const card  = btn.closest('.card');
    const name  = card.querySelector('.card-name').textContent;
    const price = +card.dataset.price;
    const emoji = card.querySelector('.card-img').textContent.trim();

let cart = JSON.parse(localStorage.getItem('cart') || '[]');
const existing = cart.find(i => i.name === name);
if (existing) {
    existing.qty += 1;
}
  else {
    cart.push({ name, price, emoji, qty: 1 });
}

localStorage.setItem('cart', JSON.stringify(cart));

updateCartBadge();

const orig = btn.textContent;
btn.textContent = '✓ Добавлено';
btn.style.background = 'var(--accent)';
btn.style.color = '#fff';

setTimeout(() => {
    btn.textContent = orig;
    btn.style.background = '';
    btn.style.color = '';
}, 1500);
}

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const total = cart.reduce((sum, i) => sum + i.qty, 0);
    const badge = document.querySelector('.badge');
    if (badge) badge.textContent = total;
}

updateCartBadge();

function resetFilters() {
    filterCat(document.querySelector('.cat-item'), 'Все');
    document.getElementById('search-input').value = '';
    document.getElementById('price-from').value = 0;
    document.getElementById('price-to').value = 50000;
    document.getElementById('price-range').value = 50000;
    document.querySelectorAll('.rating-row').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.check-list input').forEach(i => i.checked = false);
}

function updateCount() {
    applyFilters();
}

document.querySelectorAll('.page-btn:not(.arrow)').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.page-btn:not(.arrow)').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

const authArea = document.getElementById("auth-area");
async function initAuth() {
    try {
        const res = await fetch('/auth/me');
        if (!res.ok) throw new Error();

        const data = await res.json();
        const letter = data.user.charAt(0).toUpperCase();

        authArea.innerHTML = `
        <div class="profile-wrap">
            <div class="profile-avatar">${letter}</div>
            <div class="profile-menu">
                <div class="profile-name">${data.user}</div>
                <a href="/account_page">Профиль</a>
                <a href="/orders">Мои заказы</a>
                <a href="#" onclick="logout()">Выйти</a>
            </div>
        </div>
        <a class="btn-primary" href="/sell">Продавать</a>`;
    }

    catch {
        authArea.innerHTML = `
            <a class="auth-btn" href="/login">Войти</a>
            <a class="btn-primary" href="/registration">Продавать</a>`;
    }
}

async function logout() {
    await fetch('/auth/logout', { method: 'POST' });
    window.location.href = '/';
}

initAuth();