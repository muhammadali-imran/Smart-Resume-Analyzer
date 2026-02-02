
import os
from django.conf import settings

class Config:
    """Central configuration for backend services."""
    
    # Grok API Settings
    GROK_API_KEY = os.environ.get('GROK_API_KEY') or getattr(settings, 'GROK_API_KEY', '')
    GROK_API_URL = os.environ.get('GROK_API_URL') or getattr(settings, 'GROK_API_URL', 'https://api.grok.ai/v1/analyze')
    
    # Tesseract Settings
    TESSERACT_CMD = os.environ.get('TESSERACT_CMD')
    
    @classmethod
    def is_grok_configured(cls):
        """Check if Grok API is properly configured."""
        return bool(cls.GROK_API_KEY and cls.GROK_API_URL)
