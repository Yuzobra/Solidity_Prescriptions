from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views import generic
from Prescriptions.forms import CustomUserCreationForm
from django.contrib.auth import get_user_model as User
from django.contrib.auth import login,authenticate, logout
from django.urls import reverse_lazy


from Prescriptions.models import Patient, Medic, Pharmacy, Prescription

import json

def index(request):
    return render(request, 'frontend/index.html')

@csrf_exempt
def teste(request):
    print("Teste")
    return HttpResponse("ok")

@csrf_exempt
def RegisterUser(request):
    if request.method == 'POST':
        body = json.loads(request.body.decode('utf-8'))
        print(body)
        try:
            user = User().objects.create_user(email=body["email"], username=body["username"], password=body["password"], type=body["type"])
        except Exception as err:
            print("Error registering user on database:"+str(err))
            return HttpResponse(status=500)

        if(body["type"] == "Patient"):
            try:
                patient = Patient(cpf=body["cpf"])
                patient.save()
            except Exception as err:
                print("Error registering new patient in patient table:"+str(err))
                user.delete()
                return HttpResponse(status=500)

        elif(body["type"] == "Medic"):
            try:
                medic = Medic(cpf=body["cpf"], crm=body["crm"])
                medic.save()
            except Exception as err:
                print("Error registering new medic in medic table:"+str(err))
                user.delete()
                return HttpResponse(status=500)

        else:
            try:
                pharmacy = Pharmacy(cnpj=body["cnpj"])
                pharmacy.save()
            except Exception as err:
                print("Error registering new pharmacy in pharmacy table:"+str(err))
                user.delete()
                return HttpResponse(status=500)


        login(request, user)

        success_url = reverse_lazy('home')
        return redirect(success_url) #return user


@csrf_exempt
def LoginUser(request):
    body = json.loads(request.body.decode('utf-8'))
    print(body)
    user = authenticate(username=body["username"],password=body["password"])
    if user is not None:
        login(request, user)
        success_url = reverse_lazy('home')
        return HttpResponse("ok")
    else:
        return HttpResponse(status=201)
def LogOut(request):
    try:
        logout(request)
    except Exception as err:
        print("Error logging out of user's " + request.user.email + " account: "+str(err))
        return HttpResponse(status=500)
    return HttpResponse('ok')
def getUserData(request):
    if request.user.is_authenticated:
        return HttpResponse(json.dumps({'authenticated': "True","user":{"username":request.user.username,"type":request.user.type,"email":request.user.email}}))
    else:
        return HttpResponse(json.dumps({'authenticated': "False","user":"False"}))
