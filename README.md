# 🏗️ CATAMP S.A.S — Ingeniería y Obra Civil

> **Sistema web corporativo y plataforma de atención al cliente** para **CATAMP S.A.S**, empresa con más de 6 años de experiencia en el desarrollo de proyectos de obra civil en Bogotá y Colombia.

---

## 📌 Descripción del Proyecto

Este proyecto corresponde a la plataforma web oficial de la compañía, diseñada para presentar el portafolio de servicios técnicos de construcción e infraestructura, digitalizar la captación de clientes y brindar atención directa mediante integración con WhatsApp Business, un formulario modal dinámico y un backend en Flask desplegado en la nube.

---

## 🎯 Objetivos

* **Página Web Profesional:** Crear una interfaz web escalable, moderna y 100% adaptable a dispositivos móviles (`responsive`).
* **Captación de Clientes:** Implementar un formulario de contacto interactivo que almacene consultas de cotización en la base de datos y envíe notificaciones por correo electrónico.
* **Integración Directa:** Vincular los canales oficiales de comunicación de la empresa (WhatsApp Business oficial y Correo corporativo).
* **Documentación Técnica:** Documentar cada fase del desarrollo, registrando los requerimientos funcionales y técnicos del sistema para garantizar su mantenimiento a largo plazo.
* **Publicación en la Nube:** Publicar el sistema en GitHub y desplegar el backend en servicios de hosting de producción.

---

## 🛠️ Stack Tecnológico y Herramientas

### **Backend & Base de Datos**
* **Lenguaje:** Python 3.10+
* **Framework Web:** Flask
* **ORM & Persistencia:** SQLAlchemy
* **Base de Datos:** SQLite (Desarrollo local) / PostgreSQL / MySQL (Entorno de producción)
* **Envío de Correos:** SMTP de Gmail (`Flask-Mail` / Contraseña de aplicación)
* **Gestión de Entorno:** `python-dotenv`

### **Frontend & UI/UX**
* **Maquetación:** HTML5 Semántico (`index.html`, `layout.html`)
* **Estilos:** CSS3 (Variables CSS, Flexbox, CSS Grid, Animaciones, Media Queries, `styles.css`)
* **Lógica Cliente:** JavaScript (ES6+ / Control del DOM y eventos, `main.js`)
* **Componentes UI:** Bootstrap 5 (Soporte para ventanas modales y grillas)
* **Iconografía & Tipografía:** FontAwesome / Google Fonts

### **Despliegue & Servidor**
* **Servidor WSGI:** Gunicorn
* **Plataforma Cloud:** Render PaaS
* **Control de Versiones:** Git & GitHub

---

## 📁 Documentación y Estructura del Proyecto

El proyecto mantiene una estructura inicial y modular organizada junto a su respectiva documentación técnica:

```text
Catamp-web/
├── static/
│   ├── css/
│   │   └── styles.css          # Estilos globales, variables y responsive
│   ├── js/
│   │   └── main.js             # Lógica interactiva del menú y modal
│   └── images/                 # Logo e imágenes corporativas
├── templates/
│   ├── index.html              # Landing page principal (Primer prototipo)
│   └── layout.html             # Estructura base HTML
├── docs/                       # Documentación técnica
│   ├── requirements.md         # Documento de requerimientos funcionales y técnicos
│   └── roadmap.md              # Plan de desarrollo paso a paso
├── app.py                      # Punto de entrada de la aplicación Flask
├── models.py                   # Modelos relacionales de SQLAlchemy
├── config.py                   # Configuración del servidor y correo
├── requirements.txt            # Dependencias del proyecto
└── Procfile                    # Comando de inicio para Gunicorn en Render


Detalle de archivos iniciales y documentación:
requirements.md: Documento de requerimientos funcionales y técnicos del sistema.

roadmap.md: Plan de desarrollo paso a paso del proyecto.

index.html y styles.css: Primer prototipo de la landing page corporativa.

Carpeta docs/: Documentación técnica integral del software.


💻 Instalación y Ejecución Local


1. Clonar el repositorio
Bash
git clone [https://github.com/Johan-dev32/Catamp-web.git](https://github.com/Johan-dev32/Catamp-web.git)
cd Catamp-web


2. Crear y activar entorno virtual
Bash
python -m venv venv
# En Windows (Git Bash):
source venv/Scripts/activate


3. Instalar dependencias
Bash
pip install -r requirements.txt


4. Configurar variables de entorno (.env)
Crea un archivo .env en la raíz del proyecto:

Fragmento de código
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=tu_clave_secreta
MAIL_USERNAME=catampingenieriaobracivil@gmail.com
MAIL_PASSWORD=tu_contraseña_de_aplicacion


5. Iniciar la aplicación
Bash
python app.py
Accede a http://127.0.0.1:5000 en tu navegador.

**Autor
Johan Andrés Tamara Salas

Desarrollador Web / Tecnólogo en Análisis y Desarrollo de Software (SENA)**
