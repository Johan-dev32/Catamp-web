// ANIMACIONES AL HACER SCROLL //

const animatedElements = document.querySelectorAll(
    ".section-heading, .about-text, .stats, .service-card, " +
    ".technical-card, .technical-header, .technical-action, " +
    ".sector, .why-header, .why-card, .contact-content, .gallery-card"
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
    { threshold: 0.15 }
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
    btnMenu.addEventListener('click', () => {
        btnMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            btnMenu.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}


// CONTROL DE VENTANAS MODALES Y EVENTOS DOM //

document.addEventListener('DOMContentLoaded', () => {
    const modalContacto = document.getElementById('modalContacto');
    const modalFormBody = document.getElementById('modalFormBody');
    const btnCerrarContacto = document.getElementById('btnCerrarModal');
    const formContacto = document.getElementById('formContacto');
    const mensajeEstado = document.getElementById('mensajeEstado');
    const btnCerrarEstado = document.getElementById('btnCerrarEstado');

    // Abrir modal de contacto
    const btnsAbrirModal = document.querySelectorAll('#btnAbrirModal, .btn[href="#contacto"]');

    btnsAbrirModal.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (modalContacto) modalContacto.classList.add('active');
        });
    });

    const resetearVistaModal = () => {
        if (modalFormBody && mensajeEstado) {
            modalFormBody.style.display = 'block';
            mensajeEstado.classList.add('hidden');
        }
    };

    if (btnCerrarContacto) {
        btnCerrarContacto.addEventListener('click', () => {
            if (modalContacto) {
                modalContacto.classList.remove('active');
                setTimeout(resetearVistaModal, 300);
            }
        });
    }

    if (btnCerrarEstado) {
        btnCerrarEstado.addEventListener('click', () => {
            if (modalContacto) {
                modalContacto.classList.remove('active');
                setTimeout(resetearVistaModal, 300);
            }
        });
    }

    // Envío del formulario de contacto
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

    // MODAL DETALLE DE SECTORES //
    const sectoresInfo = {
        residencial: {
            eyebrow: "SECTOR RESIDENCIAL",
            titulo: "Sector Residencial",
            descripcion: "Transformamos planos en el hogar de tus sueños. Diseñamos, construimos y remodelamos espacios residenciales enfocados en el confort, la funcionalidad y la más alta calidad técnica para tu familia.",
            servicios: [
                "Diseño y construcción de viviendas unifamiliares y multifamiliares.",
                "Remodelación técnica de interiores y espacios residenciales.",
                "Mantenimiento preventivo y correctivo de áreas comunes.",
                "Garantía de confort, funcionalidad y alta calidad técnica."
            ]
        },
        comercial: {
            eyebrow: "SECTOR COMERCIAL",
            titulo: "Sector Comercial",
            descripcion: "Creamos espacios que impulsan tu negocio. Desarrollamos diseños arquitectónicos y remodelaciones para locales comerciales y oficinas, optimizando cada metro cuadrado para mejorar la experiencia de tus clientes y colaboradores.",
            servicios: [
                "Diseño arquitectónico y adecuación de locales comerciales.",
                "Remodelación y distribución eficiente de oficinas.",
                "Optimización de espacios para experiencia de clientes y colaboradores.",
                "Mantenimiento y acabados de alto impacto."
            ]
        },
        industrial: {
            eyebrow: "SECTOR INDUSTRIAL",
            titulo: "Sector Industrial",
            descripcion: "Soluciones de ingeniería robustas y eficientes. Nos encargamos de la construcción, remodelación y mantenimiento de plantas, bodegas y estructuras industriales bajo estrictos estándares de seguridad, resistencia y normatividad vigente.",
            servicios: [
                "Construcción y reforzamiento de estructuras industriales.",
                "Remodelación y adecuación de plantas y bodegas.",
                "Mantenimiento técnico especializado para infraestructura.",
                "Cumplimiento de estrictos estándares de seguridad y normatividad NSR-10."
            ]
        }
    };

    const modalSectorDetail = document.getElementById('modalSectorDetail');
    const btnCerrarSector = document.getElementById('btnCerrarSector');
    const sectorDetailEyebrow = document.getElementById('sectorDetailEyebrow');
    const sectorDetailTitle = document.getElementById('sectorDetailTitle');
    const sectorDetailDescription = document.getElementById('sectorDetailDescription');
    const sectorDetailList = document.getElementById('sectorDetailList');
    const btnCotizarSector = document.getElementById('btnCotizarSector');

    const sectorCards = document.querySelectorAll('.sector');

    sectorCards.forEach(card => {
        let keySector = '';
        if (card.classList.contains('sector-residencial')) keySector = 'residencial';
        else if (card.classList.contains('sector-comercial')) keySector = 'comercial';
        else if (card.classList.contains('sector-industrial')) keySector = 'industrial';

        card.addEventListener('click', (e) => {
            e.preventDefault();

            const info = sectoresInfo[keySector];
            if (info && modalSectorDetail) {
                if (sectorDetailEyebrow) sectorDetailEyebrow.textContent = info.eyebrow;
                if (sectorDetailTitle) sectorDetailTitle.textContent = info.titulo;
                if (sectorDetailDescription) sectorDetailDescription.textContent = info.descripcion;

                if (sectorDetailList) {
                    sectorDetailList.innerHTML = '';
                    info.servicios.forEach(servicio => {
                        const li = document.createElement('li');
                        li.textContent = servicio;
                        sectorDetailList.appendChild(li);
                    });
                }

                modalSectorDetail.classList.add('active');
            }
        });
    });

    if (btnCerrarSector) {
        btnCerrarSector.addEventListener('click', () => {
            if (modalSectorDetail) modalSectorDetail.classList.remove('active');
        });
    }

    if (btnCotizarSector) {
        btnCotizarSector.addEventListener('click', (e) => {
            e.preventDefault();
            if (modalSectorDetail) modalSectorDetail.classList.remove('active');

            const mensajeInput = document.getElementById('mensaje');
            if (mensajeInput && sectorDetailTitle) {
                mensajeInput.value = `Hola, quisiera solicitar una cotización/información sobre el sector: ${sectorDetailTitle.textContent}.`;
            }

            setTimeout(() => {
                if (modalContacto) modalContacto.classList.add('active');
            }, 200);
        });
    }

    // GALERÍA DE 3 FOTOS EN DISEÑOS ESTRUCTURALES //
    const galeriaEstructural = [
        { url: '/static/img/Diseño3.jpeg', label: '1 / 3: Modelo 3D' },
        { url: '/static/img/Diseños2.jpeg', label: '2 / 3: Análisis de Cargas' },
        { url: '/static/img/Diseño4.jpeg', label: '3 / 3: Cimentación y Armaduras' }
    ];

    let indexEstructural = 0;

    const imgEstructural = document.getElementById('imgEstructural');
    const sliderBadge = document.getElementById('sliderBadge');
    const btnPrev = document.getElementById('prevImg');
    const btnNext = document.getElementById('nextImg');

    function actualizarVisualizador(nuevoIndex) {
        if (!imgEstructural || !sliderBadge) return;
        imgEstructural.style.opacity = '0.2';
        setTimeout(() => {
            imgEstructural.src = galeriaEstructural[nuevoIndex].url;
            sliderBadge.textContent = galeriaEstructural[nuevoIndex].label;
            imgEstructural.style.opacity = '1';
        }, 150);
    }

    if (btnPrev && btnNext) {
        btnPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            indexEstructural = (indexEstructural === 0) ? galeriaEstructural.length - 1 : indexEstructural - 1;
            actualizarVisualizador(indexEstructural);
        });

        btnNext.addEventListener('click', (e) => {
            e.stopPropagation();
            indexEstructural = (indexEstructural === galeriaEstructural.length - 1) ? 0 : indexEstructural + 1;
            actualizarVisualizador(indexEstructural);
        });
    }

    // LÓGICA DE FILTROS EN GALERÍA //
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryCards = document.querySelectorAll('.gallery-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            galleryCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'todos' || filter === category) {
                    card.classList.remove('hide');
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });

    // Acción del botón "Cotizar proyecto similar"
    const btnsCotizarObra = document.querySelectorAll('.btn-cotizar-obra');

    btnsCotizarObra.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const nombreProyecto = btn.getAttribute('data-proyecto');
            const mensajeInput = document.getElementById('mensaje');

            if (mensajeInput && nombreProyecto) {
                mensajeInput.value = `Hola, vi su proyecto de "${nombreProyecto}" en la galería y me gustaría cotizar una obra similar.`;
            }

            if (modalContacto) {
                modalContacto.classList.add('active');
            }
        });
    });

    // SUBIR NUEVO PROYECTO (ADMIN) //
    const btnAbrirSubirProyecto = document.getElementById('btnAbrirSubirProyecto');
    const formSubirProyecto = document.getElementById('formSubirProyecto');
    const modalSubirProyecto = document.getElementById('modalSubirProyecto');
    const btnCerrarSubirProyecto = document.getElementById('btnCerrarSubirProyecto');

    if (btnAbrirSubirProyecto && modalSubirProyecto) {
        btnAbrirSubirProyecto.addEventListener('click', () => {
            modalSubirProyecto.classList.add('active');
        });
    }

    if (formSubirProyecto) {
        formSubirProyecto.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(formSubirProyecto);
            const btnSubmit = formSubirProyecto.querySelector('button[type="submit"]');

            if (btnSubmit) {
                btnSubmit.disabled = true;
                btnSubmit.textContent = 'Guardando...';
            }

            try {
                const response = await fetch('/api/galeria/nuevo', {
                    method: 'POST',
                    body: formData
                });

                const resultado = await response.json();

                if (response.ok) {
                    alert('¡Proyecto publicado con éxito!');
                    formSubirProyecto.reset();
                    if (modalSubirProyecto) modalSubirProyecto.classList.remove('active');
                    window.location.reload();
                } else {
                    alert('Error: ' + resultado.message);
                }
            } catch (error) {
                alert('Ocurrió un error al subir el proyecto a la galería.');
            } finally {
                if (btnSubmit) {
                    btnSubmit.disabled = false;
                    btnSubmit.textContent = 'Publicar en Galería';
                }
            }
        });
    }

    if (btnCerrarSubirProyecto && modalSubirProyecto) {
        btnCerrarSubirProyecto.addEventListener('click', () => {
            modalSubirProyecto.classList.remove('active');
        });
    }

    // Cierre de modales al hacer clic fuera del contenido
    window.addEventListener('click', (e) => {
        if (e.target === modalContacto) {
            modalContacto.classList.remove('active');
            setTimeout(resetearVistaModal, 300);
        }
        if (e.target === modalSectorDetail) {
            modalSectorDetail.classList.remove('active');
        }
        if (e.target === modalSubirProyecto) {
            modalSubirProyecto.classList.remove('active');
        }
    });
});