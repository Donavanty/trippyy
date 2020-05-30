from django.urls import path

from .views import UserList, UserDetail, TripList, TripDetail, CustomObtainAuthToken

urlpatterns = [
	path('users/', UserList.as_view()),
	path('users/<int:pk>/', UserDetail.as_view()),
	path('trips/', TripList.as_view()),
	path('trips/<int:pk>', TripDetail.as_view()),
	path('authenticate/', CustomObtainAuthToken.as_view()),
	]
