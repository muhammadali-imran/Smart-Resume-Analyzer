from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('test/', views.test_page, name='test'),
    path('delete/<int:pk>/', views.delete_item, name='delete_item'),
    path('api/evaluate_resume/', views.evaluate_resume, name='evaluate_resume'),
    path('api/jobs/', views.list_jobs, name='list_jobs'),
    path('api/jobs/<int:pk>/apply/', views.apply_job, name='apply_job'),
]
