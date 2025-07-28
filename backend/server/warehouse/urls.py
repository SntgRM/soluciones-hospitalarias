from django.urls import path
from .views import PedidoViewAll, PedidoDetail, PedidoCreate, PedidoUpdate, PedidoDelete, PedidoResumenEstados, PedidosPorEstado, PedidosPorTransportadora, HistorialPedidoView

urlpatterns = [
    path('showall/', PedidoViewAll.as_view(), name='pedido-view-all'),
    path('show/<int:pk>/', PedidoDetail.as_view(), name='pedido-detail'),
    path('create/', PedidoCreate.as_view(), name='pedido-create'),
    path('update/<int:pk>/', PedidoUpdate.as_view(), name='pedido-update'),
    path('delete/<int:pk>/', PedidoDelete.as_view(), name='pedido-delete'),
    path('resumenestados/', PedidoResumenEstados.as_view(), name='pedido-resumen-estados'),
    path('por_estado/<int:id_estado>/', PedidosPorEstado.as_view(), name='pedido-por-estado'),
    path('por_transportadora/<int:id_transportadora>/', PedidosPorTransportadora.as_view(), name='pedido-por-transportadora'),
    path('historial_estados/<int:pk>/', HistorialPedidoView.as_view(), name='pedido-historial-estados'),
    
]