from django.urls import path

from . import views


urlpatterns = [
    path('', views.homepage, name='homepage'),
    path('profile/<str:region>/<str:username>', views.profile, name='profile'),
    path ('match/<str:region>/<str:match_id>', views.match, name='match')

]