from django.db import models

class Books(models.Model):
    ISBNNo = models.IntegerField();
    Title = models.CharField();
    Quantity = models.IntegerField();
    Price = models.FloatField();

class Users(models.Model):
    UserID = models.IntegerField();
    UserName = models.CharField();
    UserPassword = models.CharField();
    UserTypeSeller = models.BooleanField();
