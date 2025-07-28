from rest_framework import serializers
from .models import Pedidos

class PedidoSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.StringRelatedField(source='id_cliente', read_only=True)
    vendedor_nombre = serializers.StringRelatedField(source='id_vendedor', read_only=True)
    transportadora_nombre = serializers.StringRelatedField(source='id_transportadora', read_only=True)
    estado_nombre = serializers.StringRelatedField(source='id_estado', read_only=True)
    enrutador_nombre = serializers.StringRelatedField(source='id_enrutador', read_only=True)
    alistador_nombre = serializers.StringRelatedField(source='id_alistador', read_only=True)
    empacador_nombre = serializers.StringRelatedField(source='id_empacador', read_only=True)

    class Meta:
        model = Pedidos
        fields = '__all__'
        
        