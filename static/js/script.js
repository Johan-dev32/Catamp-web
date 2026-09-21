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


// CONTROL DEL MENÚ HAMBURGUESA //

const btnMenu = document.getElementById('btnMenu');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.navigation a');

if (btnMenu && navMenu) {
    // Toggle para abrir/cerrar
    btnMenu.addEventListener('click', () => {
        btnMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Cerrar el menú al hacer clic en cualquier enlace del menú
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            btnMenu.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}


// CONTROL DE LA VENTANA MODAL Y ENVÍO DE FORMULARIO //

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modalContacto');
    const modalFormBody = document.getElementById('modalFormBody');
    const btnCerrar = document.getElementById('btnCerrarModal');
    const formContacto = document.getElementById('formContacto');
    const mensajeEstado = document.getElementById('mensajeEstado');
    const btnCerrarEstado = document.getElementById('btnCerrarEstado');

    // Abrir modal
    const btnsAbrirModal = document.querySelectorAll('#btnAbrirModal, .btn[href="#contacto"]');

    btnsAbrirModal.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (modal) modal.classList.add('active');
        });
    });

    // Función auxiliar para resetear la vista del modal al cerrarse
    const resetearVistaModal = () => {
        if (modalFormBody && mensajeEstado) {
            modalFormBody.style.display = 'block'; // Muestra el cuerpo del formulario
            mensajeEstado.classList.add('hidden'); // Oculta el mensaje de éxito
        }
    };

    // Cerrar modal con la X
    if (btnCerrar) {
        btnCerrar.addEventListener('click', () => {
            if (modal) {
                modal.classList.remove('active');
                setTimeout(resetearVistaModal, 300);
            }
        });
    }

    // Cerrar con el botón "Aceptar" del mensaje de éxito
    if (btnCerrarEstado) {
        btnCerrarEstado.addEventListener('click', () => {
            if (modal) {
                modal.classList.remove('active');
                setTimeout(resetearVistaModal, 300);
            }
        });
    }

    // Cerrar haciendo clic fuera de la ventana
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            setTimeout(resetearVistaModal, 300);
        }
    });

    // Envío de formulario
    let enviandoFormulario = false;

    if (formContacto) {
        formContacto.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (enviandoFormulario) return;
            enviandoFormulario = true;

            const btnSubmit = formContacto.querySelector('button[type="submit"]');
            const textoOriginal = btnSubmit ? btnSubmit.textContent : 'Enviar';

            if (btnSubmit) {
                btnSubmit.disabled = true;
                btnSubmit.textContent = 'Enviando...';
            }

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
                    formContacto.reset();
                    
                    // FUERZA LA REMOCIÓN DEL CONTENEDOR DEL FORMULARIO DEL DOM TEMPORALMENTE
                    if (modalFormBody) modalFormBody.style.display = 'none';
                    if (mensajeEstado) mensajeEstado.classList.remove('hidden');
                } else {
                    alert('Error: ' + resultado.message);
                }
            } catch (error) {
                alert('Ocurrió un error al enviar tu solicitud. Inténtalo de nuevo.');
            } finally {
                enviandoFormulario = false;
                if (btnSubmit) {
                    btnSubmit.disabled = false;
                    btnSubmit.textContent = textoOriginal;
                }
            }
        });
    }
});