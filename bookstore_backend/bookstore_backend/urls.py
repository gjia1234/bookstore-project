from django.contrib import admin
from django.urls import path,include
from rest_framework import routers
from backend import views
from rest_framework.urlpatterns import format_suffix_patterns

# router = routers.DefaultRouter();
# router.register(r'books',views.GetAllBooks)


urlpatterns = [
    path("GetBooks/",views.GetAllBooks),
    path("AddBook/",views.PostBook),
    path("UpdateBook/<str:isbn>/",views.UpdateBook),
    path("DeleteBook/<str:isbn>/",views.DeleteBook),
    path('admin/', admin.site.urls),
]

urlpatterns = format_suffix_patterns(urlpatterns)
