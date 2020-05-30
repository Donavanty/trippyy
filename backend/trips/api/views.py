from rest_framework.generics import ListAPIView, RetrieveAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView

from trips.models import Trip

from django.contrib.auth.models import User

from .serializers import UserSerializer, TripSerializer
from rest_framework import permissions
from .permissions import UserIsOwner, TripIsOwner

class TripList(ListCreateAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer

    def perform_create(self, serializer):
    	serializer.save(owner=self.request.user)

class TripDetail(RetrieveUpdateDestroyAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly,TripIsOwner]

class UserList(ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetail(RetrieveAPIView):
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly,UserIsOwner]
    queryset = User.objects.all()
    serializer_class = UserSerializer

# Custom View to Login such that UserID is returned.
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

class CustomObtainAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super(CustomObtainAuthToken, self).post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])
        return Response({'token': token.key, 'id': token.user_id})