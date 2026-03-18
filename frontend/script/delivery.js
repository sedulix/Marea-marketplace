
function trackOrder() {
    const val = document.getElementById('track-field').value.trim();
    const res = document.getElementById('track-result');
    if (!val) {
        res.style.display = 'block';
        res.innerHTML = '<div style="color: rgba(255,255,255,.5); font-size: 13px;">Введите номер заказа</div>';
        return;
    }

    res.style.display = 'block';
    res.innerHTML = '<div style="color: rgba(255,255,255,.6); font-size: 13px;">🔍 Ищем заказ...</div>';

    setTimeout(() => {
        res.innerHTML = `
            <div style="background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.14); border-radius: 12px; padding: 16px;">
                <div style="font-size: 12px; color: rgba(255,255,255,.45); letter-spacing: .5px; text-transform: uppercase; margin-bottom: 8px;">Заказ ${val}</div>
                <div style="font-size: 15px; font-weight: 600; color: #7EC8F5; margin-bottom: 6px;">🚚 В пути — прибудет завтра</div>
                <div style="font-size: 13px; color: rgba(255,255,255,.5);">Курьер позвонит за 30 минут до прибытия</div>
            </div>`;
    }, 900);
}

function toggleFaq(el) {
    const item = el.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
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
