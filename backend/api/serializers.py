from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Like, Match, ChatMessage, MatchSuggestion, Skill


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'slug', 'icon', 'category']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']
        read_only_fields = ['id']


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    skills = SkillSerializer(many=True, read_only=True)
    skills_ids = serializers.PrimaryKeyRelatedField(
        queryset=Skill.objects.all(),
        write_only=True,
        many=True,
        source='skills'
    )
    looking_for = SkillSerializer(many=True, read_only=True)
    looking_for_ids = serializers.PrimaryKeyRelatedField(
        queryset=Skill.objects.all(),
        write_only=True,
        many=True,
        source='looking_for'
    )
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'user', 'age', 'bio', 'profile_image',
            'github_url', 'x_url', 'portfolio_url',
            'developer_type', 'teammate_preference',
            'skills', 'skills_ids', 'looking_for', 'looking_for_ids',
            'years_of_experience', 'preferred_project_type',
            'availability', 'created_at', 'updated_at', 'is_verified'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class UserProfileDetailSerializer(UserProfileSerializer):
    """Detailed profile view for the current user"""
    pass


class UserProfileListSerializer(serializers.ModelSerializer):
    """Simplified profile for listing/discovery"""
    user = serializers.SerializerMethodField()
    skills = SkillSerializer(many=True, read_only=True)
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'user', 'age', 'bio', 'profile_image',
            'developer_type', 'teammate_preference',
            'skills', 'years_of_experience',
            'availability',
            'github_url', 'x_url', 'portfolio_url',
        ]
    
    def get_user(self, obj):
        return {
            'id': obj.user.id,
            'first_name': obj.user.first_name,
            'last_name': obj.user.last_name
        }


class LikeSerializer(serializers.ModelSerializer):
    liker_profile = UserProfileListSerializer(source='liker', read_only=True)
    liked_profile = UserProfileListSerializer(source='liked', read_only=True)
    
    class Meta:
        model = Like
        fields = ['id', 'liker', 'liked', 'liker_profile', 'liked_profile', 'created_at']
        read_only_fields = ['id', 'created_at']


class MatchSerializer(serializers.ModelSerializer):
    user1_profile = UserProfileListSerializer(source='user1', read_only=True)
    user2_profile = UserProfileListSerializer(source='user2', read_only=True)
    
    class Meta:
        model = Match
        fields = [
            'id', 'user1', 'user2', 'user1_profile', 'user2_profile',
            'created_at', 'compatibility_score'
        ]
        read_only_fields = ['id', 'created_at']


class ChatMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.user.first_name', read_only=True)
    sender_id = serializers.IntegerField(source='sender.id', read_only=True)
    
    class Meta:
        model = ChatMessage
        fields = ['id', 'match', 'sender', 'sender_id', 'sender_name', 'message', 'created_at', 'is_read']
        read_only_fields = ['id', 'created_at', 'match']


class MatchSuggestionSerializer(serializers.ModelSerializer):
    user_profile = UserProfileListSerializer(source='user', read_only=True)
    suggested_users = UserProfileListSerializer(many=True, read_only=True)
    
    class Meta:
        model = MatchSuggestion
        fields = ['id', 'user', 'user_profile', 'suggested_users', 'last_updated']
        read_only_fields = ['id', 'last_updated']
