from rest_framework.generics import ListAPIView, RetrieveAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.views import APIView
from trips.models import Trip

import requests
import json
from rest_framework.renderers import JSONRenderer

from django.contrib.auth.models import User
from .serializers import UserSerializer, TripSerializer
from rest_framework import permissions
from .permissions import UserIsOwner, TripIsOwner, TestingPermission
from .utilities import recommendTime, addTimeAndSummary, extract_values
from .algo.optimize import optimize

class TripList(ListCreateAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class TripDetail(RetrieveUpdateDestroyAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly,TripIsOwner]

    def patch(self, request, pk):
        obj = Trip.objects.get(pk=pk)
        print(obj)
        serializer = TripSerializer(obj, data=request.data, partial=True) # set partial=True to update a data partially
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=200)
        return Response("wrong para", status= 500)


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
        r = requests.get(url)
        output = addTimeAndSummary(r, data["key"], False)
        return Response(output, status=200)

class NextKeySearch(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data
        url = "https://maps.googleapis.com/maps/api/place/textsearch/json?pagetoken=" + data["next_page_token"] + "&key=" + data["key"]
        r = requests.get(url)
        output = addTimeAndSummary(r, data["key"], False)

        return Response(output, status=200)

class BoundedTextSearch(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data
        url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + data["query"] + "&location=" + str(data["lat"]) + "," + str(data["lng"]) + "&radius=" + str(data["radius"]) + "&key=" + data["key"]
        r = requests.get(url)
        output = addTimeAndSummary(r, data["key"], False)

        return Response(output, status=200)

class AlgoOptimize(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data
        output = optimize(data["activitiesAdded"], data["lengthOfTrip"])

        return Response(output, status=200)

class PlaceDetails(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data
        status = 0
        output = {}

        if not (data["placeId"]):
            status = 201
            output = {"Error" : "Place ID is invalid."}
        else:
            url = "https://maps.googleapis.com/maps/api/place/details/json?place_id=" + data["placeId"] + "&key=" + data["key"]
            r = requests.get(url)
            output = addTimeAndSummary(r, data["key"], True)
            status = 200
        return Response(output, status=status)

class PlaceAdditionalDetails(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data
        status = 0
        output = {}

        if not (data["name"]):
            status = 201
            output = {"Error" : "Place ID is invalid."}
        else:
            # Retrieving description from Wiki, if present
            name = data["name"]
            formattedName = name.replace(" ", "%20")
            summary = requests.get('http://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=' + formattedName + '&exsentences=3&exlimit=1&explaintext=1&exsectionformat=wiki')
            if len(extract_values(summary.json(), 'extract')) != 0:
                summary = {(extract_values(summary.json(), 'extract'))[0]}
            else:
                summary = "No summary found"

            # Retrieving additional details/reviews from Google.
            id = data["id"]
            additionalDetails = requests.get("https://maps.googleapis.com/maps/api/place/details/json?place_id=" + data["id"] + "&key=" + data["key"])
            
            output = json.loads(additionalDetails.text)["result"]
            output["summary"] = summary

        return Response(output, status=200)

class GooglePhoto(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data
        url = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" + data["photoRef"] + "&key=" + data["key"]
        r = requests.get(url)

        output = ""
        if (r.url):
            output = r.url
        return Response(output, status=200)

# Custom View to Login such that UserID is returned.
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_auth.registration.views import RegisterView

class CustomObtainAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super(CustomObtainAuthToken, self).post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])
        user = User.objects.get(id=token.user_id)
        return Response({'token': token.key, 'id': token.user_id, 'username': user.username})


class CustomRegisterView(RegisterView):
    def create(self, request, *args, **kwargs):
        # Check for existing username
        existingUsername = User.objects.filter(username=request.data["username"])
        if (len(existingUsername) != 0):
            return Response({"error": "Error: Username already exists"}, status=226)

        # Check for existing email
        existingEmail = User.objects.filter(email=request.data["email"])
        if (len(existingEmail) != 0):
            return Response({"error": "Error: Username already exists"}, status=226)

        response = super().create(request, *args, **kwargs)
        return response


