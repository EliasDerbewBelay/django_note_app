from django.urls import path
from .views import notes_list, delete_note, update_note, register, profile

urlpatterns = [
    path('', notes_list),                 # GET, POST
    path('register/', register),          # POST
    path('update/<int:pk>/', update_note),# PUT
    path('profile/', profile),            # GET
    path('<int:pk>/', delete_note),       # DELETE
]
