
function clearErr(id) {
    document.getElementById(id).classList.remove('err');
    document.getElementById(id + '-err').style.display = 'none';
}

function showErr(id) {
    document.getElementById(id).classList.add('err');
    document.getElementById(id + '-err').style.display = 'block';
}

async function submitForm() {
    const login = document.getElementById('login').value.trim();
    const password = document.getElementById('password').value.trim();
    let isValid = true;

    if (!login) { showErr('login'); isValid = false; }
    if (!password) { showErr('password'); isValid = false; }

    if (!isValid) return;

    try {
        const res = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: login,
                password: password
            })
        });

        const data = await res.json();
        if (!res.ok) {
            alert('Ошибка: ' + (data.detail || 'Неверный логин или пароль'));
            return;
        }

        document.getElementById('form-view').style.display = 'none';
        document.getElementById('success-text').textContent = 'Вы успешно вошли как «' + login + '».';
        document.getElementById('success-view').style.display = 'block';

        setTimeout(() => {
            window.location.href = "/";
        }, 2000);

    } catch (err) {
        console.error(err);
        alert("Сервер не отвечает");
    }
}

function resetForm() {
    document.getElementById('login').value = '';
    document.getElementById('password').value = '';
    document.getElementById('success-view').style.display = 'none';
    document.getElementById('form-view').style.display = 'block';
}
