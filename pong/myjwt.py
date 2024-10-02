import json
import base64
import hmac
import hashlib

def encode_header():
    header = {
        "alg": "HS256",
        "typ": "JWT"
    }
    # Convertir a JSON y luego a Base64 URL
    print("This is header: ", header)
    header_json = json.dumps(header)
    header_base64 = base64.urlsafe_b64encode(header_json.encode()).decode().rstrip("=")  # Eliminar relleno
    return header_base64

def encode_payload(user_id):
    payload = {
        "sub": user_id,
        "exp": 1625280000  # Unix timestamp (ejemplo: fecha de expiración)
    }
    # Convertir a JSON y luego a Base64 URL
    payload_json = json.dumps(payload)
    payload_base64 = base64.urlsafe_b64encode(payload_json.encode()).decode().rstrip("=")
    return payload_base64



def encode_signature(header_base64, payload_base64, secret):
    # Crear el mensaje a firmar
    message = f"{header_base64}.{payload_base64}".encode()
    # Generar la firma
    signature = hmac.new(secret.encode(), message, hashlib.sha256).digest()
    # Convertir la firma a Base64 URL
    signature_base64 = base64.urlsafe_b64encode(signature).decode().rstrip("=")
    return signature_base64

def create_jwt(user_id, secret):
    header = encode_header()
    payload = encode_payload(user_id)
    signature = encode_signature(header, payload, secret)
    
    jwt_token = f"{header}.{payload}.{signature}"
    return jwt_token

def decode_jwt(token, secret):
    header_base64, payload_base64, signature_base64 = token.split(".")
    
    # Verificar la firma
    message = f"{header_base64}.{payload_base64}".encode()
    expected_signature = hmac.new(secret.encode(), message, hashlib.sha256).digest()
    expected_signature_base64 = base64.urlsafe_b64encode(expected_signature).decode().rstrip("=")

    if expected_signature_base64 != signature_base64:
        raise ValueError("Firma inválida")

    # Decodificar el payload
    payload_json = base64.urlsafe_b64decode(payload_base64 + "==").decode()  # Añadir relleno
    payload = json.loads(payload_json)

    return payload




if __name__ == "__main__":
	secret = "mi_clave_secreta"
	jwt_token = create_jwt(user_id=123, secret=secret)
	print("JWT:", jwt_token)
    # Ejemplo de uso
	try:
		payload = decode_jwt(jwt_token, secret)
		print("Payload:", payload)
	except ValueError as e:
		print("Error:", e)
