from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import UserProfile, Skill
import random

class Command(BaseCommand):
    help = 'Populate database with sample developer profiles'

    def handle(self, *args, **options):
        # Make sure skills exist first
        if Skill.objects.count() == 0:
            self.stdout.write(self.style.WARNING('No skills found. Run populate_skills first.'))
            return

        # Sample data
        developer_profiles = [
            {
                'username': 'alice_frontend',
                'first_name': 'Alice',
                'last_name': 'Chen',
                'email': 'alice@example.com',
                'age': 26,
                'bio': 'React and Vue enthusiast, building modern web apps',
                'developer_type': 'frontend',
                'teammate_preference': 'backend',
                'skills_names': ['React', 'Vue.js', 'TypeScript', 'Tailwind CSS'],
                'looking_for_names': ['Node.js', 'Python', 'Django'],
                'years_of_experience': 4,
                'availability': 'full-time',
            },
            {
                'username': 'bob_backend',
                'first_name': 'Bob',
                'last_name': 'Kumar',
                'email': 'bob@example.com',
                'age': 29,
                'bio': 'Python & Node.js backend developer, love building APIs',
                'developer_type': 'backend',
                'teammate_preference': 'frontend',
                'skills_names': ['Python', 'Django', 'FastAPI', 'PostgreSQL', 'Redis'],
                'looking_for_names': ['React', 'TypeScript', 'Tailwind CSS'],
                'years_of_experience': 6,
                'availability': 'full-time',
            },
            {
                'username': 'carol_fullstack',
                'first_name': 'Carol',
                'last_name': 'Martinez',
                'email': 'carol@example.com',
                'age': 27,
                'bio': 'Full-stack developer interested in startup projects',
                'developer_type': 'fullstack',
                'teammate_preference': 'any',
                'skills_names': ['React', 'Node.js', 'MongoDB', 'Docker', 'AWS'],
                'looking_for_names': ['Kubernetes', 'DevOps'],
                'years_of_experience': 5,
                'availability': 'part-time',
            },
            {
                'username': 'david_mobile',
                'first_name': 'David',
                'last_name': 'O\'Brien',
                'email': 'david@example.com',
                'age': 28,
                'bio': 'Mobile developer, React Native expert',
                'developer_type': 'mobile',
                'teammate_preference': 'fullstack',
                'skills_names': ['React Native', 'TypeScript', 'Swift'],
                'looking_for_names': ['Node.js', 'Python', 'Firebase'],
                'years_of_experience': 5,
                'availability': 'flexible',
            },
            {
                'username': 'emma_devops',
                'first_name': 'Emma',
                'last_name': 'Johnson',
                'email': 'emma@example.com',
                'age': 31,
                'bio': 'DevOps & Infrastructure specialist',
                'developer_type': 'devops',
                'teammate_preference': 'backend',
                'skills_names': ['Kubernetes', 'Docker', 'AWS', 'Python'],
                'looking_for_names': ['Node.js', 'Django', 'PostgreSQL'],
                'years_of_experience': 7,
                'availability': 'full-time',
            },
            {
                'username': 'frank_data',
                'first_name': 'Frank',
                'last_name': 'Zhang',
                'email': 'frank@example.com',
                'age': 25,
                'bio': 'Data scientist and ML enthusiast',
                'developer_type': 'data',
                'teammate_preference': 'backend',
                'skills_names': ['Python', 'PostgreSQL', 'Git'],
                'looking_for_names': ['Node.js', 'FastAPI', 'Docker'],
                'years_of_experience': 2,
                'availability': 'flexible',
            },
            {
                'username': 'grace_ml',
                'first_name': 'Grace',
                'last_name': 'Lee',
                'email': 'grace@example.com',
                'age': 26,
                'bio': 'ML Engineer, computer vision specialist',
                'developer_type': 'ml',
                'teammate_preference': 'backend',
                'skills_names': ['Python', 'Django', 'Docker'],
                'looking_for_names': ['AWS', 'Kubernetes', 'FastAPI'],
                'years_of_experience': 3,
                'availability': 'full-time',
            },
            {
                'username': 'henry_fullstack',
                'first_name': 'Henry',
                'last_name': 'Brown',
                'email': 'henry@example.com',
                'age': 30,
                'bio': 'Full-stack developer with 8 years experience',
                'developer_type': 'fullstack',
                'teammate_preference': 'frontend',
                'skills_names': ['React', 'Python', 'PostgreSQL', 'Docker', 'TypeScript'],
                'looking_for_names': ['Vue.js', 'Angular', 'Tailwind CSS'],
                'years_of_experience': 8,
                'availability': 'part-time',
            },
        ]

        created_count = 0
        for profile_data in developer_profiles:
            username = profile_data.pop('username')
            first_name = profile_data.pop('first_name')
            last_name = profile_data.pop('last_name')
            email = profile_data.pop('email')
            skills_names = profile_data.pop('skills_names')
            looking_for_names = profile_data.pop('looking_for_names')
            
            # Create user if doesn't exist
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    'first_name': first_name,
                    'last_name': last_name,
                    'email': email,
                }
            )
            
            # Create profile if doesn't exist
            user_profile, profile_created = UserProfile.objects.get_or_create(
                user=user,
                defaults=profile_data
            )
            
            if profile_created:
                # Add skills using the skill names
                for skill_name in skills_names:
                    try:
                        skill = Skill.objects.get(name=skill_name)
                        user_profile.skills.add(skill)
                    except Skill.DoesNotExist:
                        pass
                
                # Add looking_for skills
                for skill_name in looking_for_names:
                    try:
                        skill = Skill.objects.get(name=skill_name)
                        user_profile.looking_for.add(skill)
                    except Skill.DoesNotExist:
                        pass
                
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'✓ Created profile for {first_name} {last_name}')
                )

        self.stdout.write(
            self.style.SUCCESS(f'\n✓ Successfully created {created_count} developer profiles')
        )
