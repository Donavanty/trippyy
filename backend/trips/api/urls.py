from django.urls import path

from .views import CustomRegisterView, UserList, UserDetail, TripList, TripDetail, CustomObtainAuthToken, TextSearch, NextKeySearch, BoundedTextSearch, AlgoOptimize, PlaceDetails, GooglePhoto, PlaceAdditionalDetails

urlpatterns = [
	path('users/', UserList.as_view()),
	path('users/<int:pk>/', UserDetail.as_view()),
	path('trips/', TripList.as_view()),
	path('trips/<int:pk>/', TripDetail.as_view(), name='dispatchhistoryitem'),
	path('authenticate/', CustomObtainAuthToken.as_view()),
	path('register/', CustomRegisterView.as_view()),
	path('TextSearch/', TextSearch.as_view()),
	path('NextKeySearch/', NextKeySearch.as_view()),
	path('BoundedTextSearch/', BoundedTextSearch.as_view()),
	path('algo/', AlgoOptimize.as_view()),
	path('PlaceDetails/', PlaceDetails.as_view()),
	path('GooglePhoto/', GooglePhoto.as_view()),
	path('PlaceAdditionalDetails/', PlaceAdditionalDetails.as_view()),

	]
