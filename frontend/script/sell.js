function count(id, countId, max) {
    const len = document.getElementById(id).value.length;
    document.getElementById(countId).textContent = len + ' / ' + max;
}

function clear(id) {
    document.getElementById(id).classList.remove('err');
    document.getElementById(id + '-err').style.display = 'none';
}

function showErr(id) {
    document.getElementById(id).classList.add('err');
    document.getElementById(id + '-err').style.display = 'block';
}

async function submit() {
    const name = document.getElementById('name').value.trim();
    const desc = document.getElementById('desc').value.trim();
    let ok = true;
    if (!name) { showErr('name'); ok = false; }
    if (!desc)  { showErr('desc');  ok = false; }
    if (!ok) return;

    try {
      const res = await fetch('http://localhost:8000/sell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, description: desc })
    });

    const data = await res.json();

    if (res.ok) {
        document.getElementById('form-view').style.display = 'none';
        document.getElementById('success-text').textContent = '«' + data.name + '» добавлен в каталог';
        document.getElementById('success-view').style.display = 'block';
    } else {
        alert('Ошибка: ' + data.detail);
    }

    } catch (e) {
      alert('Сервер недоступен.');
    }
}

function reset() {
    document.getElementById('name').value = '';
    document.getElementById('desc').value = '';
    document.getElementById('name-count').textContent = '0 / 100';
    document.getElementById('desc-count').textContent = '0 / 500';
    document.getElementById('success-view').style.display = 'none';
    document.getElementById('form-view').style.display = 'block';
}
