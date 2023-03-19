from django.urls import path

from . import views


urlpatterns = [
    path('', views.homepage, name='homepage'),
    path('profile', views.profile, name='profile'),
    path ('match/<str:match_id>', views.match, name='match')

]