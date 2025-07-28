from django.contrib.auth.models import AbstractUser
from django.db import models
import os
from django.conf import settings

def user_image_path(instance, filename):
    ext = filename.split('.')[-1]
    if instance.id:
        filename = f'user_{instance.id}.{ext}'
    else:
        filename = f'user_temp.{ext}'
    return os.path.join('users/profile_images/', filename)

class User(AbstractUser):
    ROLES = (
        ('administrador', 'Administrador'),
        ('bodega', 'Bodega'),
        ('ventas', 'Ventas'),
    )

    role = models.CharField(max_length=20, choices=ROLES, default='bodega')
    profile_image = models.ImageField(
        upload_to=user_image_path,
        null=True,
        blank=True,
        help_text='Imagen de perfil del usuario'
    )

    def delete(self, *args, **kwargs):
        if self.profile_image and os.path.isfile(self.profile_image.path):
            os.remove(self.profile_image.path)
        super().delete(*args, **kwargs)

    def save(self, *args, **kwargs):
        if self.pk:
            try:
                old_user = User.objects.get(pk=self.pk)
                if (
                    old_user.profile_image and
                    old_user.profile_image != self.profile_image and
                    os.path.isfile(old_user.profile_image.path)
                ):
                    os.remove(old_user.profile_image.path)
            except User.DoesNotExist:
                pass

        super().save(*args, **kwargs)

        if self.profile_image:
            ext = self.profile_image.name.split('.')[-1]
            correct_filename = f'user_{self.id}.{ext}'
            correct_path = os.path.join('users/profile_images/', correct_filename)
            full_old_path = os.path.join(settings.MEDIA_ROOT, self.profile_image.name)
            full_new_path = os.path.join(settings.MEDIA_ROOT, correct_path)

            if self.profile_image.name != correct_path:
                if os.path.exists(full_new_path):
                    os.remove(full_new_path)

                os.rename(full_old_path, full_new_path)
                self.profile_image.name = correct_path
                super().save(update_fields=['profile_image'])