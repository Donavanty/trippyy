from rest_framework.generics import ListAPIView, RetrieveAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.views import APIView
from trips.models import Trip

import requests
import json
from rest_framework.renderers import JSONRenderer

from django.contrib.auth.models import User
from .serializers import UserSerializer, TripSerializer
from rest_framework import permissions
from .permissions import UserIsOwner, TripIsOwner
from .utilities import recommendTime, addTimeAndSummary
from .algo/optimize import optimize

class TripList(ListCreateAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer

    def perform_create(self, serializer):
    	serializer.save(owner=self.request.user)

class TripDetail(RetrieveUpdateDestroyAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly,TripIsOwner]

class UserList(ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetail(RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly,UserIsOwner]
    queryset = User.objects.all()
    serializer_class = UserSerializer

class TextSearch(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data
        url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + data["query"] + "&key=" + data["key"]
        # url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=Singapore+points+of+interest&key=AIzaSyDyb0_iNF_gpoxydk5Vd8IpWj1Hy1Tp5Vc"
        r = requests.get(url)
        output = addTimeAndSummary(r)

        return Response(output, status=200)

class NextKeySearch(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data
        url = "https://maps.googleapis.com/maps/api/place/textsearch/json?pagetoken=" + data["next_page_token"] + "&key=" + data["key"]
        r = requests.get(url)
        output = addTimeAndSummary(r)

        return Response(output, status=200)

class BoundedTextSearch(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data
        url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + data["query"] + "&location=" + data["lat"] + "," + data["lng"] + "&radius=" + data["radius"] + "&key=" + data["key"]
        r = requests.get(url)
        output = addTimeAndSummary(r)

        return Response(output, status=200)

class AlgoOptimize(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data
        output = optimize(data["activitiesAdded"], data["lengthOfTrip"])

        return Response(output, status=200)


# Custom View to Login such that UserID is returned.
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

class CustomObtainAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super(CustomObtainAuthToken, self).post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])
        return Response({'token': token.key, 'id': token.user_id})