from django.shortcuts import render
from django.http import HttpResponse

def backend(request):
    return HttpResponse("Hello world!")
