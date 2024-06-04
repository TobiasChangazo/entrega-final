let mercaderia = [];

let Carrito = JSON.parse(localStorage.getItem('Carrito')) || [];

function RenderMercaderia() {
    const ListaProductos = document.getElementById('ListaProductos');
    ListaProductos.innerHTML = '';
    mercaderia.forEach(producto => {
        const productosDiv = document.createElement('div');
        productosDiv.className = 'producto';
        productosDiv.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h2>${producto.nombre}</h2>
            <p class="precio">$${producto.precio}</p>
            <button onclick="AgregarAlCarrito(${producto.id})">Agregar al Carrito</button>
        `;
        ListaProductos.appendChild(productosDiv);
    });
}

function RenderCarrito() {
    const CarritoProductos = document.getElementById('CarritoProductos');
    CarritoProductos.innerHTML = '';
    Carrito.forEach(item => {
        const ProductosEnCarrito = document.createElement('li');
        ProductosEnCarrito.className = 'carrito-item';
        ProductosEnCarrito.innerHTML = `
            <div class="item-info">
                <img src="${item.imagen}" alt="${item.nombre}">
                <div>
                    <h3>${item.nombre}</h3>
                    <p class="precio">$${item.precio} x${item.cantidad}</p>
                </div>
            </div>
            <button onclick="ConfirmarEliminarDelCarrito(${item.id})">Eliminar</button>
        `;
        CarritoProductos.appendChild(ProductosEnCarrito);
    });
    localStorage.setItem('Carrito', JSON.stringify(Carrito));
}

function AgregarAlCarrito(IDproducto) {
    const producto = mercaderia.find(el => el.id === IDproducto);
    const itemEnCarrito = Carrito.find(item => item.id === producto.id);

    if (itemEnCarrito) {
        itemEnCarrito.cantidad++;
    } else {
        Carrito.push({ ...producto, cantidad: 1 });
    }

    RenderCarrito();

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1700,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
        icon: "success",
        title: '¡Producto Agregado al carrito!',
    });
}

function ActualizarCantidad(IDproducto, cantidad) {
    const producto = Carrito.find(item => item.id === IDproducto);
    if (producto) {
        producto.cantidad = parseInt(cantidad);
        RenderCarrito();
    }
}

function ConfirmarEliminarDelCarrito(IDproducto) {
    const itemEnCarrito = Carrito.find(item => item.id === IDproducto);

    if (itemEnCarrito) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Deseas eliminar ${itemEnCarrito.nombre} del carrito?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                EliminarDelCarrito(IDproducto);
                Swal.fire(
                    'Eliminado',
                    `${itemEnCarrito.nombre} Ha sido eliminado del carrito.`,
                    'success'
                );
            }
        });
    }
}

function EliminarDelCarrito(IDproducto) {
    const itemEnCarrito = Carrito.find(item => item.id === IDproducto);

    if (itemEnCarrito) {
        if (itemEnCarrito.cantidad > 1) {
            itemEnCarrito.cantidad--;
        } else {
            const index = Carrito.indexOf(itemEnCarrito);
            Carrito.splice(index, 1);
        }
    }

    RenderCarrito();
}

document.getElementById('VaciarCarrito').addEventListener('click', () => {
    if (Carrito.length > 0) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas vaciar el carrito?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, vaciar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                Carrito = [];
                RenderCarrito();
                Swal.fire(
                    'Realizado con Exito',
                    'El carrito ha sido vaciado.',
                    'success'
                );
            }
        });
    }
});

// Limpia el carrito una vez finalizada la compra y muestra el total a pagar con SweetAlert

document.getElementById('ChequeoCompra').addEventListener('click', () => {
    if (Carrito.length > 0) {
        const total = Carrito.reduce((suma, producto) => suma + (producto.precio * producto.cantidad), 0);
        Swal.fire({
            title: 'Compra Finaliza!',
            text: `Total a pagar: $${total}`,
            icon: 'success',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            localStorage.removeItem('Carrito');
            Carrito = [];
            RenderCarrito();
            document.getElementById('CarritoModal').style.display = 'none';
        });
    }
});

document.getElementById('VerCarrito').addEventListener('click', () => {
    document.getElementById('CarritoModal').style.display = 'block';
});

document.getElementById('CerrarCarrito').addEventListener('click', () => {
    document.getElementById('CarritoModal').style.display = 'none';
});

fetch('./js/data.json')
    .then(response => response.json())
    .then(data => {
        mercaderia = data;
        RenderMercaderia();
    })

RenderCarrito();
