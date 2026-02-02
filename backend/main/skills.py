"""Skill detection and matching module.

This module provides utilities for:
- Detecting skills mentioned in resume text
- Matching found skills against job requirements
- Calculating skill match percentage
- Determining overall fit category
"""


class SkillMatcher:
    """Handles skill detection and matching between resumes and job requirements."""
    
    # Predefined dictionary of 60+ skills
    SKILL_DATABASE = {
        # Programming Languages
        'python', 'java', 'javascript', 'csharp', 'c++', 'ruby', 'php', 'swift', 
        'kotlin', 'rust', 'go', 'typescript', 'scala', 'r',
        
        # Web Frameworks
        'django', 'flask', 'fastapi', 'spring', 'nodejs', 'express', 'react', 
        'angular', 'vue', 'nextjs', 'svelte',
        
        # Databases
        'sql', 'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch',
        'dynamodb', 'cassandra', 'firebasestore',
        
        # DevOps & Cloud
        'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'git', 'ci/cd', 
        'jenkins', 'gitlab', 'github', 'devops', 'terraform',
        
        # Frontend & Styling
        'html', 'css', 'bootstrap', 'tailwind', 'sass', 'webpack', 'babel',
        'jest', 'cypress',
        
        # ML & Data Science
        'machine learning', 'tensorflow', 'pytorch', 'scikit-learn', 'nlp', 
        'computer vision', 'pandas', 'numpy', 'jupyter',
        
        # Tools & Methodologies
        'agile', 'scrum', 'jira', 'confluence', 'asana', 'trello',
        'git', 'linux', 'windows', 'macos', 'rest api', 'graphql',
        
        # Testing & Quality
        'testing', 'pytest', 'junit', 'selenium', 'postman', 'insomnia',
        'microservices', 'oop', 'design patterns',
        
        # Soft Skills
        'communication', 'leadership', 'problem solving', 'teamwork', 
        'project management', 'mentoring', 'collaboration'
    }
    
    # Overall fit thresholds (percentage of required skills matched)
    FIT_THRESHOLDS = {
        'excellent': 80,
        'good': 60,
        'fair': 40,
    }
    
    @staticmethod
    def extract_skills(text):
        """Extract mentioned skills from resume text.
        
        The function searches for predefined skills in the resume text 
        (case-insensitive).
        
        Args:
            text (str): Resume text
            
        Returns:
            list: Sorted list of unique detected skills
            
        Notes:
            - Simple substring matching (not regex)
            - Case-insensitive matching
            - More sophisticated methods (NLP, entity recognition) can 
              improve accuracy in future versions
        """
        text_lower = text.lower()
        found_skills = []
        for skill in SkillMatcher.SKILL_DATABASE:
            if skill in text_lower:
                found_skills.append(skill)
        return sorted(list(set(found_skills)))

    @staticmethod
    def evaluate(required_skills_str, resume_text):
        """Evaluate resume skills against required skills for a job.
        
        This function:
        1. Parses the comma-separated required skills
        2. Extracts skills from resume text
        3. Matches found skills against required skills
        4. Calculates fit percentage
        5. Determines overall fit category
        
        Args:
            required_skills_str (str): Comma-separated required skills
                                       (e.g., 'Python, Django, REST API')
            resume_text (str): Extracted resume text
            
        Returns:
            dict: Evaluation results containing:
                - relevant_skills (list): Skills matching requirements
                - missing_skills (list): Required skills not found
                - overall_fit (str): 'excellent', 'good', 'fair', or 'poor'
                - fit_percentage (float): Percentage of skills matched
                
        Overall Fit Determination:
            - Excellent (80%+): Most required skills present
            - Good (60-79%): Good coverage of required skills
            - Fair (40-59%): Some skills present, some missing
            - Poor (<40%): Limited skill match
        """
        if not required_skills_str or not resume_text:
            return {
                'relevant_skills': [],
                'missing_skills': [],
                'overall_fit': 'poor',
                'fit_percentage': 0.0
            }
        
        # Parse comma-separated required skills
        required = [s.strip().lower() for s in required_skills_str.split(',') if s.strip()]
        if not required:
            return {
                'relevant_skills': [],
                'missing_skills': [],
                'overall_fit': 'poor',
                'fit_percentage': 0.0
            }
        
        # Extract skills found in resume
        found_skills = SkillMatcher.extract_skills(resume_text)
        
        # Match found skills against required
        relevant = []
        for skill in found_skills:
            for req in required:
                # Allow partial matches (substring matching)
                if req in skill or skill in req:
                    if skill not in relevant:
                        relevant.append(skill)
                    break
        
        # Find missing skills
        missing = []
        for req in required:
            req_lower = req.lower()
            found = False
            for found_skill in found_skills:
                if req_lower in found_skill or found_skill in req_lower:
                    found = True
                    break
            if not found:
                missing.append(req_lower)
        
        # Calculate fit percentage and category
        if not required:
            fit_pct = 0.0
            fit = 'poor'
        else:
            fit_pct = (len(relevant) / len(required)) * 100.0
            
            # Determine overall fit category
            if fit_pct >= SkillMatcher.FIT_THRESHOLDS['excellent']:
                fit = 'excellent'
            elif fit_pct >= SkillMatcher.FIT_THRESHOLDS['good']:
                fit = 'good'
            elif fit_pct >= SkillMatcher.FIT_THRESHOLDS['fair']:
                fit = 'fair'
            else:
                fit = 'poor'
        
        return {
            'relevant_skills': relevant,
            'missing_skills': missing,
            'overall_fit': fit,
            'fit_percentage': fit_pct
        }
