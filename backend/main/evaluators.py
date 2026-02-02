"""Resume evaluation and scoring module.

This module provides multiple evaluation strategies:
- Heuristic scoring (keyword matching, contact info, education, experience)
- TF-IDF semantic similarity
- Optional AI-powered evaluation via Grok API
- Hybrid scoring combining multiple strategies
"""

import re

try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
except Exception:
    TfidfVectorizer = None
    cosine_similarity = None

try:
    import httpx
except Exception:
    httpx = None

from main.config import Config


class HeuristicEvaluator:
    """Heuristic-based resume evaluation using multiple factors."""
    
    # Heuristic scoring weights
    WEIGHTS = {
        'keyword_overlap': 60,      # Keywords matching between job and resume
        'contact_info': 10,         # Email and phone presence
        'education': 10,            # Degree mentions
        'experience': 20,           # Years of experience
    }
    
    STOP_WORDS = {
        "the", "and", "for", "with", "that", "this", "from", "are", 
        "have", "has", "will", "your", "a", "an", "or", "to"
    }
    
    @staticmethod
    def evaluate(resume_text, job_text):
        """Evaluate resume using heuristic scoring.
        
        Combines multiple factors with weighted scoring:
        - Keyword overlap: 60% (tokens matching between job and resume)
        - Contact info: 10% (5% for email, 5% for phone)
        - Education: 10% (mentions of bachelor/master/phd/degree)
        - Experience: 20% (years of experience mentioned)
        
        Args:
            resume_text (str): Resume text
            job_text (str): Job description text
            
        Returns:
            dict: Evaluation results containing:
                - score (float): 0-100 heuristic score
                - feedback (str): Multiline suggestions for improvement
                - weights (dict): Individual factor scores
                
        Notes:
            - Tokenization removes words < 3 chars and common stop words
            - Contact info detection via regex for email and phone patterns
            - Experience extraction looks for "X years" pattern
            - Score is clamped to [0, 100] range
        """
        resume = (resume_text or '').lower()
        job = (job_text or '').lower()

        feedback = []
        score = 0.0
        weights = {}

        # 1. Keywords overlap (weight 60)
        def tokenize(s):
            words = re.findall(r"[a-zA-Z0-9\+\#\-]{3,}", s)
            return [w for w in words if w not in HeuristicEvaluator.STOP_WORDS]

        job_tokens = set(tokenize(job))
        resume_tokens = set(tokenize(resume))
        if job_tokens:
            overlap = job_tokens & resume_tokens
            ratio = len(overlap) / len(job_tokens)
        else:
            ratio = 0.0
        
        keyword_score = ratio * HeuristicEvaluator.WEIGHTS['keyword_overlap']
        score += keyword_score
        weights['keyword_overlap'] = keyword_score
        feedback.append(f"Keyword match: {int(ratio*100)}% ({len(overlap)} of {len(job_tokens)} keywords)")

        # 2. Contact info presence (weight 10)
        email_found = bool(re.search(r"[\w\.-]+@[\w\.-]+", resume))
        phone_found = bool(re.search(r"\+?\d[\d\s\-]{6,}\d", resume))
        contact_points = 5 * int(email_found) + 5 * int(phone_found)
        score += contact_points
        weights['contact_info'] = contact_points
        
        if not email_found:
            feedback.append("Add a contact email.")
        if not phone_found:
            feedback.append("Add a contact phone number.")

        # 3. Education signal (weight 10)
        edu_keywords = ["bachelor", "master", "phd", "ba ", "bs ", "degree"]
        edu_found = any(k in resume for k in edu_keywords)
        edu_points = HeuristicEvaluator.WEIGHTS['education'] if edu_found else 0
        score += edu_points
        weights['education'] = edu_points
        
        if not edu_found:
            feedback.append("Mention your highest education/degree.")

        # 4. Experience years (weight 20)
        exp_match = re.search(r"(\d+)\+?\s+years", resume)
        years = int(exp_match.group(1)) if exp_match else 0
        years_points = min(
            HeuristicEvaluator.WEIGHTS['experience'], 
            years * 2  # 2 points per year, capped at weight
        )
        score += years_points
        weights['experience'] = years_points
        
        if years == 0:
            feedback.append("Explicitly state total years of relevant experience (e.g. '5 years').")

        # Clamp score to [0, 100]
        score = max(0.0, min(100.0, score))

        return {
            'score': score,
            'feedback': "\n".join(feedback),
            'weights': weights
        }


class SemanticEvaluator:
    """TF-IDF based semantic similarity evaluation."""
    
    @staticmethod
    def evaluate(job_text, resume_text):
        """Compute TF-IDF cosine similarity between job description and resume.
        
        This function uses scikit-learn to compute TF-IDF vectors for both
        the job description and resume, then calculates cosine similarity.
        This provides a semantic similarity score independent of keywords.
        
        Args:
            job_text (str): Job description text
            resume_text (str): Resume text
            
        Returns:
            dict: Evaluation results containing:
                - score (float): Similarity score in [0.0, 1.0], or None if unavailable
                - similarity (float): Same as score
                - available (bool): True if evaluation was successful
                
        Note:
            Requires scikit-learn. Returns None if not available and
            system falls back to heuristic scoring only.
            
            1.0 = perfect match, 0.0 = no similarity
        """
        if not TfidfVectorizer or not cosine_similarity:
            return {
                'score': None,
                'similarity': None,
                'available': False
            }
        
        try:
            # Create TF-IDF vectors (stop words removed, max 2000 features)
            vect = TfidfVectorizer(stop_words='english', max_features=2000)
            docs = [job_text or '', resume_text or '']
            tfidf = vect.fit_transform(docs)
            
            # Compute cosine similarity between job (index 0) and resume (index 1)
            sim = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
            sim_score = float(sim)
            
            return {
                'score': sim_score,
                'similarity': sim_score,
                'available': True
            }
        except Exception:
            return {
                'score': None,
                'similarity': None,
                'available': False
            }


class AIEvaluator:
    """AI-powered evaluation via Grok API."""
    
    @staticmethod
    def evaluate(job_text, resume_text):
        """Call external Grok API to get AI-powered resume evaluation.
        
        This function sends the job description and resume text to an external
        Grok API endpoint for intelligent assessment. It requires GROK_API_KEY
        and GROK_API_URL environment variables to be configured.
        
        Args:
            job_text (str): Job description text
            resume_text (str): Resume text
            
        Returns:
            dict: Evaluation results containing:
                - score (float or None): 0-100 evaluation score from API
                - feedback (str or None): Detailed feedback from API
                - assessment (dict or None): Detailed analysis object
                - available (bool): True if API call succeeded
                
        Configuration:
            Requires environment variables:
            - GROK_API_KEY: Bearer token for authentication
            - GROK_API_URL: API endpoint URL
            
        Notes:
            - 30-second timeout for API requests
            - Gracefully returns empty dict on failure
            - System falls back to local evaluation if Grok unavailable
        """
        if not Config.is_grok_configured() or not httpx:
            return {
                'score': None,
                'feedback': None,
                'assessment': None,
                'available': False
            }

        payload = {
            'job_description': job_text or '',
            'resume_text': resume_text or ''
        }
        headers = {
            'Authorization': f'Bearer {Config.GROK_API_KEY}',
            'Content-Type': 'application/json'
        }

        try:
            with httpx.Client(timeout=30.0) as client:
                resp = client.post(Config.GROK_API_URL, json=payload, headers=headers)
                if resp.status_code != 200:
                    return {
                        'score': None,
                        'feedback': None,
                        'assessment': None,
                        'available': False
                    }
                
                data = resp.json()
                score = data.get('score')
                feedback = data.get('feedback') or data.get('comments') or ''
                assessment = data.get('structured_assessment') or data.get('analysis') or data
                
                return {
                    'score': score,
                    'feedback': feedback,
                    'assessment': assessment,
                    'available': True
                }
        except Exception:
            return {
                'score': None,
                'feedback': None,
                'assessment': None,
                'available': False
            }


class HybridEvaluator:
    """Combines multiple evaluation strategies for optimal results."""
    
    # Weights for combining multiple scores
    WEIGHTS = {
        'grok': 1.0,           # Prefer AI if available
        'heuristic': 0.6,      # 60% heuristic weight when combining
        'semantic': 0.4,       # 40% semantic weight when combining
    }
    
    @staticmethod
    def evaluate(resume_text, job_text):
        """Evaluate resume using all available strategies.
        
        Strategy:
        1. Try Grok AI (if configured)
        2. Fallback to local heuristic scoring
        3. Add TF-IDF semantic similarity (if available)
        4. Combine for final score
        
        Args:
            resume_text (str): Resume text
            job_text (str): Job description text
            
        Returns:
            dict: Comprehensive evaluation containing:
                - score (float): Final 0-100 score
                - feedback (str): Human-readable feedback
                - breakdown (dict): Scores from each evaluator
                - method (str): Which method was used
        """
        result = {
            'score': None,
            'feedback': '',
            'breakdown': {},
            'method': None
        }
        
        # Try Grok AI first
        grok_result = AIEvaluator.evaluate(job_text, resume_text)
        if grok_result['available'] and grok_result['score'] is not None:
            result['score'] = grok_result['score']
            result['feedback'] = grok_result['feedback'] or ''
            result['breakdown']['grok'] = grok_result['score']
            result['method'] = 'grok'
            return result
        
        # Fallback to heuristic + semantic
        heuristic_result = HeuristicEvaluator.evaluate(resume_text, job_text)
        semantic_result = SemanticEvaluator.evaluate(job_text, resume_text)
        
        h_score = heuristic_result['score']
        result['breakdown']['heuristic'] = h_score
        result['feedback'] = heuristic_result['feedback']
        
        # If TF-IDF available, combine scores
        if semantic_result['available'] and semantic_result['score'] is not None:
            s_score = semantic_result['score'] * 100.0
            result['breakdown']['semantic'] = s_score
            
            # Combine: 60% heuristic + 40% semantic
            final_score = (
                (HybridEvaluator.WEIGHTS['heuristic'] * h_score) + 
                (HybridEvaluator.WEIGHTS['semantic'] * s_score)
            )
            result['score'] = round(max(0.0, min(100.0, final_score)), 2)
            result['feedback'] += f"\nSemantic similarity: {s_score:.1f}%"
            result['method'] = 'hybrid'
        else:
            result['score'] = h_score
            result['method'] = 'heuristic'
        
        return result
