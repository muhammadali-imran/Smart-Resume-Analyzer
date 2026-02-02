"""Django models for the Smart Resume Evaluator application.

This module defines the core data models:
- TestItem: Legacy test model (placeholder)
- JobPosting: Job postings with title, description, location, and required skills
- ResumeSubmission: Resume submissions linked to jobs with evaluation results
"""

from django.db import models


class TestItem(models.Model):
    """Legacy test model for basic CRUD operations. Can be removed in production."""
    description = models.CharField(max_length=255)
    image = models.ImageField(upload_to='uploads/')  # uploaded images go to media/uploads/

    def __str__(self):
        return self.description





class JobPosting(models.Model):
    """Represents a job posting created by an admin user.
    
    Fields:
        title: Job title (e.g., 'Senior Python Developer')
        description: Full job description with responsibilities and requirements
        location: Job location (e.g., 'Remote', 'New York, NY')
        required_skills: Comma-separated list of required skills for skill matching
        created_at: Timestamp when the job was posted
    """
    title = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255, blank=True)
    required_skills = models.TextField(
        blank=True,
        help_text="Comma-separated list of required skills (e.g., Python, Django, REST API)"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Job Posting'
        verbose_name_plural = 'Job Postings'

    def __str__(self):
        return self.title


class ResumeSubmission(models.Model):
    """Represents a candidate's resume submission and evaluation results.
    
    Fields:
        job: Foreign key to the job applied for (nullable)
        candidate_name: Name of the candidate
        candidate_email: Email of the candidate
        file: Uploaded resume file (PDF, DOCX, etc.)
        extracted_text: Full text extracted from resume via OCR or text extraction
        structured_assessment: Detailed assessment from Grok API or local evaluator (JSON)
        score: Overall match score (0-100)
        feedback: Text feedback about the resume and match
        relevant_skills: List of skills from resume matching job requirements (JSON)
        missing_skills: List of required skills not found in resume (JSON)
        overall_fit: Categorical assessment (excellent/good/fair/poor)
        created_at: Timestamp when the submission was created
    """
    OVERALL_FIT_CHOICES = [
        ('excellent', 'Excellent'),
        ('good', 'Good'),
        ('fair', 'Fair'),
        ('poor', 'Poor')
    ]
    
    job = models.ForeignKey(
        JobPosting,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='submissions'
    )
    candidate_name = models.CharField(max_length=255, blank=True)
    candidate_email = models.EmailField(blank=True)
    file = models.FileField(upload_to='resumes/')
    extracted_text = models.TextField(blank=True)
    structured_assessment = models.JSONField(null=True, blank=True)
    score = models.FloatField(null=True, blank=True)
    feedback = models.TextField(blank=True)
    relevant_skills = models.JSONField(null=True, blank=True)
    missing_skills = models.JSONField(null=True, blank=True)
    overall_fit = models.CharField(max_length=50, blank=True, choices=OVERALL_FIT_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Resume Submission'
        verbose_name_plural = 'Resume Submissions'

    def __str__(self):
        return f"ResumeSubmission {self.pk} - {self.candidate_name or self.file.name}"
