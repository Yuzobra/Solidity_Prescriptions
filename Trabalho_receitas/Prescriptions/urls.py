from rest_framework import routers
from .api import PrescriptionViewSet

router = routers.DefaultRouter()
router.register('api.prescriptions', PrescriptionViewSet,'Prescriptions')

urlpatterns = router.urls
