from Prescriptions.models import Prescription
from rest_framework import viewsets,permissions
from .serializers import PrescriptionSerializer

#Prescription Viewset
class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.all()
    permission_classes = [
        permissions.AllowAny,
    ]
    serializer_class = PrescriptionSerializer
