from django.core.management.base import BaseCommand
from django.utils.text import slugify
from api.models import Skill

class Command(BaseCommand):
    help = 'Populate database with predefined skills'

    def handle(self, *args, **options):
        skills_data = [
            # Frontend
            {'name': 'React', 'category': 'frontend', 'icon': '⚛️'},
            {'name': 'Vue.js', 'category': 'frontend', 'icon': '💚'},
            {'name': 'Angular', 'category': 'frontend', 'icon': '🅰️'},
            {'name': 'Tailwind CSS', 'category': 'frontend', 'icon': '🎨'},
            
            # Backend
            {'name': 'Node.js', 'category': 'backend', 'icon': '🟢'},
            {'name': 'Python', 'category': 'backend', 'icon': '🐍'},
            {'name': 'Django', 'category': 'backend', 'icon': '🎯'},
            {'name': 'FastAPI', 'category': 'backend', 'icon': '⚡'},
            
            # Database
            {'name': 'PostgreSQL', 'category': 'database', 'icon': '🐘'},
            {'name': 'MongoDB', 'category': 'database', 'icon': '🍃'},
            {'name': 'Redis', 'category': 'database', 'icon': '📍'},
            
            # DevOps
            {'name': 'Docker', 'category': 'devops', 'icon': '🐳'},
            {'name': 'Kubernetes', 'category': 'devops', 'icon': '☸️'},
            {'name': 'AWS', 'category': 'devops', 'icon': '☁️'},
            
            # Mobile
            {'name': 'React Native', 'category': 'mobile', 'icon': '📱'},
            {'name': 'Swift', 'category': 'mobile', 'icon': '🍎'},
            {'name': 'Kotlin', 'category': 'mobile', 'icon': '🤖'},
            
            # Other
            {'name': 'TypeScript', 'category': 'other', 'icon': '📘'},
            {'name': 'Git', 'category': 'other', 'icon': '🔧'},
            {'name': 'GraphQL', 'category': 'other', 'icon': '⚙️'},
        ]

        created_count = 0
        for skill_data in skills_data:
            skill, created = Skill.objects.get_or_create(
                name=skill_data['name'],
                defaults={
                    'slug': slugify(skill_data['name']),
                    'category': skill_data['category'],
                    'icon': skill_data.get('icon', '')
                }
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'✓ Created skill: {skill.name}')
                )

        self.stdout.write(
            self.style.SUCCESS(f'\n✓ Successfully created {created_count} skills')
        )
