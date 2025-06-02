from backend.models import Books
from rest_framework import status
from backend.serializers import BookSerializer,UserSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import Http404
from django.shortcuts import get_object_or_404


@api_view(["GET"])
def GetAllBooks(request):
    if request.method == "GET":
        AllBooks = Books.objects.all()
        serializer = BookSerializer(AllBooks, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def PostBook(request):
    if request.method == "POST":
        serializer = BookSerializer(data = request.data)
        if(serializer.is_valid()):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def get_object(self, pk):
        try:
            return Books.objects.get(pk=pk)
        except Books.DoesNotExist:
            raise Http404


@api_view(['PUT'])
def UpdateBook(request,isbn):
    if request.method == "PUT":
        book = get_object_or_404(Books,isbn)
        serializer = BookSerializer(book, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


