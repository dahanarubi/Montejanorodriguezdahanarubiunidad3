let map, marker;

async function geo() {
    // Llamas a tu API
    const res = await fetch('/geo');
    const data = await res.json();

    // Muestra las coordenadas
    document.getElementById('geo').innerHTML =
        `Latitud: ${data.lat}° N <br> Longitud: ${data.lng}° O`;

    // Inicializa el mapa solo la primera vez
    if (!map) {
        map = L.map('map').setView([data.lat, data.lng], 16); // zoom 16 para ver edificio
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);

        marker = L.marker([data.lat, data.lng]).addTo(map)
            .bindPopup('Mi escuela').openPopup();
    } else {
        // Si ya existe, solo actualiza la posición del marcador
        marker.setLatLng([data.lat, data.lng]);
        map.setView([data.lat, data.lng], 16);
    }
}

async function social() {
    const res = await fetch('/social');
    const data = await res.json();

    document.getElementById('social').innerHTML =
        data.map(r => `<a href="${r.link}" target="_blank">${r.red}</a><br>`).join('');
}

async function publicaciones() {
    const res = await fetch('/posts');
    const data = await res.json();

    let html = "";

    data.forEach(post => {
        html += `
            <div style="border:1px solid gray; margin:10px; padding:10px;">
                <h3>${post.titulo}</h3>
                <p>Autor: ${post.autor}</p>
                <a href="${post.link}" target="_blank">Ver publicación</a>
            </div>
        `;
    });

    document.getElementById('posts').innerHTML = html;
}

async function buscarProducto() {
    const producto = document.getElementById('busqueda').value;

    const res = await fetch(`/buscar?producto=${producto}`);
    const data = await res.json();

    let html = "";

    data.forEach(p => {
        html += `
            <div style="border:1px solid gray; margin:10px; padding:10px;">
                <h3>${p.nombre}</h3>
                <img src="${p.imagen}">
                <p>Precio: $${p.precio}</p>
                <a href="${p.link}" target="_blank">Ver producto</a>
            </div>
        `;
    });

    document.getElementById('resultados').innerHTML = html;
}

async function guardar() {
    const nombre = document.getElementById('nombre').value;
    const usuario = document.getElementById('usuario').value;

    const res = await fetch('/usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, usuario })
    });

    const data = await res.json();
    alert(data.mensaje);
}

async function verUsuarios() {
    const res = await fetch('/usuarios');
    const data = await res.json();

    let html = "";

    data.forEach(u => {
        html += `<p>${u.nombre} - ${u.usuario}</p>`;
    });

    document.getElementById('listaUsuarios').innerHTML = html;
}

async function sms() {
    const telefono = document.getElementById('telefono').value;
    const mensaje = document.getElementById('mensaje').value;

    const res = await fetch('/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telefono, mensaje })
    });

    const data = await res.json();
    alert(data.mensaje);
}

async function video() {
    const res = await fetch('/video'); // Llamada a nuestra "API"
    const data = await res.json();

    const player = document.getElementById('playerVideo');
    player.src = data.video; // Asigna la URL del JSON
    player.load(); // Recarga el video
    player.play(); // Opcional: inicia automáticamente
}
