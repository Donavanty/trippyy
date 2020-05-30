from django.db import models

class Trip(models.Model):
	owner = models.ForeignKey('auth.User', related_name='trips', on_delete=models.CASCADE)
	tripName = models.CharField(max_length=120)
	destination = models.CharField(max_length=120)
	startDate = models.DateField()
	endDate = models.DateField()

	def __str__(self):
		return self.tripName

class Activity(models.Model):
	trip = models.ForeignKey(Trip, related_name='activities', on_delete=models.CASCADE)
	activityName = models.CharField(max_length=240)
	summary = models.TextField()
	recommendedTime = models.PositiveIntegerField()
	address = models.TextField()
	picture = models.URLField() 
	affliates = models.TextField() #To map to another class
	longi = models.DecimalField(max_digits=20, decimal_places=15)
	lati = models.DecimalField(max_digits=20, decimal_places=15)

	def __str__(self):
		return self.activityName


