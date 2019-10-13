from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views import generic
from Prescriptions.forms import CustomUserCreationForm
from django.contrib.auth import get_user_model as User
from django.contrib.auth import login,authenticate, logout
from django.urls import reverse_lazy


from Prescriptions.models import Patient, Medic, Pharmacy, Prescription

import random
import json

def index(request):
    return render(request, 'frontend/index.html')
@csrf_exempt
def RegisterUser(request):
    if request.method == 'POST':
        body = json.loads(request.body.decode('utf-8'))
        print(body)


        if(len(User().objects.filter(email = body["email"])) != 0):
            return HttpResponse(json.dumps({"field":"email"}),status= 300)

        if(len(User().objects.filter(username = body["username"])) != 0):
            return HttpResponse(json.dumps({"field":"username"}),status= 300)
        
        if(body["type"] == "Patient"):
            if(len(Patient.objects.filter(cpf = body["cpf"])) != 0):
                return HttpResponse(json.dumps({"field":"cpf"}),status= 300)

        elif(body["type"] == "Medic"):
            if(len(Medic.objects.filter(cpf = body["cpf"])) != 0):
                return HttpResponse(json.dumps({"field":"cpf"}),status= 300)
            if(len(Medic.objects.filter(crm = body["crm"])) != 0):
                return HttpResponse(json.dumps({"field":"crm"}),status= 300)
        else:
            if(len(Pharmacy.objects.filter(cnpj = body["cnpj"])) != 0):
                return HttpResponse(json.dumps({"field":"cnpj"}),status= 300)



        try:
            user = User().objects.create_user(email=body["email"], username=body["username"], password=body["password"], type=body["type"])
        except Exception as err:
            print("Error registering user on database:"+str(err))
            return HttpResponse(status=500)

        if(body["type"] == "Patient"):
            try:
                patient = Patient(user=user, cpf=body["cpf"])
                patient.save()
            except Exception as err:
                print("Error registering new patient in patient table:"+str(err))
                user.delete()
                return HttpResponse(status=500)

        elif(body["type"] == "Medic"):
            try:
                medic = Medic(user=user, cpf=body["cpf"], crm=body["crm"])
                medic.save()
            except Exception as err:
                print("Error registering new medic in medic table:"+str(err))
                user.delete()
                return HttpResponse(status=500)

        else:
            try:
                pharmacy = Pharmacy(user= user, cnpj=body["cnpj"])
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
    print("user",user)
    if user is not None:
        login(request, user)
        print('login tentado')
        print(request.user.username,request.user.type)
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
        print('usuario esta autenticado')
        print(request.user.username,request.user.type)
        return HttpResponse(json.dumps({'authenticated': "True","user":{"username":request.user.username,"type":request.user.type,"email":request.user.email}}))
    else:
        return HttpResponse(json.dumps({'authenticated': "False","user":"False"}))
@csrf_exempt
def savePrescription(request):
    body = json.loads(request.body)
    try:
        patient = Patient.objects.get(cpf=body["cpf"])
    except Exception as err:
        print(err)
        return HttpResponse(status= 300)
    try:
        medic = Medic.objects.get(user__email= request.user.email)
    except Exception as err:
        print(err)

    try:
        pin = random.randint(10000,99999)
        while len(Prescription.objects.filter(patient= patient, pin = pin)) != 0:
            pin = random.randint(10000,99999)
        prescription = Prescription(medic= medic, patient= patient, medicine= body["medicine"], quantity= body["quantity"], pin= pin )
        prescription.save()
    except Exception as err:
        print(err)
    data = {"cpfPatient":patient.cpf, "crm":medic.crm, "dateTime": str(prescription.prescribedAt)}
    return HttpResponse(json.dumps(data))

def getPrescriptions(request):
    if(request.user.type != "Patient"):
        return HttpResponse(status=403)
    try: 
        prescriptions = Prescription.objects.filter(patient__user__email=request.user.email)
    except Exception as err:
        print(err)
    
    data = {"values": []}

    if len(prescriptions) == 0:
        return HttpResponse(json.dumps(data))
    
    for prescription in prescriptions:
        data["values"].append({'medicine':prescription.medicine,"quantity":prescription.quantity,"crm":prescription.medic.crm,"patientCpf": prescription.patient.cpf, "dateTime":str(prescription.prescribedAt), "id":prescription.id, "pin": prescription.pin})

    return HttpResponse(json.dumps(data))
@csrf_exempt
def getPrescriptionInfo(request):
    body = json.loads(request.body)
    try:
        prescription = Prescription.objects.get(patient__cpf= body["cpf"], pin= body["pin"])
    except Exception as err:
        print(err)
        return HttpResponse(status= 300)
    try:
        pharmacy = Pharmacy.objects.get(user__email = request.user.email)
    except Exception as err:
        print(err)
    data = {"crm":prescription.medic.crm,"dateTime":str(prescription.prescribedAt),"cnpj":pharmacy.cnpj}
        

    return HttpResponse(json.dumps(data))