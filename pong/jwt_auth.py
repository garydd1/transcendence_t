from rest_framework_simplejwt.tokens import AccessToken
from django.http import JsonResponse

def jwt42_required(view_func):
    def wrapper(request, *args, **kwargs):
        auth_header = request.headers.get('Authorization')

        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]  # Obtener el token JWT

            try:
                # Validar el token JWT
                access_token = AccessToken(token)
                # Si el token es válido, ejecuta la vista
                return view_func(request, *args, **kwargs)

            except Exception as e:
                return JsonResponse({'error': 'Token inválido o expirado'}, status=401)

        return JsonResponse({'error': 'No se proporcionó un token'}, status=401)

    return wrapper
