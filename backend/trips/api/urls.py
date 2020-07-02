from django.urls import path

from .views import UserList, UserDetail, TripList, TripDetail, CustomObtainAuthToken, TextSearch, NextKeySearch, BoundedTextSearch, AlgoOptimize, GooglePhoto

urlpatterns = [
	path('users/', UserList.as_view()),
	path('users/<int:pk>/', UserDetail.as_view()),
	path('trips/', TripList.as_view()),
	path('trips/<int:pk>', TripDetail.as_view()),
	path('authenticate/', CustomObtainAuthToken.as_view()),
	path('TextSearch/', TextSearch.as_view()),
	path('NextKeySearch/', NextKeySearch.as_view()),
	path('BoundedTextSearch/', BoundedTextSearch.as_view()),
	path('algo/', AlgoOptimize.as_view()),
	path('GooglePhoto/', GooglePhoto.as_view()),
	]
