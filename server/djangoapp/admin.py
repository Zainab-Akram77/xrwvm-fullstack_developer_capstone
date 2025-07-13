from django.contrib import admin
from .models import CarMake, CarModel


# Registering zzz models with their respective admins
admin.site.register(CarMake)
admin.site.register(CarModel)
