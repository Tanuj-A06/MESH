from django.contrib import admin
from .models import UserProfile, Like, Match, ChatMessage, MatchSuggestion, Skill


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'category', 'created_at']
    list_filter = ['category', 'created_at']
    search_fields = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'age', 'developer_type', 'teammate_preference', 'created_at', 'is_verified']
    list_filter = ['developer_type', 'teammate_preference', 'availability', 'is_verified']
    search_fields = ['user__first_name', 'user__last_name', 'user__email']
    readonly_fields = ['created_at', 'updated_at']
    filter_horizontal = ['skills', 'looking_for']


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ['liker', 'liked', 'created_at']
    list_filter = ['created_at']
    search_fields = ['liker__user__first_name', 'liked__user__first_name']
    readonly_fields = ['created_at']


@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ['user1', 'user2', 'compatibility_score', 'created_at']
    list_filter = ['created_at', 'compatibility_score']
    search_fields = ['user1__user__first_name', 'user2__user__first_name']
    readonly_fields = ['created_at']


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ['match', 'sender', 'created_at', 'is_read']
    list_filter = ['created_at', 'is_read']
    search_fields = ['message', 'sender__user__first_name']
    readonly_fields = ['created_at']


@admin.register(MatchSuggestion)
class MatchSuggestionAdmin(admin.ModelAdmin):
    list_display = ['user', 'last_updated']
    readonly_fields = ['last_updated']
