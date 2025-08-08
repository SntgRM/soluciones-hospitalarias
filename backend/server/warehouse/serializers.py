from rest_framework import serializers
from .models import Pedidos, EstadosPedidos, Clientes, Alistadores, Empacadores, Enrutadores, Transportadoras, Vendedores, Pqrs

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

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clientes
        fields = '__all__'


class AlistadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alistadores
        fields = '__all__'

class EmpacadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empacadores
        fields = '__all__'

class EnrutadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrutadores
        fields = '__all__'

class TransportadoraSerializer(serializers.ModelSerializer):
    total = serializers.IntegerField()
    class Meta:
        model = Transportadoras
        fields = '__all__'

class VendedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendedores
        fields = '__all__'

class EstadoPedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadosPedidos
        fields = '__all__'

class PqrsSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.StringRelatedField(source='id_cliente', read_only=True)
    vendedor_nombre = serializers.StringRelatedField(source='id_vendedor', read_only=True)
    
    class Meta:
        model = Pqrs
        fields = '__all__'     
        