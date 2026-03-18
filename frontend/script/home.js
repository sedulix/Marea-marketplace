
document.querySelectorAll('.cat-pill').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

document.querySelectorAll('.chip').forEach(btn => {
    btn.addEventListener('click', () => btn.classList.toggle('on'));
});

document.querySelectorAll('.fav').forEach(btn => {
    btn.addEventListener('click', e => {
        e.stopPropagation();
        btn.classList.toggle('on');
        btn.textContent = btn.classList.contains('on') ? '❤️' : '🤍';
    });
});

document.querySelectorAll('.add').forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.card');
        const name = card.dataset.name;
        const price = +card.dataset.price;
        const emoji = card.dataset.emoji;

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

        btn.textContent = '✓ Добавлено';
        btn.style.background = 'var(--accent)';
        btn.style.color = '#fff';

        setTimeout(() => {
            btn.textContent = 'В корзину';
            btn.style.background = '';
            btn.style.color = '';
        }, 1500);
    });
});

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const total = cart.reduce((sum, i) => sum + i.qty, 0);
    const badge = document.querySelector('.badge');
    if (badge) badge.textContent = total;
}

updateCartBadge();

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

