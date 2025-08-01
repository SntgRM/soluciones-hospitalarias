from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Pedidos
from .tareas_automaticas.automation import generar_pedidos_si_faltan

@receiver(post_save, sender=Pedidos)
def verificar_pedidos_sin_registro(sender, instance, **kwargs):
    generar_pedidos_si_faltan()