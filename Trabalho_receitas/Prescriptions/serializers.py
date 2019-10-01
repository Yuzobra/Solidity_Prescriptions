from rest_framework import serializers
from Prescriptions.models import Prescription


# Prescription serializers
class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = '__all__'
