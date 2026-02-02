"""Django forms for the Smart Resume Evaluator application.

This module provides forms for:
- Job posting creation/editing (admin)
- Resume file uploads (candidates)
"""

from django import forms
from .models import TestItem, JobPosting, ResumeSubmission


class TestItemForm(forms.ModelForm):
    """Form for legacy test items. Can be removed in production."""
    class Meta:
        model = TestItem
        fields = ['description', 'image']


class JobPostingForm(forms.ModelForm):
    """Form for creating and editing job postings.
    
    Admin users use this form to:
    - Define job title and description
    - Specify job location
    - List required skills for matching
    """
    class Meta:
        model = JobPosting
        fields = ['title', 'description', 'location', 'required_skills']


class ResumeUploadForm(forms.ModelForm):
    """Form for candidates to upload and apply with their resume.
    
    Candidates use this form to:
    - Select the job they're applying for
    - Provide their name and contact email
    - Upload their resume file (PDF or DOCX)
    """
    class Meta:
        model = ResumeSubmission
        fields = ['job', 'candidate_name', 'candidate_email', 'file']

