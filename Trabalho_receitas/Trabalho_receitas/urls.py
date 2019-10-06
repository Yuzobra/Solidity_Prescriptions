from django.contrib import admin
from django.urls import path, include
from django.contrib import admin,auth
from django.contrib.auth import views as auth_views
from frontend import views


urlpatterns = [
    path('admin/', admin.site.urls),

    path('',include('frontend.urls')),
    path('', include('Prescriptions.urls')),
]
