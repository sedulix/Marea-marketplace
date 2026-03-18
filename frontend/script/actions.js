
let total = 8 * 3600 + 34 * 60 + 17;
function tick() {
    if (total <= 0) return;
    total--;

    const h = String(Math.floor(total / 3600)).padStart(2,'0');
    const m = String(Math.floor((total % 3600) / 60)).padStart(2,'0');
    const s = String(total % 60).padStart(2,'0');

    document.getElementById('cd-h').textContent = h;
    document.getElementById('cd-m').textContent = m;
    document.getElementById('cd-s').textContent = s;
}

setInterval(tick, 1000);

function setTab(btn) {
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function toggleFav(e, btn) {
    e.stopPropagation();
    btn.classList.toggle('on');
    btn.textContent = btn.classList.contains('on') ? '❤️' : '🤍';
}

function addToCart(e, btn) {
    e.stopPropagation();
    btn.textContent = '✓ Добавлено';
    btn.style.background = 'var(--accent)';
    btn.style.color = '#fff';

    setTimeout(() => {
      btn.textContent = 'В корзину';
      btn.style.background = '';
      btn.style.color = '';
    }, 1500);
}

function copyCoupon(btn, code) {
    navigator.clipboard.writeText(code).catch(() => {});
    btn.textContent = '✓ Скопировано!';
    btn.style.background = 'var(--green)';
    btn.style.color = '#fff';

    setTimeout(() => {
      btn.textContent = 'Скопировать';
      btn.style.background = '';
      btn.style.color = '';
    }, 2000);
}

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

