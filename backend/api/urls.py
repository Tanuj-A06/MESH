from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserProfileViewSet, LikeViewSet, MatchViewSet, ChatMessageViewSet, SkillViewSet

# Create router
router = DefaultRouter()
router.register(r'profiles', UserProfileViewSet, basename='profile')
router.register(r'likes', LikeViewSet, basename='like')
router.register(r'matches', MatchViewSet, basename='match')
router.register(r'messages', ChatMessageViewSet, basename='message')
router.register(r'skills', SkillViewSet, basename='skill')

app_name = 'api'

urlpatterns = [
    path('', include(router.urls)),
]
