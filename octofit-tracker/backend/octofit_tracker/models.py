
from djongo import models


class Team(models.Model):
    id = models.ObjectIdField(primary_key=True, editable=False)
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class User(models.Model):
    id = models.ObjectIdField(primary_key=True, editable=False)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='members')

    def __str__(self):
        return self.name


class Activity(models.Model):
    id = models.ObjectIdField(primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    type = models.CharField(max_length=50)
    duration = models.PositiveIntegerField(help_text='Duration in minutes')
    timestamp = models.DateTimeField(auto_now_add=True)


class Workout(models.Model):
    id = models.ObjectIdField(primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='workouts')
    description = models.CharField(max_length=200)
    duration = models.PositiveIntegerField(help_text='Duration in minutes')
    timestamp = models.DateTimeField(auto_now_add=True)


class Leaderboard(models.Model):
    id = models.ObjectIdField(primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='leaderboard_entries')
    score = models.PositiveIntegerField()
    updated_at = models.DateTimeField(auto_now=True)
