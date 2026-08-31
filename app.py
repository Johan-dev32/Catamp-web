import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

db = SQLAlchemy(app)

# CONFIGURACIÓN DEL CORREO (Puedes usar variables de entorno)
MAIL_SERVER = 'smtp.gmail.com'
MAIL_PORT = 587
MAIL_USERNAME = 'catampingenieriaobracivil@gmail.com'  
MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD') 
MAIL_DESTINATARIO = 'catampingenieriaobracivil@gmail.com' 

# Configuración de base de datos SQLite local
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'catamp.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


# Modelo de tabla para guardar los mensajes de clientes
class SolicitudContacto(db.Model):
    __tablename__ = 'solicitudes'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    correo = db.Column(db.String(120), nullable=True)
    telefono = db.Column(db.String(20), nullable=False)
    mensaje = db.Column(db.Text, nullable=False)
    fecha = db.Column(db.DateTime, server_default=db.func.now())

# Crear la base de datos automáticamente
with app.app_context():
    db.create_all()
    
# FUNCIÓN AUXILIAR PARA ENVIAR EL EMAIL
def enviar_notificacion_email(nombre, correo_cliente, telefono, mensaje):
    try:
        msg = MIMEMultipart()
        msg['From'] = MAIL_USERNAME
        msg['To'] = MAIL_DESTINATARIO
        msg['Subject'] = f"Nueva Solicitud de Cotización de: {nombre}"

        cuerpo = f"""
        ¡Hola! Has recibido un nuevo mensaje desde la página web de CATAMP S.A.S.

        Detalles del cliente:
        - Nombre: {nombre}
        - Teléfono: {telefono}
        - Correo: {correo_cliente if correo_cliente else 'No especificado'}
        
        Mensaje / Proyecto:
        {mensaje}
        """
        msg.attach(MIMEText(cuerpo, 'plain'))

        # Conexión al servidor SMTP de Gmail
        server = smtplib.SMTP(MAIL_SERVER, MAIL_PORT)
        server.starttls()
        server.login(MAIL_USERNAME, MAIL_PASSWORD)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Error al enviar correo: {e}")
        return False

# Ruta para cargar la página
@app.route('/')
def home():
    return render_template('index.html')

# Endpoint API para recibir el formulario
@app.route('/api/contacto', methods=['POST'])
def recibir_contacto():
    try:
        data = request.get_json()

        # Validación básica de campos
        if not data.get('nombre') or not data.get('telefono') or not data.get('mensaje'):
            return jsonify({'status': 'error', 'message': 'Por favor completa todos los campos requeridos.'}), 400

        # Guardar en base de datos
        nuevo_mensaje = SolicitudContacto(
            nombre=data.get('nombre'),
            correo=data.get('correo'),
            telefono=data.get('telefono'),
            mensaje=data.get('mensaje')
        )

        db.session.add(nuevo_mensaje)
        db.session.commit()
        
        # 2. Enviar correo de notificación (si está configurada la contraseña)
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

if __name__ == '__main__':
    app.run(debug=True, port=5000)