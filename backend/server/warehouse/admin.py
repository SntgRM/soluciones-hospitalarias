from django.contrib import admin
from .models import Alistadores, Clientes, Empacadores, Enrutadores, Transportadoras, Vendedores, EstadosPedidos, Pedidos, HistorialEstados

admin.site.register(Alistadores)
admin.site.register(Clientes)
admin.site.register(Empacadores)
admin.site.register(Enrutadores)
admin.site.register(Transportadoras)
admin.site.register(Vendedores)
admin.site.register(EstadosPedidos)
admin.site.register(Pedidos)
admin.site.register(HistorialEstados)


