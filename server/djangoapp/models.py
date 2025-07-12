from django.db import models
from django.utils.timezone import now
from django.core.validators import MaxValueValidator, MinValueValidator

class CarMake(models.Model):
    name = models.CharField(null=False, max_length=100)
    description = models.TextField()

    def __str__(self):
        return f"Car Make: {self.name}"

class CarModel(models.Model):
    SEDAN = 'Sedan'
    SUV = 'SUV'
    WAGON = 'Wagon'
    HATCHBACK = 'Hatchback'
    COUPE = 'Coupe'

    CAR_TYPES = [
        (SEDAN, 'Sedan'),
        (SUV, 'SUV'),
        (WAGON, 'Wagon'),
        (HATCHBACK, 'Hatchback'),
        (COUPE, 'Coupe'),
    ]

    car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE)
    name = models.CharField(null=False, max_length=100)
    type = models.CharField(max_length=10, choices=CAR_TYPES, default=SEDAN)
    year = models.IntegerField(
        validators=[MinValueValidator(2015), MaxValueValidator(2023)],
        default=2020
    )
    created_date = models.DateField(default=now)

    def __str__(self):
        return f"{self.car_make.name} {self.name} ({self.type}, {self.year})"
