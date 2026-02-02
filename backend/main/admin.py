"""Django Admin configuration for Smart Resume Evaluator models.

This module configures the admin interface for managing:
- Job postings (CRUD operations for admins)
- Resume submissions and evaluations (view and analyze submissions)
"""

from django.contrib import admin
from .models import TestItem, JobPosting, ResumeSubmission


@admin.register(TestItem)
class TestItemAdmin(admin.ModelAdmin):
    """Admin interface for legacy TestItem model. Can be removed in production."""
    list_display = ('description',)


@admin.register(JobPosting)
class JobPostingAdmin(admin.ModelAdmin):
    """Admin interface for managing job postings.
    
    Features:
    - List view showing title, location, and creation date
    - Search by title, description, or required skills
    - Edit form for job details including required skills
    - Read-only creation date field
    
    Admin users can:
    - Create new job postings
    - Edit existing job postings
    - Delete job postings
    - Filter and search job postings
    """
    list_display = ('title', 'location', 'created_at')
    search_fields = ('title', 'description', 'required_skills')
    fields = ('title', 'description', 'location', 'required_skills', 'created_at')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)


@admin.register(ResumeSubmission)
class ResumeSubmissionAdmin(admin.ModelAdmin):
    """Admin interface for viewing and analyzing resume submissions and evaluations.
    
    Features:
    - List view showing submission ID, candidate info, job, match score, and fit
    - Filter by job posting and overall fit category
    - Detailed view showing all evaluation results
    - Read-only fields for extracted text and evaluation results
    - Hierarchical field organization: candidate info → evaluation → analysis
    
    Admin users can:
    - View all resume submissions
    - See match scores and overall fit assessments
    - Review extracted resume text
    - Check relevant and missing skills
    - Read detailed feedback and structured assessments
    - Filter submissions by job or fit level for easy review
    """
    list_display = ('id', 'candidate_name', 'candidate_email', 'job', 'score', 'overall_fit', 'created_at')
    list_filter = ('job', 'overall_fit', 'created_at')
    readonly_fields = ('extracted_text', 'feedback', 'structured_assessment', 'relevant_skills', 'missing_skills', 'overall_fit')
    fields = (
        ('candidate_name', 'candidate_email'),
        'job',
        'file',
        ('score', 'overall_fit'),
        'relevant_skills',
        'missing_skills',
        'feedback',
        'structured_assessment',
        'extracted_text'
    )
    search_fields = ('candidate_name', 'candidate_email', 'job__title')
    ordering = ('-created_at',)
