from django.db import models

# Create your models here.

class Prescription(models.Model):
    medicCPF = models.CharField(max_length=11)
    medicCRM = models.CharField(max_length=10) #ALTERAR PARA O VALOR CERTO
    patientCPF = models.CharField(max_length=11)
    medicine = models.CharField(max_length=50)
    message = models.CharField(max_length=200)
    quantity = models.IntegerField()
    prescribedAt = models.DateTimeField(auto_now_add=True)
