import json 
import requests
from heapdict import heapdict
from .activity import Activity

# LOADING DATA FROM DATA.JSON --------------------------------------------
# f = open('phuketData.json',) 
# data = json.load(f) 
# data = data["places"]
# days = 15
# LOADING DATA FROM DATA.JSON --------------------------------------------

def optimize(data, days):
	# array of lng-lats, used for API call
	lngLats = []

	# activities, used for algo.
	activities = []

	# ----------------------------- UTILITY FUNCTIONS ------------------------------------------
	def getLnglat(place):
		return [place["geometry"]["location"]["lng"], place["geometry"]["location"]["lat"]]

	def checkIfIn(output, activity):
		for day in output:
			if (activity in day):
				return True
		return False
	# _______________________________________________________________________________________

	# Generating lngLats used for API call, and appending geoId to data, wrapping each place into activities
	counter = 0
	for place in data:
		lngLats.append(getLnglat(place))
		place["geoId"] = counter
		counter += 1

		activities.append(Activity(place))

	# API call ------------------------------------------------------------------------------
	headers = {
	    'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
	    'Authorization': '5b3ce3597851110001cf624870c65a431d8b417098320ba07e09c595',
	    'Content-Type': 'application/json; charset=utf-8'
	}
	body = {
		'locations':lngLats
	}
	call = requests.post('https://api.openrouteservice.org/v2/matrix/driving-car', json=body, headers=headers)
	timeMatrix = json.loads(call.text)
	# _______________________________________________________________________________________

	# Prims algo start ------------------------------------------------------------------------
	pq = heapdict()
	total_time = 0

	# Initialize priority queue, add all items into pq with priority infinite
	for activity in activities:
		pq[activity] = float('inf')
		total_time += activity.data["recommendedTime"]

	# Initialize start
	pq[activities[0]] = 0

	# Initialize output array
	output = []
	for i in range(0, days):
		output.append([0])

	# Calculate max & min duration of total activities per day
	minTimePerDay = max(119, (total_time / days) - 90)
	maxTimePerDay = max(480, (total_time / days) + 180)
	dayCounter = 0
	print("Min Time: " + str(minTimePerDay/60))
	print("Max Time: " + str(maxTimePerDay/60))

	while pq:
		currentQueueItem = pq.popitem()
		currentActivity = currentQueueItem[0]

		# If duration for the day exceeded minimum time already, move day counter on
		if ((output[dayCounter][0] > minTimePerDay) and (dayCounter < (days - 1))):
			dayCounter += 1

		# 1. If current day is below minimum limit,
		# 2. check if the addition of activity will exceed the maximum limit
		# 3. If it doesnt exceed, then just add item.
		# ELSE: just move the day counter on to next day
		# EXCEPTION: if alr on last day, just keep adding lel.
		activityAdded = False
		tempDayCounter = dayCounter
		while not (activityAdded):
			newTotalDuration = currentActivity.data["recommendedTime"] + output[tempDayCounter][0]
			if (output[tempDayCounter][0] > minTimePerDay and (dayCounter < (days-1)) and tempDayCounter < (days-1)):
				tempDayCounter += 1
			else:
				if ((newTotalDuration < maxTimePerDay) or (tempDayCounter == (days-1))):
					output[tempDayCounter].append(currentActivity)
					output[tempDayCounter][0] = newTotalDuration
					activityAdded = True
				else:
					tempDayCounter += 1


		# Add the activity with smallest edge weight in pq into output
		for activity in activities:
			if not (checkIfIn(output, activity)):
				duration = timeMatrix["durations"][activity.data["geoId"]][currentActivity.data["geoId"]]
				# Check if weight lesser
				if (duration < pq[activity]):
					pq[activity] = duration

	count = 1
	for i in range(0, len(output)):
		print ("DAY: " + str(count) + " ------------------------------------------------------ ")
		print("Total Duration (hrs): " + str(output[i][0]/60))
		for j in range(1, len(output[i])):
			print(output[i][j].data["name"])
			output[i][j] = output[i][j].toJson()
		count += 1
	return json.dumps(output)
	# return "{}"




