from django.contrib.auth.models import AbstractUser
from django.db import models
import os

def user_image_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'user_{instance.id}.{ext}'
    return os.path.join('users/profile_images/', filename)

class User(AbstractUser):
    ROLES = (
        ('administrador', 'Administrador'),
        ('bodega', 'Bodega'),
        ('ventas', 'Ventas'),
    )

    role = models.CharField(max_length=20, choices=ROLES, default='bodega')
    profile_image = models.ImageField(upload_to = user_image_path, null = True, blank = True, help_text='Imagen de perfil del usuario')

    def delete(self, *args, **kwargs):
        if self.profile_image:
            if os.path.isfile(self.profile_image.path):
                os.remove(self.profile_image.path)
        super().delete(*args, **kwargs)

    def save(self, *args, **kwargs):
        if self.pk:
            try:
                old_user = User.objects.get(pk=self.pk)
                if old_user.profile_image and old_user.profile_image != self.profile_image:
                    if os.path.isfile(old_user.profile_image.path):
                        os.remove(old_user.profile_image.path)
            except User.DoesNotExist:
                pass
        super().save(*args, **kwargs)