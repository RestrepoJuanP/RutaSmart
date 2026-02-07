from django.shortcuts import render
from django.http import HttpResponse
from .models import movie


# Create your views here.

def home(request):
    searchTerm = request.GET.get('searchMovie')
    if searchTerm:
        movies = movie.objects.filter(tittle__icontains=searchTerm)
    else:
        movies = movie.objects.all()
    return render(request, 'home.html', {'searchTerm': searchTerm, 'movies': movies})

def about(request):
    return HttpResponse('This is the about page')