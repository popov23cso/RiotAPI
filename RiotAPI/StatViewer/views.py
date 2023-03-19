from django.shortcuts import render

# Create your views here.



def homepage(request):
    return render(request, "StatViewer/homepage.html")

def profile(request, region, username):
    requested_username = username
    requested_region = region
    if not requested_username or not requested_region:
        return render(request, "StatViewer/error.html", {
            "error_message": "Missing username or region"
        })
    return render(request, "StatViewer/profile.html", {
        'username': requested_username,
        'region': requested_region
    })


def match(request, region, match_id):
    requested_id = match_id
    return render (request, "StatViewer/match.html", {
        'region': region,
        'match_id': requested_id
    })
