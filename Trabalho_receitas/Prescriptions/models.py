from django.db import models
from django.contrib.auth.models import AbstractBaseUser,PermissionsMixin
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone
# Create your models here.

from .manager import CustomUserManager

class userModel(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=20,unique = True)
    email = models.EmailField(_('email address'),unique = True)
    type = models.CharField(max_length=8)

    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    objects = CustomUserManager()

class Prescription(models.Model):
    medicCPF = models.CharField(max_length=11)
    medicCRM = models.CharField(max_length=10) #ALTERAR PARA O VALOR CERTO
    patientCPF = models.CharField(max_length=11)
    medicine = models.CharField(max_length=50)
    message = models.CharField(max_length=200)
    quantity = models.IntegerField()
    prescribedAt = models.DateTimeField(auto_now_add=True)



class Medic(models.Model):
    cpf = models.CharField(max_length=11, unique=True)
    crm = models.CharField(max_length=10, unique=True)

class Patient(models.Model):
    cpf = models.CharField(max_length=11)

class Pharmacy(models.Model):
    cnpj = models.CharField(max_length=14)
