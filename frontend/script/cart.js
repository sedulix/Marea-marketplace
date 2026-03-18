let deliveryCost = 0;
let promoDiscount = 0;

function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const list = document.getElementById('cart-list');
    list.innerHTML = '';

    cart.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.dataset.price = item.price;
        div.dataset.index = index;
        div.innerHTML = `

       <input type="checkbox" class="item-check" style="accent-color: var(--accent); width: 16px; height: 16px; flex-shrink: 0;">
       <div class="item-img" style="background: #FDE8DC; width: 90px; height: 90px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 44px; flex-shrink: 0;">${item.emoji}</div>

       <div class="item-info" style="flex: 1;">
         <div class="item-name" style="font-family: 'Playfair Display',serif; font-size: 17px; font-weight: 500; margin-bottom: 6px;">${item.name}</div>
         <div style="font-size: 13px; color: var(--muted);">${item.price.toLocaleString('ru')} ₽ за шт.</div>
      </div>

      <div class="item-qty">
        <button class="qty-btn" onclick="changeQty(this,-1)">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(this,1)">+</button>
      </div>

      <div class="item-price">${(item.price * item.qty).toLocaleString('ru')} ₽</div>
      <button class="item-del" onclick="delItem(this)">✕</button>
    `;
    list.appendChild(div);
});

    updateSummary();
}

function saveCart() {
    const items = document.querySelectorAll('.cart-item');
    const cart = [...items].map(item => ({
        name: item.querySelector('.item-name').textContent,
        price: +item.dataset.price,
        emoji: item.querySelector('.item-img').textContent.trim(),
        qty: +item.querySelector('.qty-num').textContent
    }));
    localStorage.setItem('cart', JSON.stringify(cart));
}

loadCart();


function getItems() {
    return document.querySelectorAll('.cart-item');
}

function updateSummary() {
    const items = getItems();
    let total = 0;
    let count = 0;

    items.forEach(item => {
      const price = +item.dataset.price;
      const qty = +item.querySelector('.qty-num').textContent;
      total += price * qty;
      count += qty;
    });

    const promoAmt = Math.round(total * promoDiscount);
    const finalTotal = total - promoAmt + deliveryCost;

    document.getElementById('s-count').textContent = count;
    document.getElementById('s-subtotal').textContent = total.toLocaleString('ru') + ' ₽';
    document.getElementById('s-promo').textContent = promoDiscount ? '−' + promoAmt.toLocaleString('ru') + ' ₽' : '—';
    document.getElementById('s-total').textContent = finalTotal.toLocaleString('ru') + ' ₽';
    document.getElementById('cart-count').textContent = items.length + ' ' + declension(items.length, ['товар','товара','товаров']);

    const isEmpty = items.length === 0;
    document.getElementById('cart-list').style.display = isEmpty ? 'none' : '';
    document.getElementById('empty').style.display = isEmpty ? 'block' : 'none';
    document.getElementById('cart-toolbar').style.display = isEmpty ? 'none' : '';
    document.getElementById('sidebar').style.display = isEmpty ? 'none' : '';
    document.querySelector('.layout').style.gridTemplateColumns = isEmpty ? '1fr' : '1fr 360px';
    document.querySelector('.layout').style.maxWidth = isEmpty ? '640px' : '1280px';
}

function declension(n, forms) {
    const mod10 = n % 10, mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return forms[0];
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
    return forms[2];
}

function changeQty(btn, delta) {
    const item = btn.closest('.cart-item');
    const numEl = item.querySelector('.qty-num');
    const priceEl = item.querySelector('.item-price');

    let qty = +numEl.textContent + delta;
    if (qty < 1) { delItem(item.querySelector('.item-del')); return; }
    numEl.textContent = qty;

    const base = +item.dataset.price;

    priceEl.textContent = (base * qty).toLocaleString('ru') + ' ₽';
    saveCart();
    updateSummary();
}

function delItem(btn) {
    const item = btn.closest('.cart-item');
    item.style.transition = 'opacity .25s, transform .25s';
    item.style.opacity = '0';
    item.style.transform = 'translateX(20px)';

    setTimeout(() => {
        item.remove();
        saveCart();
        updateSummary();
    }, 250);
}

function toggleAll(cb) {
    document.querySelectorAll('.item-check').forEach(c => c.checked = cb.checked);
}

function delSelected() {
    document.querySelectorAll('.item-check:checked').forEach(c => {
        delItem(c.closest('.cart-item').querySelector('.item-del'));
    });
    document.getElementById('check-all').checked = false;
}

function selectDelivery(label, cost) {
    document.querySelectorAll('.delivery-opt').forEach(l => l.classList.remove('selected'));
    label.classList.add('selected');
    deliveryCost = cost;

    document.getElementById('s-delivery').textContent = cost ? cost.toLocaleString('ru') + ' ₽' : 'Бесплатно';
    document.getElementById('s-delivery').className = cost ? 'val' : 'green';
    updateSummary();
}

function applyPromo() {
    const val = document.getElementById('promo').value.trim().toUpperCase();
    const ok = document.getElementById('promo-ok');

    if (val === 'SPRING15' || val === 'MAREA15') {
        promoDiscount = 0.15;
        ok.style.display = 'block';
    }
    else {
        ok.style.display = 'none';
        ok.textContent = '✗ Промокод не найден';
        ok.style.color = 'var(--red)';

        promoDiscount = 0;
        setTimeout(() => { ok.style.display = 'none'; ok.style.color = 'var(--green)'; ok.textContent = '✓ Промокод применён — скидка 15%'; }, 2000);
    }

    updateSummary();
}

function checkout() {
    alert('Переход к оформлению заказа!');
}

updateSummary();

const authArea = document.getElementById("auth-area");
async function initAuth() {
    const checkoutBtn = document.getElementById('checkout-btn');

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
        <button class="btn-primary" onclick="checkout()">Оформить заказ</button>`;

        if (checkoutBtn) checkoutBtn.onclick = checkout;
    }

    catch {
        authArea.innerHTML = `
            <a class="auth-btn" href="/login">Войти</a>
            <button class="btn-primary" onclick="window.location.href='/registration'">Оформить заказ</button>`;

        if (checkoutBtn) checkoutBtn.onclick = () => window.location.href = '/registration';
    }
}

async function logout() {
    await fetch('/auth/logout', { method: 'POST' });
    window.location.href = '/';
}

initAuth();

