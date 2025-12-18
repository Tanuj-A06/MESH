"""
Matching algorithm for finding compatible teammate pairs.
Uses skill overlap and preferences to calculate compatibility scores.
"""

from .models import UserProfile, Match


def calculate_compatibility_score(user1, user2):
    """
    Calculate compatibility score between two users (0-100).
    
    Factors:
    - Skill overlap (how many skills they share)
    - Complementary skills (skills one is looking for that the other has)
    - Developer type compatibility
    - Availability matching
    - Experience level proximity
    
    Returns: float between 0 and 100
    """
    score = 0
    weights = {
        'skill_overlap': 0.25,
        'complementary_skills': 0.35,
        'type_compatibility': 0.15,
        'availability': 0.15,
        'experience': 0.10
    }
    
    # Get skills as sets (using Skill objects)
    user1_skills = set(user1.skills.all())
    user2_skills = set(user2.skills.all())
    user1_looking = set(user1.looking_for.all())
    user2_looking = set(user2.looking_for.all())
    
    # 1. Skill Overlap - how many skills they have in common
    if user1_skills and user2_skills:
        overlap = len(user1_skills.intersection(user2_skills))
        max_skills = max(len(user1_skills), len(user2_skills))
        skill_overlap_score = (overlap / max_skills) * 100
        score += skill_overlap_score * weights['skill_overlap']
    
    # 2. Complementary Skills - skills one wants that the other has
    complementary_score = 0
    
    # User1 has skills that User2 is looking for
    user2_gets = len(user1_skills.intersection(user2_looking))
    if user2_looking:
        complementary_score += (user2_gets / len(user2_looking)) * 50
    
    # User2 has skills that User1 is looking for
    user1_gets = len(user2_skills.intersection(user1_looking))
    if user1_looking:
        complementary_score += (user1_gets / len(user1_looking)) * 50
    
    score += complementary_score * weights['complementary_skills']
    
    # 3. Developer Type Compatibility
    type_compatibility_score = 0
    
    # Check if user2's type matches user1's preference
    if user1.teammate_preference == 'any' or user1.teammate_preference == user2.developer_type:
        type_compatibility_score += 50
    
    # Check if user1's type matches user2's preference
    if user2.teammate_preference == 'any' or user2.teammate_preference == user1.developer_type:
        type_compatibility_score += 50
    
    score += type_compatibility_score * weights['type_compatibility']
    
    # 4. Availability Matching
    availability_score = 0
    if user1.availability == user2.availability or \
       user1.availability == 'flexible' or user2.availability == 'flexible':
        availability_score = 100
    else:
        # Partial match
        availability_score = 50
    
    score += availability_score * weights['availability']
    
    # 5. Experience Level Proximity
    experience_diff = abs(user1.years_of_experience - user2.years_of_experience)
    # More compatible if experience levels are closer (within 3 years)
    if experience_diff <= 3:
        experience_score = 100
    elif experience_diff <= 7:
        experience_score = 75
    else:
        experience_score = 50
    
    score += experience_score * weights['experience']
    
    return min(score, 100)  # Cap at 100


def get_top_suggestions(user_profile, limit=10):
    """
    Get top N suggestions for a user based on compatibility.
    
    Args:
        user_profile: UserProfile instance
        limit: Number of suggestions to return (default 10)
    
    Returns:
        List of (UserProfile, compatibility_score) tuples
    """
    # Get all other users except the current user
    all_users = UserProfile.objects.exclude(id=user_profile.id).exclude(
        user__username='admin'  # Exclude admin if exists
    )
    
    # Calculate scores for each user
    suggestions = []
    for other_user in all_users:
        # Skip if already matched
        if Match.objects.filter(
            user1__in=[user_profile, other_user],
            user2__in=[user_profile, other_user]
        ).exists():
            continue
        
        score = calculate_compatibility_score(user_profile, other_user)
        if score > 0:  # Only include if there's some compatibility
            suggestions.append((other_user, score))
    
    # Sort by score descending and return top N
    suggestions.sort(key=lambda x: x[1], reverse=True)
    return suggestions[:limit]


def find_or_create_match(user1, user2):
    """
    Check if a mutual like exists and create a Match if so.
    
    Args:
        user1: UserProfile instance
        user2: UserProfile instance
    
    Returns:
        (Match instance or None, is_new_match: bool)
    """
    from .models import Like
    
    # Check if both users like each other
    like_1_to_2 = Like.objects.filter(liker=user1, liked=user2).exists()
    like_2_to_1 = Like.objects.filter(liker=user2, liked=user1).exists()
    
    if not (like_1_to_2 and like_2_to_1):
        return None, False
    
    # Check if match already exists
    match = Match.objects.filter(
        user1__in=[user1, user2],
        user2__in=[user1, user2]
    ).first()
    
    if match:
        return match, False
    
    # Create new match
    # Ensure consistent ordering (lower id first)
    if user1.id < user2.id:
        match_user1, match_user2 = user1, user2
    else:
        match_user1, match_user2 = user2, user1
    
    score = calculate_compatibility_score(match_user1, match_user2)
    match = Match.objects.create(
        user1=match_user1,
        user2=match_user2,
        compatibility_score=score
    )
    
    return match, True
