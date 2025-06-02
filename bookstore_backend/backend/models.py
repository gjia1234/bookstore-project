from django.db import models
from django.core.validators import RegexValidator


class Books(models.Model):
    ISBNNo = models.CharField(
        primary_key=True,
        max_length=13,
        validators=[
            RegexValidator(regex=r'^\d{13}$', message="ISBN must be exactly 13 digits.")
        ],
        unique=True
    )
    Title = models.CharField()
    Quantity = models.IntegerField()
    Price = models.FloatField()

class Users(models.Model):
    UserID = models.IntegerField()
    UserName = models.CharField()
    UserPassword = models.CharField()
    UserTypeSeller = models.BooleanField()
