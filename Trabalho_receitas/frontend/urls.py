from django.urls import path
from django.contrib.auth.decorators import login_required

from . import views


urlpatterns = [
    path('', login_required(views.index), name='default'),
    path('home', login_required(views.index), name='home'),
    #auth
    path('login', views.index, name='login'),
    path('register', views.index, name='register'),
    path('accounts/register/', views.RegisterUser, name='account-register'),
    path('accounts/login/', views.LoginUser, name='account-login'),
    path('accounts/LogOut/', views.LogOut, name='account-logout'),
    path('accounts/getUserData', views.getUserData, name='account-getUserData'),
    #utility
    path('prescriptions/save', views.savePrescription, name='prescription-save'),
    path('prescriptions/get', views.getPrescriptions, name='prescriptions-get'),
    path('prescriptions/info', views.getPrescriptionInfo, name='prescriptions-info')
]
