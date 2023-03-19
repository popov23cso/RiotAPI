from django.shortcuts import render

# Create your views here.



def homepage(request):
    return render(request, "StatViewer/homepage.html")

def profile(request):
    username = request.POST['username']
    region = request.POST['region']
    if not username or not region:
        return render(request, "StatViewer/error.html", {
            "error_message": "Missing username or region"
        })
    return render(request, "StatViewer/profile.html", {
        'username': username,
        'region': region
    })


def match(request, match_id):
    id = match_id
    return render (request, "StatViewer/match.html", {
        'match_id': id
    })
