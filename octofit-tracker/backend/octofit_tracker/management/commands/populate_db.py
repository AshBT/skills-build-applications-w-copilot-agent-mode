from django.core.management.base import BaseCommand
from octofit_tracker import models

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        # Delete all data (Djongo-compatible deletion)
        try:
            models.Activity.objects.all().delete()
            models.Workout.objects.all().delete()
            models.Leaderboard.objects.all().delete()
            models.User.objects.all().delete()
            models.Team.objects.all().delete()
        except Exception as e:
            self.stdout.write(f'Deletion note: {e}')

        # Create teams
        marvel = models.Team.objects.create(name='Marvel')
        dc = models.Team.objects.create(name='DC')

        # Create users
        tony = models.User.objects.create(name='Tony Stark', email='tony@marvel.com', team=marvel)
        steve = models.User.objects.create(name='Steve Rogers', email='steve@marvel.com', team=marvel)
        bruce = models.User.objects.create(name='Bruce Wayne', email='bruce@dc.com', team=dc)
        clark = models.User.objects.create(name='Clark Kent', email='clark@dc.com', team=dc)

        # Create activities
        models.Activity.objects.create(user=tony, type='Run', duration=30)
        models.Activity.objects.create(user=steve, type='Swim', duration=45)
        models.Activity.objects.create(user=bruce, type='Cycle', duration=60)
        models.Activity.objects.create(user=clark, type='Run', duration=50)

        # Create workouts
        models.Workout.objects.create(user=tony, description='Chest day', duration=60)
        models.Workout.objects.create(user=steve, description='Leg day', duration=50)
        models.Workout.objects.create(user=bruce, description='Cardio', duration=40)
        models.Workout.objects.create(user=clark, description='Strength', duration=70)

        # Create leaderboard
        models.Leaderboard.objects.create(user=tony, score=100)
        models.Leaderboard.objects.create(user=steve, score=90)
        models.Leaderboard.objects.create(user=bruce, score=95)
        models.Leaderboard.objects.create(user=clark, score=98)

        self.stdout.write(self.style.SUCCESS('Database populated with test data.'))
        return
