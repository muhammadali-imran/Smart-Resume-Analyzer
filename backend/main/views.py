"""API views for the Smart Resume Evaluator application - CLEAN VERSION.

This module provides REST API endpoints for:
- Listing job postings  
- Applying for jobs
- Evaluating resumes

All heavy lifting is delegated to specialized modules for clean separation of concerns:
- extractors.py: TextExtractor class for text extraction from various formats
- skills.py: SkillMatcher class for skill detection and matching
- evaluators.py: HeuristicEvaluator, SemanticEvaluator, AIEvaluator, HybridEvaluator classes
- config.py: Config class for API keys and sensitive configuration

This keeps views.py clean and focused on just HTTP request/response handling.
"""

from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import TestItem, ResumeSubmission, JobPosting
from .forms import TestItemForm, ResumeUploadForm, JobPostingForm
from .extractors import TextExtractor
from .skills import SkillMatcher
from .evaluators import HybridEvaluator


# ============================================================================
# HOME PAGE
# ============================================================================

def index(request):
    """API Root."""
    return JsonResponse({
        "message": "Smart Resume Evaluator API is running.",
        "endpoints": {
            "list_jobs": "/main/api/jobs/",
            "evaluate_resume": "/main/api/evaluate_resume/"
        }
    })


# ============================================================================
# API ENDPOINTS - RESUME EVALUATION
# ============================================================================

@csrf_exempt
def evaluate_resume(request):
    """API endpoint to evaluate a resume against a job description.
    
    Generic evaluation endpoint accepting either direct job description or job ID.
    Performs text extraction, skill evaluation, and hybrid scoring.
    
    HTTP Method: POST (multipart/form-data)
    
    Request Parameters:
        - resume (file): Resume file (PDF, DOCX, image, or text)
        - job_description (str, optional): Job description text
        - job_id or job (int, optional): JobPosting ID
        - candidate_name (str, optional): Candidate name
        - candidate_email (str, optional): Candidate email
        
    Response (JSON):
        {
            "id": 123,                              # Submission ID
            "score": 75.5,                          # 0-100 score
            "feedback": "Keyword match: 80%...",    # Human-readable feedback
            "evaluation_method": "hybrid",          # Method: grok, hybrid, or heuristic
            "breakdown": {"heuristic": 70, ...},    # Score breakdown
            "relevant_skills": ["Python", "Django"],# Matching skills
            "missing_skills": ["AWS"],              # Missing skills
            "overall_fit": "good"                   # excellent/good/fair/poor
        }
        
    Error Responses:
        - HTTP 400: resume file not provided
        - HTTP 405: Method not POST
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)

    # Resolve job from either direct description or job ID
    job_desc = request.POST.get('job_description', '')
    job_id = request.POST.get('job_id') or request.POST.get('job')
    job_obj = None
    
    if job_id:
        try:
            job_obj = JobPosting.objects.get(pk=int(job_id))
            job_desc = job_obj.description
        except Exception:
            pass
    
    # Validate resume file exists
    resume_file = request.FILES.get('resume')
    if not resume_file:
        return JsonResponse({'error': 'resume file not provided'}, status=400)

    # Create submission and extract text
    submission = ResumeSubmission.objects.create(file=resume_file, job=job_obj)
    extracted_text = TextExtractor.extract_from_file(submission.file.path, submission.file.name)
    submission.extracted_text = extracted_text
    
    # Store candidate info
    candidate_name = request.POST.get('candidate_name') or request.POST.get('name')
    candidate_email = request.POST.get('candidate_email') or request.POST.get('email')
    if candidate_name:
        submission.candidate_name = candidate_name
    if candidate_email:
        submission.candidate_email = candidate_email

    # Evaluate skills if job has requirements
    relevant_skills, missing_skills, overall_fit = [], [], 'poor'
    if job_obj and job_obj.required_skills:
        skill_result = SkillMatcher.evaluate(job_obj.required_skills, extracted_text)
        relevant_skills = skill_result['relevant_skills']
        missing_skills = skill_result['missing_skills']
        overall_fit = skill_result['overall_fit']

    # Perform hybrid evaluation (tries Grok, falls back to local)
    eval_result = HybridEvaluator.evaluate(extracted_text, job_desc)

    # Save results
    submission.score = eval_result['score']
    submission.feedback = eval_result['feedback']
    submission.relevant_skills = relevant_skills if relevant_skills else None
    submission.missing_skills = missing_skills if missing_skills else None
    submission.overall_fit = overall_fit if job_obj and job_obj.required_skills else ''
    submission.structured_assessment = {
        'method': eval_result['method'],
        'breakdown': eval_result.get('breakdown', {}),
    }
    submission.save()

    # Return response
    return JsonResponse({
        'id': submission.pk,
        'score': eval_result['score'],
        'feedback': eval_result['feedback'],
        'evaluation_method': eval_result['method'],
        'breakdown': eval_result.get('breakdown', {}),
        'relevant_skills': relevant_skills,
        'missing_skills': missing_skills,
        'overall_fit': overall_fit,
        'structured_assessment': submission.structured_assessment
    })


def list_jobs(request):
    """API endpoint to list all available job postings.
    
    HTTP Method: GET
    
    Response (JSON):
        {
            "jobs": [
                {
                    "id": 1,
                    "title": "Senior Python Developer",
                    "company": "TechCorp Inc",
                    "location": "San Francisco, CA",
                    "type": "Full-time",
                    "description": "Full job description...",
                    "required_skills": "Python, Django, ...",
                    "skills": ["Python", "Django", ...],  # parsed array
                    "created_at": "2024-01-15T10:30:00Z"
                },
                ...
            ]
        }
    """
    jobs_data = []
    for job in JobPosting.objects.order_by('-created_at'):
        jobs_data.append({
            'id': job.id,
            'title': job.title,
            'company': job.company,
            'location': job.location,
            'type': job.type,
            'description': job.description,
            'required_skills': job.required_skills,
            'skills': job.get_skills_list(),  # Array format for frontend
            'created_at': job.created_at.isoformat()
        })
    return JsonResponse({'jobs': jobs_data})


@csrf_exempt
@require_http_methods(['POST'])
def apply_job(request, pk):
    """API endpoint for candidates to apply to a specific job posting.
    
    Candidate-facing endpoint with same evaluation as evaluate_resume but
    linked to a specific job posting for tracking.
    
    HTTP Method: POST (multipart/form-data)
    URL: /main/api/jobs/<pk>/apply/
    
    URL Parameters:
        - pk (int): JobPosting ID
    
    Request Parameters:
        - file or resume (file): Resume file
        - candidate_name (str): Candidate name
        - candidate_email (str): Candidate email
        
    Response (JSON): Same as evaluate_resume endpoint
        
    Error Responses:
        - HTTP 400: resume file not provided
        - HTTP 404: Job posting not found
    """
    job = get_object_or_404(JobPosting, pk=pk)

    # Get and validate resume
    resume_file = request.FILES.get('file') or request.FILES.get('resume')
    if not resume_file:
        return JsonResponse({'error': 'resume file not provided'}, status=400)

    # Create submission and extract text
    submission = ResumeSubmission.objects.create(job=job, file=resume_file)
    extracted_text = TextExtractor.extract_from_file(submission.file.path, submission.file.name)
    submission.extracted_text = extracted_text
    
    # Store candidate info
    submission.candidate_name = request.POST.get('candidate_name', '')
    submission.candidate_email = request.POST.get('candidate_email', '')

    # Evaluate skills
    relevant_skills, missing_skills, overall_fit = [], [], 'poor'
    if job.required_skills:
        skill_result = SkillMatcher.evaluate(job.required_skills, extracted_text)
        relevant_skills = skill_result['relevant_skills']
        missing_skills = skill_result['missing_skills']
        overall_fit = skill_result['overall_fit']

    # Perform hybrid evaluation
    eval_result = HybridEvaluator.evaluate(extracted_text, job.description)

    # Save results
    submission.score = eval_result['score']
    submission.feedback = eval_result['feedback']
    submission.relevant_skills = relevant_skills if relevant_skills else None
    submission.missing_skills = missing_skills if missing_skills else None
    submission.overall_fit = overall_fit if job.required_skills else ''
    submission.structured_assessment = {
        'method': eval_result['method'],
        'breakdown': eval_result.get('breakdown', {}),
    }
    submission.save()

    # Return response
    return JsonResponse({
        'id': submission.pk,
        'score': eval_result['score'],
        'feedback': eval_result['feedback'],
        'evaluation_method': eval_result['method'],
        'breakdown': eval_result.get('breakdown', {}),
        'relevant_skills': relevant_skills,
        'missing_skills': missing_skills,
        'overall_fit': overall_fit,
        'structured_assessment': submission.structured_assessment
    })


# ============================================================================
# LEGACY ENDPOINTS
# ============================================================================

def test_page(request):
    """Legacy endpoint: Display and create test items."""
    items = TestItem.objects.all()
    form = TestItemForm()

    if request.method == 'POST':
        form = TestItemForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('test')

    return render(request, 'test.html', {'form': form, 'items': items})


def delete_item(request, pk):
    """Legacy endpoint: Delete a test item by ID."""
    item = get_object_or_404(TestItem, pk=pk)
    item.delete()
    return redirect('test')
