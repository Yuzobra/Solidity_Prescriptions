from django.urls import path
from . import views



urlpatterns = [
    path('', views.index, name='home'),
    #auth


    path('teste', views.teste)
]
