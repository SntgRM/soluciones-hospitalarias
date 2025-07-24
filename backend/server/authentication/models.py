from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLES = (
        ('administrador', 'Administrador'),
        ('bodega', 'Bodega'),
        ('ventas', 'Ventas'),
    )

    role = models.CharField(max_length=20, choices=ROLES, default='bodega')