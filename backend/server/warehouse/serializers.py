from rest_framework import serializers
from .models import Pedidos

class PedidoSerializer(serializers.ModelSerializer):
    id_cliente = serializers.StringRelatedField()
    id_vendedor = serializers.StringRelatedField()
    id_transportadora = serializers.StringRelatedField()
    id_estado = serializers.StringRelatedField()
    id_enrutador = serializers.StringRelatedField()
    id_alistador = serializers.StringRelatedField()
    id_empacador = serializers.StringRelatedField()

    class Meta:
        model = Pedidos
        fields = '__all__'
        
        