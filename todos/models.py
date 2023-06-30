from django.db import models

# Create your models here.
class Task(models.Model):
    title = models.CharField(max_length = 250, blank = False, null = False)
    completed = models.BooleanField(default = False)