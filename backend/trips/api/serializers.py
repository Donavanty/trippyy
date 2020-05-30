from rest_framework import serializers
from trips.models import Trip
from django.contrib.auth.models import User

class TripSerializer(serializers.ModelSerializer):
	owner = serializers.ReadOnlyField(source='owner.username')
	class Meta:
		model = Trip
		fields = ("owner", "tripName", "destination", "startDate", "endDate")


class UserSerializer(serializers.ModelSerializer):
    trips = serializers.PrimaryKeyRelatedField(many=True, queryset=Trip.objects.all())

    class Meta:
        model = User
        fields = ['id', 'username', 'trips']
		
