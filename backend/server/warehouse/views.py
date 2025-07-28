from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Pedidos, EstadosPedidos, HistorialEstados
from django.db.models import Count
from django.utils import timezone
from .serializers import PedidoSerializer

# Mostrar todas los pedidos
class PedidoViewAll(APIView):  

    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            pedidos = Pedidos.objects.all()

            if not pedidos.exists():
                return Response(
                    {"mensaje": "No hay pedidos registradas."},
                    status=status.HTTP_204_NO_CONTENT
                )

            serializer = PedidoSerializer(pedidos, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {
                    "error": "Ocurrió un error al obtener los pedidos.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Mostrar los detalles de un pedido específico
class PedidoDetail(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            pedido = Pedidos.objects.get(pk=pk)
            serializer = PedidoSerializer(pedido)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Pedidos.DoesNotExist:
            return Response(
                {'error': 'Pedido no encontrado.'},
                status=status.HTTP_404_NOT_FOUND
            )

        except Exception as e:
            return Response(
                {
                    'error': 'Ocurrió un error al obtener el pedido.',
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Crear un nuevo pedido
class PedidoCreate(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            data = request.data.copy()

            # Si el estado es ALISTAMIENTO (id_estado = 1), se agrega la fecha actual
            if int(data.get("id_estado", 0)) == 6:
                data["fecha_recibido"] = timezone.now()

            serializer = PedidoSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                {
                    'error': 'Ocurrió un error al crear el pedido.',
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Actualizar un pedido según su ID
class PedidoUpdate(APIView):

    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            pedido = Pedidos.objects.get(pk=pk)
            serializer = PedidoSerializer(pedido, data=request.data)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Pedidos.DoesNotExist:
            return Response(
                {'error': 'Pedido no encontrado.'},
                status=status.HTTP_404_NOT_FOUND
            )

        except Exception as e:
            return Response(
                {
                    'error': 'Ocurrió un error al actualizar el pedido.',
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Eliminar un pedido según su ID
class PedidoDelete(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            pedido = Pedidos.objects.get(pk=pk)
            pedido.delete()
            return Response(
                {'mensaje': 'Pedido eliminado correctamente.'},
                status=status.HTTP_204_NO_CONTENT
            )

        except Pedidos.DoesNotExist:
            return Response(
                {'error': 'Pedido no encontrado.'},
                status=status.HTTP_404_NOT_FOUND
            )

        except Exception as e:
            return Response(
                {
                    'error': 'Ocurrió un error al eliminar el pedido.',
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Mostrar el total de pedidos por estado
class PedidoResumenEstados(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Agrupar pedidos por estado
            resumen = Pedidos.objects.values('id_estado').annotate(total=Count('id_estado'))

            if not resumen:
                return Response(
                    {"mensaje": "No hay pedidos registrados."},
                    status=status.HTTP_204_NO_CONTENT
                )

            data = []
            for item in resumen:
                try:
                    estado = EstadosPedidos.objects.get(id_estado=item['id_estado'])
                    data.append({
                        'id_estado': estado.id_estado,
                        'nombre_estado': estado.nombre_estado,
                        'total': item['total']
                    })
                except EstadosPedidos.DoesNotExist:
                    # Estado huérfano: existe en pedidos pero no en tabla de estados
                    data.append({
                        'id_estado': item['id_estado'],
                        'nombre_estado': 'Estado desconocido',
                        'total': item['total']
                    })

            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {
                    "error": "Ocurrió un error inesperado al obtener el resumen de pedidos.",
                    
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Mostrar un pedido por su estado 
class PedidosPorEstado(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, id_estado):
        try:
            # Validar que el estado exista
            estado = EstadosPedidos.objects.filter(id_estado=id_estado).first()
            if not estado:
                return Response(
                    {'error': 'Estado no válido o no existe.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Buscar pedidos con ese estado
            pedidos = Pedidos.objects.filter(id_estado=id_estado)
            if not pedidos.exists():
                return Response(
                    {'mensaje': f'No hay pedidos en el estado: {estado.nombre_estado}'},
                    status=status.HTTP_204_NO_CONTENT
                )

            serializer = PedidoSerializer(pedidos, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': 'Error al obtener pedidos por estado.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Mostrar los pedidos de cada transportador asignado
class PedidosPorTransportadora(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, id_transportadora):
        try:
            pedidos = Pedidos.objects.filter(id_transportadora=id_transportadora)
            if not pedidos.exists():
                return Response(
                    {'mensaje': 'No hay pedidos para esta transportadora.'},
                    status=status.HTTP_204_NO_CONTENT
                )

            serializer = PedidoSerializer(pedidos, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': 'Error al obtener pedidos por transportadora.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Mostrar historial de los estados de un pedido
class HistorialPedidoView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            pedido = Pedidos.objects.get(pk=pk)
            historial = HistorialEstados.objects.filter(id_factura=pedido).order_by('fecha_cambio')

            if not historial.exists():
                return Response(
                    {'mensaje': 'No hay historial de estados para este pedido.'},
                    status=status.HTTP_204_NO_CONTENT
                )

            data = []
            for item in historial:
                data.append({
                    'id_historial': item.id_historial,
                    'id_pedido': item.id_factura.id_factura,
                    'id_estado': item.id_estado.id_estado,
                    'nombre_estado': item.id_estado.nombre_estado,
                    'fecha_cambio': item.fecha_cambio
                })

            return Response(data, status=status.HTTP_200_OK)

        except Pedidos.DoesNotExist:
            return Response(
                {'error': 'Pedido no encontrado.'},
                status=status.HTTP_404_NOT_FOUND
            )

        except Exception as e:
            return Response(
                {'error': 'Error al obtener el historial de estados del pedido.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )