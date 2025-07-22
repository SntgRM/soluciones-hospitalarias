from django.contrib import admin
from .models import Alistadores, CamposVisiblesEstado, Clientes, Empacadores, Enrutadores, Transportadoras, Vendedores, EstadosPedido, Facturas, HistorialEstados

admin.site.register(Alistadores)
admin.site.register(CamposVisiblesEstado)
admin.site.register(Clientes)
admin.site.register(Empacadores)
admin.site.register(Enrutadores)
admin.site.register(Transportadoras)
admin.site.register(Vendedores)
admin.site.register(EstadosPedido)
admin.site.register(Facturas)
admin.site.register(HistorialEstados)


