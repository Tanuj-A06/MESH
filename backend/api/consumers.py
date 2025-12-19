"""
WebSocket consumers for real-time chat functionality.
"""
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import User
from django.conf import settings
from .models import Match, ChatMessage, UserProfile


class ChatConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for handling real-time chat between matched users.
    
    URL pattern: ws/chat/<match_id>/
    
    In DEBUG mode, authentication is bypassed for testing.
    In production, authentication is required.
    """
    
    async def connect(self):
        """Handle WebSocket connection"""
        self.match_id = self.scope['url_route']['kwargs']['match_id']
        self.room_group_name = f'chat_{self.match_id}'
        self.user = self.scope["user"]
        
        # In DEBUG mode, allow testing without authentication
        if settings.DEBUG:
            # Check if match exists
            match_exists = await self.check_match_exists()
            if not match_exists:
                await self.close()
                return
        else:
            # Production: require authentication
            if not self.user.is_authenticated:
                await self.close()
                return
            
            # Verify that the user is part of this match
            is_valid = await self.verify_match_participant()
            if not is_valid:
                await self.close()
                return
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Send connection confirmation
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': 'Connected to chat'
        }))
    
    async def disconnect(self, close_code):
        """Handle WebSocket disconnection"""
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        """
        Receive message from WebSocket
        Expected format: {'message': 'text content'}
        """
        try:
            data = json.loads(text_data)
            message_text = data.get('message', '').strip()
            
            if not message_text:
                await self.send(text_data=json.dumps({
                    'type': 'error',
                    'message': 'Message cannot be empty'
                }))
                return
            
            # Save message to database
            saved_message = await self.save_message(message_text)
            
            if not saved_message:
                await self.send(text_data=json.dumps({
                    'type': 'error',
                    'message': 'Failed to save message'
                }))
                return
            
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': saved_message['message'],
                    'sender_id': saved_message['sender_id'],
                    'sender_profile_id': saved_message.get('sender_profile_id'),
                    'sender_name': saved_message['sender_name'],
                    'created_at': saved_message['created_at'],
                    'message_id': saved_message['message_id']
                }
            )
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid JSON format'
            }))
        except Exception as e:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': f'An error occurred: {str(e)}'
            }))
    
    async def chat_message(self, event):
        """
        Receive message from room group and send to WebSocket
        """
        await self.send(text_data=json.dumps({
            'type': 'message',
            'message': event['message'],
            'sender_id': event['sender_id'],
            'sender_profile_id': event.get('sender_profile_id'),
            'sender_name': event['sender_name'],
            'created_at': event['created_at'],
            'message_id': event['message_id']
        }))
    
    @database_sync_to_async
    def check_match_exists(self):
        """
        Check if the match exists (for DEBUG mode testing)
        """
        try:
            Match.objects.get(id=self.match_id)
            return True
        except Match.DoesNotExist:
            return False
    
    @database_sync_to_async
    def verify_match_participant(self):
        """
        Verify that the current user is a participant in the match
        """
        try:
            user_profile = UserProfile.objects.get(user=self.user)
            match = Match.objects.get(id=self.match_id)
            
            # Check if user is either user1 or user2 in the match
            if match.user1 == user_profile or match.user2 == user_profile:
                return True
            return False
        except (Match.DoesNotExist, UserProfile.DoesNotExist):
            return False
    
    @database_sync_to_async
    def save_message(self, message_text):
        """
        Save the chat message to the database
        In DEBUG mode without authentication, creates test messages without saving
        """
        try:
            # In DEBUG mode without auth, return mock data
            if settings.DEBUG and not self.user.is_authenticated:
                from datetime import datetime
                return {
                    'message_id': 0,
                    'message': message_text,
                    'sender_id': 0,
                    'sender_name': 'Test User',
                    'created_at': datetime.now().isoformat()
                }
            
            # Normal authenticated flow
            user_profile = UserProfile.objects.get(user=self.user)
            match = Match.objects.get(id=self.match_id)
            
            # Create the message
            chat_message = ChatMessage.objects.create(
                match=match,
                sender=user_profile,
                message=message_text
            )
            
            return {
                'message_id': chat_message.id,
                'message': chat_message.message,
                'sender_id': user_profile.user.id,  # Use user.id for frontend matching
                'sender_profile_id': user_profile.id,
                'sender_name': f"{user_profile.user.first_name} {user_profile.user.last_name}",
                'created_at': chat_message.created_at.isoformat()
            }
        except Exception as e:
            print(f"Error saving message: {e}")
            return None
