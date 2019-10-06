from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import userModel

class CustomUserCreationForm(UserCreationForm):

    class Meta(UserCreationForm.Meta):
        model = userModel
        fields = '__all__'

class CustomUserChangeForm(UserChangeForm):

    class Meta:
        model = userModel
        fields = '__all__'
