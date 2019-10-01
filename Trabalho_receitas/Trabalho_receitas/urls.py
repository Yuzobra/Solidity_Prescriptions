from django.contrib import admin
from django.urls import path, include
from django.contrib import admin,auth
from django.contrib.auth import views as auth_views
from frontend import views


urlpatterns = [
    path('admin/', admin.site.urls),

    path('signup/',views.SignUp.as_view(), name = 'signup'),
    path('login/', auth_views.LoginView.as_view(), name = 'login'),
    path('logout/',auth_views.LogoutView.as_view(), name = 'logout'),

    path('',include('frontend.urls')),
    path('', include('Prescriptions.urls')),
]
