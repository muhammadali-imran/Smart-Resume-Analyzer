# Smart-Resume-Analyzer
This is Project that I was tasked to build in "Code Quest 2025" where me and teammates participated. This repository is the continuation of that project. It helps you highlight relevant keywords, identify gaps, and strengthen your overall presentation to land more interviews.
A production-ready Django backend for intelligent resume evaluation against job postings. The system uses multiple evaluation strategies including text extraction, skill matching, heuristic scoring, semantic similarity analysis, and optional AI integration.

## 🚀 Quick Start

Get up and running in 10 minutes:

```powershell
# 1. Create virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run migrations
python manage.py migrate

# 4. Create admin user
python manage.py createsuperuser

# 5. Start server
python manage.py runserver
```

Visit http://localhost:8000/admin and start creating job postings!

**For detailed setup**: Read [`QUICK_START.md`](QUICK_START.md)

## 📚 Documentation

### Getting Started
- **[QUICK_START.md](QUICK_START.md)** - 10-minute setup guide with examples
  - Environment setup
  - Usage examples with curl
  - Admin interface guide
  - Troubleshooting

### For Developers
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Complete API reference (300+ lines)
  - Architecture overview
  - 3 API endpoints with full specifications
  - Request/response examples
  - Configuration guide
  - Troubleshooting

### For Architects/Project Managers
- **[BACKEND_COMPLETE.md](BACKEND_COMPLETE.md)** - Implementation summary (200+ lines)
  - Feature checklist (✅ 30+ features)
  - Technology stack
  - Design decisions
  - Deployment notes

### For Developers Extending the Code
- **[DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)** - Developer guide (200+ lines)
  - Architecture overview
  - Code organization
  - Development workflow
  - Performance optimization
  - Security considerations

### Reference
- **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - Documentation index and quality metrics
- **[COMPLETION_SUMMARY.md](COMPLETION_SUMMARY.md)** - Project completion status

## ✨ Features

### Text Extraction
- ✅ PDF parsing (native and OCR for scanned documents)
- ✅ DOCX (Word) document extraction
- ✅ Image OCR (PNG, JPG, TIFF)
- ✅ Plain text files
- ✅ Intelligent fallback strategy

### Skill Matching
- ✅ 60+ predefined technical and soft skills
- ✅ Resume skill detection
- ✅ Job requirement matching
- ✅ Missing skills identification
- ✅ Fit percentage calculation

### Evaluation Strategies
- ✅ Heuristic scoring (keyword, contact, education, experience)
- ✅ TF-IDF semantic similarity (scikit-learn)
- ✅ Optional AI evaluation (Grok API)
- ✅ Hybrid scoring (60% heuristic + 40% semantic)

### Admin Interface
- ✅ Job posting management (create, read, update, delete)
- ✅ Resume submission review
- ✅ Advanced filtering and search
- ✅ Skill evaluation display
- ✅ Batch operations

### REST API
- ✅ List job postings
- ✅ Apply for specific job
- ✅ Generic resume evaluation
- ✅ JSON responses

## 🔌 API Endpoints

```bash
# List available jobs
GET /main/api/jobs/

# Apply for a job
POST /main/api/jobs/<job_id>/apply/
  - Multipart form with resume file
  - Candidate name and email

# Evaluate resume against job description
POST /main/api/evaluate_resume/
  - Multipart form with resume file
  - Job description or job_id
  - Candidate information
```

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for complete endpoint specifications with examples.

## 📊 Technology Stack

**Framework**: Django 5.0+  
**Language**: Python 3.10+  
**Database**: SQLite (dev), PostgreSQL (production)  
**Text Extraction**: PyMuPDF, python-docx, pytesseract, pdf2image  
**ML/NLP**: scikit-learn (TF-IDF)  
**HTTP**: httpx, Django REST  
**Image Processing**: Pillow  

**Full dependency list** in [requirements.txt](requirements.txt)

## 🎯 Use Cases

- **HR Systems**: Automated resume screening
- **Recruitment Platforms**: Resume-to-job matching
- **Learning Platforms**: Skills gap analysis
- **Career Services**: Resume evaluation feedback
- **Job Boards**: Application processing

## 🔒 Security Features

- [x] File upload validation
- [x] Input sanitization
- [x] CSRF protection
- [x] Error handling
- [x] Graceful degradation
- [x] Environment variable configuration
- [x] Security considerations documented

## 📈 Performance

- Text extraction: 10-100ms (native), 1-5s per page (OCR)
- Skill detection: <100ms
- Heuristic scoring: <50ms
- TF-IDF similarity: 100-500ms
- Total request: 100-1000ms (local) or 1-10s (with Grok API)

## 🗂️ Project Structure

```
code-quest/
├── README.md                    # This file
├── QUICK_START.md              # 10-minute setup guide
├── API_DOCUMENTATION.md        # Complete API reference
├── BACKEND_COMPLETE.md         # Implementation details
├── DOCUMENTATION_INDEX.md      # Documentation index
├── DEVELOPMENT_GUIDE.md        # Developer guide
├── requirements.txt            # Python dependencies
├── manage.py                   # Django management
│
├── code_quest/                 # Django project settings
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
│
└── main/                       # Main Django app
    ├── models.py               # Database models
    ├── views.py                # API endpoints and logic
    ├── forms.py                # Django forms
    ├── admin.py                # Admin interface
    ├── urls.py                 # URL routing
    └── migrations/             # Database migrations
```

## 🚀 Production Deployment

### Prerequisites
- Python 3.10+
- PostgreSQL database
- Tesseract OCR (for document scanning)
- Reverse proxy (Nginx/Apache)

### Deployment Steps

1. **Read deployment section** in [BACKEND_COMPLETE.md](BACKEND_COMPLETE.md)
2. **Configure environment variables**
3. **Set up PostgreSQL database**
4. **Collect static files**: `python manage.py collectstatic`
5. **Run migrations**: `python manage.py migrate`
6. **Use Gunicorn**: `gunicorn code_quest.wsgi:application`
7. **Configure Nginx/Apache** as reverse proxy
8. **Enable HTTPS/SSL**

## 🧪 Testing

```powershell
# Run unit tests
python manage.py test main

# Check for syntax errors
python -m py_compile main/views.py main/models.py
```

## 🐛 Troubleshooting

### Common Issues

**Issue**: "ModuleNotFoundError: No module named 'django'"
```powershell
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**Issue**: OCR not working
- Install Tesseract: https://github.com/UB-Mannheim/tesseract/wiki
- Set TESSERACT_CMD in settings if needed

**Issue**: Database errors
```powershell
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

See [QUICK_START.md](QUICK_START.md) for more troubleshooting.

## 📝 Documentation Status

| Document | Status | Audience |
|----------|--------|----------|
| QUICK_START.md | ✅ Complete | New users, quick setup |
| API_DOCUMENTATION.md | ✅ Complete | API integrators |
| BACKEND_COMPLETE.md | ✅ Complete | Architects, project managers |
| DEVELOPMENT_GUIDE.md | ✅ Complete | Contributing developers |
| Code docstrings | ✅ 100% coverage | All developers |

## 🔄 Version Info

- **Current Version**: 1.0 (Complete)
- **Python**: 3.10+
- **Django**: 5.0+
- **Last Updated**: January 2025
- **Status**: Production Ready ✅

## 📞 Support

- **Quick questions**: See [QUICK_START.md](QUICK_START.md) Troubleshooting
- **API issues**: See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) Troubleshooting
- **Development**: See [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)
- **General info**: See [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)

## 📄 License

This project is provided as-is for demonstration and educational purposes.

---

**Ready to evaluate resumes at scale? Get started with [QUICK_START.md](QUICK_START.md)** 🚀" 
