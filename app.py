import os
import uuid
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

# Clave secreta para manejar las sesiones de usuario/admin
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') or 'catamp_secret_key_2026_prod'

db = SQLAlchemy(app)

# CONFIGURACIÓN DEL CORREO
MAIL_SERVER = 'smtp.gmail.com'
MAIL_PORT = 587
MAIL_USERNAME = 'catampingenieriaobracivil@gmail.com'
MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD') or 'xeukdysfqcuzgtov'
MAIL_DESTINATARIO = 'catampingenieriaobracivil@gmail.com'

# CREDENCIALES DE ADMINISTRADOR
ADMIN_USER = os.environ.get('ADMIN_USER') or 'adminCatamp'
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD') or 'Catamp2026*'

# Configuración de base de datos SQLite local y subida de archivos
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'catamp.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

UPLOAD_FOLDER = os.path.join(basedir, 'static', 'uploads', 'galeria')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Asegurar que la carpeta de subida exista
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# MODELO 1: Solicitudes de contacto/cotización
class SolicitudContacto(db.Model):
    __tablename__ = 'solicitudes'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    correo = db.Column(db.String(120), nullable=True)
    telefono = db.Column(db.String(20), nullable=False)
    mensaje = db.Column(db.Text, nullable=False)
    fecha = db.Column(db.DateTime, server_default=db.func.now())


# MODELO 2: Proyectos de la Galería
class ProyectoGaleria(db.Model):
    __tablename__ = 'proyectos_galeria'

    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(150), nullable=False)
    sector = db.Column(db.String(50), nullable=False)  # 'residencial', 'comercial', 'industrial'
    descripcion = db.Column(db.Text, nullable=False)
    imagen_filename = db.Column(db.String(255), nullable=False)
    fecha = db.Column(db.DateTime, server_default=db.func.now())


# Crear las tablas automáticamente
with app.app_context():
    db.create_all()


def es_imagen_permitida(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def enviar_notificacion_email(nombre, correo_cliente, telefono, mensaje):
    try:
        msg = MIMEMultipart('alternative')
        msg['From'] = MAIL_USERNAME
        msg['To'] = MAIL_DESTINATARIO
        msg['Subject'] = f"📥 Nueva Solicitud de Cotización: {nombre}"

        cuerpo_texto = f"""
        ¡Hola! Has recibido una nueva solicitud desde la web de CATAMP S.A.S.

        Cliente: {nombre}
        Teléfono: {telefono}
        Correo: {correo_cliente if correo_cliente else 'No especificado'}
        
        Mensaje:
        {mensaje}
        """

        cuerpo_html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body {{ font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; color: #333333; }}
                .email-container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }}
                .email-header {{ background-color: #06162f; padding: 25px 30px; text-align: center; border-bottom: 4px solid #fbbf24; }}
                .email-header h1 {{ color: #ffffff; margin: 0; font-size: 20px; letter-spacing: 0.5px; }}
                .email-body {{ padding: 30px; }}
                .greeting {{ font-size: 16px; color: #06162f; font-weight: 600; margin-bottom: 20px; }}
                .data-card {{ background-color: #f8fafc; border-left: 4px solid #00b5e2; border-radius: 4px; padding: 15px 20px; margin-bottom: 25px; }}
                .data-row {{ margin-bottom: 10px; font-size: 14px; }}
                .data-row:last-child {{ margin-bottom: 0; }}
                .data-label {{ font-weight: bold; color: #475569; width: 90px; display: inline-block; }}
                .data-value {{ color: #0f172a; }}
                .message-box {{ background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 18px; font-size: 14px; line-height: 1.6; color: #334155; }}
                .email-footer {{ background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }}
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header"><h1>CATAMP S.A.S.</h1></div>
                <div class="email-body">
                    <div class="greeting">¡Tienes una nueva solicitud de contacto desde la página web!</div>
                    <div class="data-card">
                        <div class="data-row"><span class="data-label">Cliente:</span><span class="data-value"><strong>{nombre}</strong></span></div>
                        <div class="data-row"><span class="data-label">Teléfono:</span><span class="data-value">{telefono}</span></div>
                        <div class="data-row"><span class="data-label">Correo:</span><span class="data-value">{correo_cliente if correo_cliente else 'No proporcionado'}</span></div>
                    </div>
                    <div style="font-weight: bold; font-size: 14px; color: #06162f; margin-bottom: 8px;">Detalles del proyecto / Mensaje:</div>
                    <div class="message-box">{mensaje}</div>
                </div>
                <div class="email-footer">Este es un correo automático generado desde el formulario de contacto web de <strong>CATAMP S.A.S.</strong></div>
            </div>
        </body>
        </html>
        """

        msg.attach(MIMEText(cuerpo_texto, 'plain'))
        msg.attach(MIMEText(cuerpo_html, 'html'))

        server = smtplib.SMTP(MAIL_SERVER, MAIL_PORT)
        server.starttls()
        server.login(MAIL_USERNAME, MAIL_PASSWORD)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Error al enviar correo: {e}")
        return False


# RUTA PRINCIPAL PÚBLICA
@app.route('/')
def home():
    proyectos = ProyectoGaleria.query.order_by(ProyectoGaleria.fecha.desc()).all()
    return render_template('index.html', proyectos=proyectos)


# RUTA DE AUTENTICACIÓN ADMIN
@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    error = None
    if request.method == 'POST':
        usuario = request.form.get('usuario')
        password = request.form.get('password')

        if usuario == ADMIN_USER and password == ADMIN_PASSWORD:
            session['es_admin'] = True
            return redirect(url_for('home'))
        else:
            error = "Usuario o contraseña incorrectos."

    return render_template('admin_login.html', error=error)


# CERRAR SESIÓN ADMIN
@app.route('/admin/logout')
def admin_logout():
    session.pop('es_admin', None)
    return redirect(url_for('home'))


# ENDPOINT DE CONTACTO (PÚBLICO)
@app.route('/api/contacto', methods=['POST'])
def recibir_contacto():
    try:
        data = request.get_json()

        if not data.get('nombre') or not data.get('telefono') or not data.get('mensaje'):
            return jsonify({'status': 'error', 'message': 'Por favor completa todos los campos requeridos.'}), 400

        nuevo_mensaje = SolicitudContacto(
            nombre=data.get('nombre'),
            correo=data.get('correo'),
            telefono=data.get('telefono'),
            mensaje=data.get('mensaje')
        )

        db.session.add(nuevo_mensaje)
        db.session.commit()
        
        if MAIL_PASSWORD:
            enviar_notificacion_email(
                data.get('nombre'),
                data.get('correo'),
                data.get('telefono'),
                data.get('mensaje')
            )

        return jsonify({'status': 'success', 'message': '¡Solicitud enviada con éxito! Nos pondremos en contacto contigo muy pronto.'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': f'Error en el servidor: {str(e)}'}), 500


# ENDPOINT PROTEGIDO PARA SUBIR PROYECTOS (SOLO ADMIN)
@app.route('/api/galeria/nuevo', methods=['POST'])
def agregar_proyecto_galeria():
    if not session.get('es_admin'):
        return jsonify({'status': 'error', 'message': 'Acceso no autorizado. Se requieren permisos de administrador.'}), 403

    try:
        titulo = request.form.get('titulo')
        sector = request.form.get('sector')
        descripcion = request.form.get('descripcion')
        imagen = request.files.get('imagen')

        if not titulo or not sector or not descripcion or not imagen:
            return jsonify({'status': 'error', 'message': 'Todos los campos son obligatorios.'}), 400

        if not es_imagen_permitida(imagen.filename):
            return jsonify({'status': 'error', 'message': 'Formato de imagen no soportado (PNG, JPG, JPEG, WEBP).'}), 400

        ext = imagen.filename.rsplit('.', 1)[1].lower()
        nombre_limpio = secure_filename(imagen.filename.rsplit('.', 1)[0])
        nombre_unico = f"{uuid.uuid4().hex[:10]}_{nombre_limpio}.{ext}"

        ruta_completa = os.path.join(app.config['UPLOAD_FOLDER'], nombre_unico)
        imagen.save(ruta_completa)

        nuevo_proyecto = ProyectoGaleria(
            titulo=titulo,
            sector=sector.lower(),
            descripcion=descripcion,
            imagen_filename=nombre_unico
        )

        db.session.add(nuevo_proyecto)
        db.session.commit()

        return jsonify({'status': 'success', 'message': '¡Proyecto publicado exitosamente!'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': f'Error al guardar proyecto: {str(e)}'}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)