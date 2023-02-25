from django.shortcuts import render

# Create your views here.



def homepage(request):
    return render(request, "StatViewer/homepage.html")

def profile(request):
    username = request.POST['username']
    region = request.POST['region']
    return render(request, "StatViewer/profile.html", {
        'username': username,
        'region': region
    })
