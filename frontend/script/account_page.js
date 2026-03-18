
async function loadProfile() {
    const res = await fetch('/auth/me');
    if (!res.ok) { window.location.href = '/login'; return; }

    const data = await res.json();
    const letter = data.user.charAt(0).toUpperCase();

    document.getElementById('avatar-text').textContent = letter;
    document.getElementById('profile-username').textContent = data.user;
    document.getElementById('profile-email').textContent = data.email;

    const badge = document.querySelector('.profile-badge');
    if (badge) badge.textContent = letter;
}

loadProfile();

function loadAvatar(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const img = document.getElementById('avatar-img');
            const text = document.getElementById('avatar-text');

            img.src = e.target.result;
            img.style.display = 'block';
            text.style.display = 'none';
      }
      reader.readAsDataURL(file);
    }
}

function saveData(btn) {
    const originalText = btn.textContent;
    btn.textContent = 'Сохранение...';
    btn.style.opacity = '0.8';

    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.opacity = '1';

        const toast = document.getElementById('toastMsg');
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }, 800);
}

async function logout() {
    try {
        const res = await fetch('/auth/logout', {
            method: 'POST'
        });

        if (res.redirected) {
            window.location.href = res.url;
        }

        else {
            window.location.href = "/";
        }
    }

    catch (err) {
        console.error("Logout error:", err);
        window.location.href = "/";
    }
}

