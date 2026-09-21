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
MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD') or 'xeukdysfqcuzgtov'
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
        msg = MIMEMultipart('alternative')
        msg['From'] = MAIL_USERNAME
        msg['To'] = MAIL_DESTINATARIO
        msg['Subject'] = f"📥 Nueva Solicitud de Cotización: {nombre}"

        # 1. Versión en texto plano (como respaldo)
        cuerpo_texto = f"""
        ¡Hola! Has recibido una nueva solicitud desde la web de CATAMP S.A.S.

        Cliente: {nombre}
        Teléfono: {telefono}
        Correo: {correo_cliente if correo_cliente else 'No especificado'}
        
        Mensaje:
        {mensaje}
        """

        # 2. Versión HTML visualmente pulida con estilos de la marca CATAMP
        cuerpo_html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body {{
                    font-family: 'Segoe UI', Arial, sans-serif;
                    background-color: #f4f6f9;
                    margin: 0;
                    padding: 20px;
                    color: #333333;
                }}
                .email-container {{
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                    border: 1px solid #e2e8f0;
                }}
                .email-header {{
                    background-color: #06162f; /* Azul oscuro CATAMP */
                    padding: 25px 30px;
                    text-align: center;
                    border-bottom: 4px solid #fbbf24; /* Amarillo CATAMP */
                }}
                .email-header h1 {{
                    color: #ffffff;
                    margin: 0;
                    font-size: 20px;
                    letter-spacing: 0.5px;
                }}
                .email-body {{
                    padding: 30px;
                }}
                .greeting {{
                    font-size: 16px;
                    color: #06162f;
                    font-weight: 600;
                    margin-bottom: 20px;
                }}
                .data-card {{
                    background-color: #f8fafc;
                    border-left: 4px solid #00b5e2; /* Celeste/Azul secundario */
                    border-radius: 4px;
                    padding: 15px 20px;
                    margin-bottom: 25px;
                }}
                .data-row {{
                    margin-bottom: 10px;
                    font-size: 14px;
                }}
                .data-row:last-child {{
                    margin-bottom: 0;
                }}
                .data-label {{
                    font-weight: bold;
                    color: #475569;
                    width: 90px;
                    display: inline-block;
                }}
                .data-value {{
                    color: #0f172a;
                }}
                .message-box {{
                    background-color: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 6px;
                    padding: 18px;
                    font-size: 14px;
                    line-height: 1.6;
                    color: #334155;
                }}
                .email-footer {{
                    background-color: #f1f5f9;
                    padding: 15px;
                    text-align: center;
                    font-size: 12px;
                    color: #64748b;
                    border-top: 1px solid #e2e8f0;
                }}
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">
                    <h1>CATAMP S.A.S.</h1>
                </div>
                <div class="email-body">
                    <div class="greeting">¡Tienes una nueva solicitud de contacto desde la página web!</div>
                    
                    <div class="data-card">
                        <div class="data-row">
                            <span class="data-label">Cliente:</span>
                            <span class="data-value"><strong>{nombre}</strong></span>
                        </div>
                        <div class="data-row">
                            <span class="data-label">Teléfono:</span>
                            <span class="data-value">{telefono}</span>
                        </div>
                        <div class="data-row">
                            <span class="data-label">Correo:</span>
                            <span class="data-value">{correo_cliente if correo_cliente else 'No proporcionado'}</span>
                        </div>
                    </div>

                    <div style="font-weight: bold; font-size: 14px; color: #06162f; margin-bottom: 8px;">Detalles del proyecto / Mensaje:</div>
                    <div class="message-box">
                        {mensaje}
                    </div>
                </div>
                <div class="email-footer">
                    Este es un correo automático generado desde el formulario de contacto web de <strong>CATAMP S.A.S.</strong>
                </div>
            </div>
        </body>
        </html>
        """

        msg.attach(MIMEText(cuerpo_texto, 'plain'))
        msg.attach(MIMEText(cuerpo_html, 'html'))

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