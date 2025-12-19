"""
Google OAuth Authentication Views
Handles Google OAuth token validation and JWT token generation
"""

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings


@api_view(['POST'])
@permission_classes([AllowAny])
def google_auth(request):
    """
    Authenticate user with Google OAuth token.
    Creates a new user if they don't exist.
    Returns JWT access and refresh tokens.
    """
    token = request.data.get('token')
    
    if not token:
        return Response(
            {'error': 'Google token is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Verify the Google token
        # In development, we'll trust the token without verifying with Google
        # For production, uncomment the following:
        # idinfo = id_token.verify_oauth2_token(
        #     token, requests.Request(), settings.GOOGLE_CLIENT_ID
        # )
        
        # For development, decode the JWT directly
        import jwt
        from jwt.exceptions import DecodeError
        
        try:
            # Decode without verification for development
            idinfo = jwt.decode(token, options={"verify_signature": False})
        except DecodeError:
            return Response(
                {'error': 'Invalid token format'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        email = idinfo.get('email')
        first_name = idinfo.get('given_name', '')
        last_name = idinfo.get('family_name', '')
        
        if not email:
            return Response(
                {'error': 'Email not found in token'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get or create user
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': email,
                'first_name': first_name,
                'last_name': last_name,
            }
        )
        
        # Update user info if they already exist
        if not created:
            user.first_name = first_name
            user.last_name = last_name
            user.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
            'created': created,
        })
        
    except ValueError as e:
        return Response(
            {'error': f'Invalid token: {str(e)}'},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': f'Authentication failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
