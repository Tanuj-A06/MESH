from django.db import models
from django.contrib.auth.models import User
from django.core.validators import URLValidator
from django.utils import timezone

# Developer types
DEVELOPER_TYPES = [
    ('frontend', 'Frontend Developer'),
    ('backend', 'Backend Developer'),
    ('fullstack', 'Full Stack Developer'),
    ('devops', 'DevOps Engineer'),
    ('mobile', 'Mobile Developer'),
    ('data', 'Data Scientist'),
    ('ml', 'ML Engineer'),
    ('other', 'Other'),
]

# Teammate preferences
TEAMMATE_PREFERENCES = [
    ('frontend', 'Frontend Developer'),
    ('backend', 'Backend Developer'),
    ('fullstack', 'Full Stack Developer'),
    ('devops', 'DevOps Engineer'),
    ('mobile', 'Mobile Developer'),
    ('data', 'Data Scientist'),
    ('ml', 'ML Engineer'),
    ('other', 'Other'),
    ('any', 'Any Developer'),
]

# Predefined Skills/Tags (8-10 options)
SKILL_CHOICES = [
    ('react', 'React'),
    ('vue', 'Vue.js'),
    ('angular', 'Angular'),
    ('nodejs', 'Node.js'),
    ('python', 'Python'),
    ('django', 'Django'),
    ('fastapi', 'FastAPI'),
    ('postgresql', 'PostgreSQL'),
    ('mongodb', 'MongoDB'),
    ('docker', 'Docker'),
]


class Skill(models.Model):
    """Predefined skills/technologies that users can select"""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    icon = models.CharField(max_length=50, blank=True, help_text="Icon class or emoji")
    category = models.CharField(
        max_length=50,
        choices=[
            ('frontend', 'Frontend'),
            ('backend', 'Backend'),
            ('devops', 'DevOps'),
            ('mobile', 'Mobile'),
            ('database', 'Database'),
            ('other', 'Other'),
        ],
        default='other'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name


class UserProfile(models.Model):
    """Extended user profile with developer-specific information"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Basic info
    age = models.IntegerField(null=True, blank=True)
    bio = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to='profiles/', null=True, blank=True)
    
    # Social links
    github_url = models.URLField(validators=[URLValidator()], blank=True)
    x_url = models.URLField(validators=[URLValidator()], blank=True)
    portfolio_url = models.URLField(validators=[URLValidator()], blank=True)
    
    # Developer info
    developer_type = models.CharField(
        max_length=20,
        choices=DEVELOPER_TYPES,
        default='fullstack'
    )
    teammate_preference = models.CharField(
        max_length=20,
        choices=TEAMMATE_PREFERENCES,
        default='any'
    )
    
    # Skills - ManyToMany for multiple selections
    skills = models.ManyToManyField(
        Skill,
        related_name='users_with_skill',
        blank=True,
        help_text="Skills and technologies you know"
    )
    looking_for = models.ManyToManyField(
        Skill,
        related_name='users_looking_for_skill',
        blank=True,
        help_text="Skills you're looking for in a teammate"
    )
    
    # Experience
    years_of_experience = models.IntegerField(default=0)
    
    # Preferences
    preferred_project_type = models.TextField(
        blank=True,
        help_text="e.g., SaaS, Mobile App, Web App, etc."
    )
    availability = models.CharField(
        max_length=50,
        choices=[
            ('part-time', 'Part-time'),
            ('full-time', 'Full-time'),
            ('weekends', 'Weekends only'),
            ('flexible', 'Flexible'),
        ],
        default='flexible'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_verified = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} - {self.developer_type}"
    
    def get_skills_list(self):
        """Get list of skill names"""
        return list(self.skills.values_list('name', flat=True))
    
    def get_looking_for_list(self):
        """Get list of skills looking for"""
        return list(self.looking_for.values_list('name', flat=True))


class Like(models.Model):
    """Represents when one user likes another user's profile"""
    liker = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name='likes_given'
    )
    liked = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name='likes_received'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('liker', 'liked')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.liker.user.first_name} likes {self.liked.user.first_name}"


class Match(models.Model):
    """Represents a mutual match between two users"""
    user1 = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name='matches_as_user1'
    )
    user2 = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name='matches_as_user2'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    compatibility_score = models.FloatField(default=0.0)
    
    class Meta:
        unique_together = ('user1', 'user2')
        ordering = ['-compatibility_score', '-created_at']
    
    def __str__(self):
        return f"{self.user1.user.first_name} <-> {self.user2.user.first_name}"


class ChatMessage(models.Model):
    """Represents a message in a chat between two matched users"""
    match = models.ForeignKey(
        Match,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    sender = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name='sent_messages'
    )
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Message from {self.sender.user.first_name} - {self.created_at}"


class MatchSuggestion(models.Model):
    """Stores the top 10 suggestions for a user based on compatibility"""
    user = models.OneToOneField(
        UserProfile,
        on_delete=models.CASCADE,
        related_name='suggestions'
    )
    suggested_users = models.ManyToManyField(
        UserProfile,
        related_name='suggested_to'
    )
    last_updated = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Suggestions for {self.user.user.first_name}"
