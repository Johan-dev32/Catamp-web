// ANIMACIONES AL HACER SCROLL //

const animatedElements = document.querySelectorAll(
    ".section-heading, .about-text, .stats, .service-card, " +
    ".technical-card, .technical-header, .technical-action, " +
    ".sector, .why-header, .why-card, .contact-content"
);

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.15
    }
);

animatedElements.forEach((element) => {
    element.classList.add("hidden");
    observer.observe(element);
});


// HEADER AL HACER SCROLL //

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {
        header.classList.add("header-scrolled");
    } else {
        header.classList.remove("header-scrolled");
    }

});

// ENVÍO DEL FORMULARIO DE CONTACTO A FLASK //

document.addEventListener('DOMContentLoaded', () => {
    const formContacto = document.getElementById('formContacto');

    if (formContacto) {
        formContacto.addEventListener('submit', async (e) => {
            e.preventDefault();

            const datos = {
                nombre: document.getElementById('nombre').value,
                correo: document.getElementById('correo').value,
                telefono: document.getElementById('telefono').value,
                mensaje: document.getElementById('mensaje').value
            };

            try {
                const response = await fetch('/api/contacto', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                });

                const resultado = await response.json();

                if (response.ok) {
                    alert(resultado.message);
                    formContacto.reset();
                } else {
                    alert('Error: ' + resultado.message);
                }
            } catch (error) {
                alert('Ocurrió un error al enviar tú solicitud. Inténtalo de nuevo.');
            }
        });
    }
});


// CONTROL DE LA VENTANA MODAL //

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modalContacto');
    const btnAbrir = document.getElementById('btnAbrirModal');
    const btnCerrar = document.getElementById('btnCerrarModal');
    const formContacto = document.getElementById('formContacto');

    // Abrir modal con botón de contacto y botón de navbar ("Solicitar visita")
    const btnsAbrirModal = document.querySelectorAll('#btnAbrirModal, .btn[href="#contacto"]');

    btnsAbrirModal.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
        });
    });

    // Cerrar con la X
    if (btnCerrar) {
        btnCerrar.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    // Cerrar haciendo clic fuera de la ventana
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Envío del formulario a Flask
    if (formContacto) {
        formContacto.addEventListener('submit', async (e) => {
            e.preventDefault();

            const datos = {
                nombre: document.getElementById('nombre').value,
                correo: document.getElementById('correo').value,
                telefono: document.getElementById('telefono').value,
                mensaje: document.getElementById('mensaje').value
            };

            try {
                const response = await fetch('/api/contacto', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                });

                const resultado = await response.json();

                if (response.ok) {
                    alert(resultado.message);
                    formContacto.reset();
                    modal.classList.remove('active'); // Cerrar modal al enviar
                } else {
                    alert('Error: ' + resultado.message);
                }
            } catch (error) {
                alert('Ocurrió un error al enviar la solicitud. Inténtalo de nuevo.');
            }
        });
    }
});