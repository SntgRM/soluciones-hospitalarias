from django.urls import path
from .views import FacturaViewAll, FacturaDetail, FacturaCreate, FacturaUpdate, FacturaDelete

urlpatterns = [
    path('showall/', FacturaViewAll.as_view(), name='factura-view-all'),
    path('show/<int:pk>/', FacturaDetail.as_view(), name='factura-detail'),
    path('create/', FacturaCreate.as_view(), name='factura-create'),
    path('update/<int:pk>/', FacturaUpdate.as_view(), name='factura-update'),
    path('delete/<int:pk>/', FacturaDelete.as_view(), name='factura-delete'),
    
]