from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Q

from .models import UserProfile, Like, Match, ChatMessage, MatchSuggestion, Skill
from .serializers import (
    UserProfileSerializer, UserProfileListSerializer, UserProfileDetailSerializer,
    LikeSerializer, MatchSerializer, ChatMessageSerializer, MatchSuggestionSerializer,
    SkillSerializer
)
from .matching_algorithm import calculate_compatibility_score, get_top_suggestions, find_or_create_match


class UserProfileViewSet(viewsets.ModelViewSet):
    """
    API endpoints for user profiles.
    """
    queryset = UserProfile.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return UserProfileDetailSerializer
        elif self.action == 'list':
            return UserProfileListSerializer
        return UserProfileSerializer
    
    def get_queryset(self):
        # Users can see all profiles except their own
        return UserProfile.objects.exclude(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user's profile"""
        try:
            profile = UserProfile.objects.get(user=request.user)
            serializer = UserProfileDetailSerializer(profile)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            return Response(
                {'error': 'Profile not created yet'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['post'])
    def create_profile(self, request):
        """Create or update current user's profile"""
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def suggestions(self, request):
        """Get top 10 suggestions for current user"""
        try:
            profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            return Response(
                {'error': 'Profile not created yet'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        suggestions = get_top_suggestions(profile, limit=10)
        
        result = []
        for suggested_user, score in suggestions:
            user_data = UserProfileListSerializer(suggested_user).data
            user_data['compatibility_score'] = round(score, 2)
            result.append(user_data)
        
        return Response(result)
    
    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        """Like another user's profile"""
        try:
            current_profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            return Response(
                {'error': 'Your profile not created yet'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        liked_profile = self.get_object()
        
        if liked_profile.user == request.user:
            return Response(
                {'error': 'Cannot like your own profile'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        like, created = Like.objects.get_or_create(
            liker=current_profile,
            liked=liked_profile
        )
        
        # Check if this creates a match
        match, is_new_match = find_or_create_match(current_profile, liked_profile)
        
        response_data = {
            'liked': True,
            'is_new_match': is_new_match
        }
        
        if match:
            response_data['match'] = MatchSerializer(match).data
        
        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(response_data, status=status_code)
    
    @action(detail=True, methods=['post'])
    def unlike(self, request, pk=None):
        """Unlike a user's profile"""
        try:
            current_profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            return Response(
                {'error': 'Your profile not created yet'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        liked_profile = self.get_object()
        
        like = Like.objects.filter(liker=current_profile, liked=liked_profile)
        if like.exists():
            like.delete()
            return Response({'unliked': True})
        
        return Response({'error': 'Like not found'}, status=status.HTTP_404_NOT_FOUND)


class LikeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoints for viewing likes.
    """
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        # Return likes given by or received by current user
        return Like.objects.filter(
            Q(liker__user=user) | Q(liked__user=user)
        ).select_related('liker__user', 'liked__user')
    
    @action(detail=False, methods=['get'])
    def likes_received(self, request):
        """Get likes received by current user"""
        try:
            profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            return Response([], status=status.HTTP_200_OK)
        
        likes = Like.objects.filter(liked=profile).select_related('liker__user')
        serializer = LikeSerializer(likes, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def likes_given(self, request):
        """Get likes given by current user"""
        try:
            profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            return Response([], status=status.HTTP_200_OK)
        
        likes = Like.objects.filter(liker=profile).select_related('liked__user')
        serializer = LikeSerializer(likes, many=True)
        return Response(serializer.data)


class MatchViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoints for matches.
    """
    serializer_class = MatchSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        try:
            profile = UserProfile.objects.get(user=user)
        except UserProfile.DoesNotExist:
            return Match.objects.none()
        
        # Return matches involving current user
        return Match.objects.filter(
            Q(user1=profile) | Q(user2=profile)
        ).select_related('user1__user', 'user2__user').order_by('-compatibility_score')
    
    @action(detail=True, methods=['get'])
    def other_user(self, request, pk=None):
        """Get the other user in a match"""
        match = self.get_object()
        try:
            current_profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            return Response(
                {'error': 'Profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if match.user1 == current_profile:
            other_user = match.user2
        elif match.user2 == current_profile:
            other_user = match.user1
        else:
            return Response(
                {'error': 'Access denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = UserProfileDetailSerializer(other_user)
        return Response(serializer.data)


class ChatMessageViewSet(viewsets.ModelViewSet):
    """
    API endpoints for chat messages in a match.
    """
    serializer_class = ChatMessageSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        try:
            profile = UserProfile.objects.get(user=user)
        except UserProfile.DoesNotExist:
            return ChatMessage.objects.none()
        
        # Return messages from matches involving current user
        matches = Match.objects.filter(
            Q(user1=profile) | Q(user2=profile)
        )
        return ChatMessage.objects.filter(
            match__in=matches
        ).select_related('match', 'sender__user').order_by('-created_at')
    
    def create(self, request, *args, **kwargs):
        """Create a new chat message"""
        try:
            sender_profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            return Response(
                {'error': 'Profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        match_id = request.data.get('match')
        if not match_id:
            return Response(
                {'error': 'match ID required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            match = Match.objects.get(id=match_id)
        except Match.DoesNotExist:
            return Response(
                {'error': 'Match not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Verify user is part of this match
        if not (match.user1 == sender_profile or match.user2 == sender_profile):
            return Response(
                {'error': 'Access denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        message = ChatMessage.objects.create(
            match=match,
            sender=sender_profile,
            message=request.data.get('message', '')
        )
        
        serializer = self.get_serializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def by_match(self, request):
        """Get messages for a specific match"""
        match_id = request.query_params.get('match_id')
        if not match_id:
            return Response(
                {'error': 'match_id parameter required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user_profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            return Response(
                {'error': 'Profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        try:
            match = Match.objects.get(id=match_id)
        except Match.DoesNotExist:
            return Response(
                {'error': 'Match not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Verify user is part of this match
        if not (match.user1 == user_profile or match.user2 == user_profile):
            return Response(
                {'error': 'Access denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        messages = ChatMessage.objects.filter(match=match).order_by('created_at')
        serializer = self.get_serializer(messages, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Mark a message as read"""
        message = self.get_object()
        message.is_read = True
        message.save()
        
        serializer = self.get_serializer(message)
        return Response(serializer.data)

class SkillViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoints for predefined skills.
    Users can view available skills to select from.
    """
    queryset = Skill.objects.all().order_by('category', 'name')
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Get skills grouped by category"""
        category = request.query_params.get('category')
        if category:
            skills = Skill.objects.filter(category=category).order_by('name')
        else:
            skills = Skill.objects.all().order_by('category', 'name')
        
        serializer = self.get_serializer(skills, many=True)
        return Response(serializer.data)