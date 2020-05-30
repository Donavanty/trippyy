from rest_framework import permissions
from rest_framework.authtoken.models import Token

class UserIsOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    #obj = Current User Object, request.auth = Token, user = user derived from token
    def has_object_permission(self, request, view, obj):
    	try:
    		user = Token.objects.get(key=request.auth).user
    		return obj == user
    	except Token.DoesNotExist:
    		return False
        

class TripIsOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    #obj = Current User Object, request.auth = Token, user = user derived from token
    def has_object_permission(self, request, view, obj):
    	try:
    		user = Token.objects.get(key=request.auth).user
    		return obj.owner == user
    	except Token.DoesNotExist:
    		return False