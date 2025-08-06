from django.urls import path
from .views import PedidoViewAll, PedidoDetail, PedidoCreate, PedidoUpdate, PedidoDelete, PedidoResumenEstados, PedidosPorEstado, PedidosPorTransportadora, HistorialPedidoView, LimpiarPedido
from .views import HistorialGeneralView
from .views import ClientesView, ClienteCreate
from .views import AlistadoresView, AlistadorCreate
from .views import EmpacadoresView, EmpacadorCreate 
from .views import EnrutadoresView, EnrutadorCreate
from .views import TransportadorasView, TransportadoraCreate
from .views import VendedoresView, VendedorCreate
from .views import EstadosView

urlpatterns = [
    # Pedidos URLs
    path('showall/', PedidoViewAll.as_view(), name='pedido-view-all'),
    path('show/<int:pk>/', PedidoDetail.as_view(), name='pedido-detail'),
    path('create/', PedidoCreate.as_view(), name='pedido-create'),
    path('update/<int:pk>/', PedidoUpdate.as_view(), name='pedido-update'),
    path('delete/<int:pk>/', PedidoDelete.as_view(), name='pedido-delete'),
    path('resumenestados/', PedidoResumenEstados.as_view(), name='pedido-resumen-estados'),
    path('por_estado/<int:id_estado>/', PedidosPorEstado.as_view(), name='pedido-por-estado'),
    path('por_transportadora/<int:id_transportadora>/', PedidosPorTransportadora.as_view(), name='pedido-por-transportadora'),
    path('historial_estados/<int:pk>/', HistorialPedidoView.as_view(), name='pedido-historial-estados'),
    path('limpiar_pedido/<int:pk>/', LimpiarPedido.as_view(), name='pedido-limpiar'),
    path('historial_general/', HistorialGeneralView.as_view(), name='historial-general'),

    # Clientes URLs
    path('clientesall/', ClientesView.as_view(), name='clientes-view'),
    path('clientescreate/', ClienteCreate.as_view(), name='cliente-create'),

    # Alistadores URLs
    path('alistadoresview/', AlistadoresView.as_view(), name='alistadores-view'),
    path('alistadorescreate/', AlistadorCreate.as_view(), name='alistador-create'),

    # Empacadores URLs
    path('empacadoresview/', EmpacadoresView.as_view(), name='empacadores-view'),
    path('empacadorescreate/', EmpacadorCreate.as_view(), name='empacador-create'),

    # Enrutadores URLs
    path('enrutadoresview/', EnrutadoresView.as_view(), name='enrutadores-view'),
    path('enrutadorescreate/', EnrutadorCreate.as_view(), name='enrutador-create'),

    # Transportadoras URLs
    path('transportadorasview/', TransportadorasView.as_view(), name='transportadoras-view'),
    path('transportadorascreate/', TransportadoraCreate.as_view(), name='transportadora-create'),

    # Vendedores URLs
    path('vendedoresview/', VendedoresView.as_view(), name='vendedores-view'),
    path('vendedorescreate/', VendedorCreate.as_view(), name='vendedor-create'),

    # Estados URLs
    path('estadosview/', EstadosView.as_view(), name='estados-view')

]