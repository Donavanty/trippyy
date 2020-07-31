from django.db import models
from trips.customModel import JSONField


class Trip(models.Model):
	owner = models.ForeignKey('auth.User', related_name='trips', on_delete=models.CASCADE)
	tripName = models.CharField(max_length=120)
	destination = models.CharField(max_length=120)
	startDate = models.DateField()
	endDate = models.DateField()
	info = JSONField(null=True, blank=True)

	def __str__(self):
		return self.tripName

class Activity(models.Model):
	trip = models.ForeignKey(Trip, related_name='activities', on_delete=models.CASCADE)
	info = JSONField(null=True, blank=True)

	def __str__(self):
		return self.activityName


