from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from .models import Pedidos, EstadosPedidos, HistorialEstados, Clientes, Alistadores, Empacadores, Enrutadores, Transportadoras, Vendedores
from django.db.models import Count, Q
from django.utils import timezone
from datetime import datetime
from .serializers import PedidoSerializer, ClienteSerializer, AlistadorSerializer, EmpacadorSerializer, EnrutadorSerializer, TransportadoraSerializer, VendedorSerializer, EstadoPedidoSerializer

# Mostrar todas los pedidos
class PedidoViewAll(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request): 
        try:
            search = request.query_params.get('search', '')
            pedidos = Pedidos.objects.all().order_by('-id_factura')

            # --- Filtros permitidos ---
            tipo_recaudo = request.query_params.get('tipo_recaudo')
            fecha_enrutamiento_inicio = request.query_params.get('fecha_enrutamiento_inicio')
            fecha_enrutamiento_fin = request.query_params.get('fecha_enrutamiento_fin')
            fecha_entrega_inicio = request.query_params.get('fecha_entrega_inicio')
            fecha_entrega_fin = request.query_params.get('fecha_entrega_fin')
            fecha_recibido_inicio = request.query_params.get('fecha_inicio')
            fecha_recibido_fin = request.query_params.get('fecha_fin')
            id_vendedor = request.query_params.get('vendedor')
            id_transportadora = request.query_params.get('transportadora')
            id_enrutador = request.query_params.get('enrutador')
            id_alistador = request.query_params.get('alistador')
            id_empacador = request.query_params.get('empacador')

            # Función para parsear fechas
            def parse_date(date_str):
                try:
                    return datetime.strptime(date_str, "%Y-%m-%d").date()
                except:
                    return None

            # Aplicar filtros
            if tipo_recaudo:
                pedidos = pedidos.filter(tipo_recaudo__iexact=tipo_recaudo)
            if id_vendedor:
                pedidos = pedidos.filter(id_vendedor=id_vendedor)
            if id_transportadora:
                pedidos = pedidos.filter(id_transportadora=id_transportadora)
            if id_enrutador:
                pedidos = pedidos.filter(id_enrutador=id_enrutador)
            if id_alistador:
                pedidos = pedidos.filter(id_alistador=id_alistador)
            if id_empacador:
                pedidos = pedidos.filter(id_empacador=id_empacador)

            if fecha_recibido_inicio:
                fi = parse_date(fecha_recibido_inicio)
                if fi:
                    pedidos = pedidos.filter(fecha_recibido__date__gte=fi)
            if fecha_recibido_fin:
                ff = parse_date(fecha_recibido_fin)
                if ff:
                    pedidos = pedidos.filter(fecha_recibido__date__lte=ff)

            if fecha_enrutamiento_inicio:
                fei = parse_date(fecha_enrutamiento_inicio)
                if fei:
                    pedidos = pedidos.filter(fecha_enrutamiento__date__gte=fei)
            if fecha_enrutamiento_fin:
                fef = parse_date(fecha_enrutamiento_fin)
                if fef:
                    pedidos = pedidos.filter(fecha_enrutamiento__date__lte=fef)

            if fecha_entrega_inicio:
                foi = parse_date(fecha_entrega_inicio)
                if foi:
                    pedidos = pedidos.filter(fecha_entrega__date__gte=foi)
            if fecha_entrega_fin:
                fof = parse_date(fecha_entrega_fin)
                if fof:
                    pedidos = pedidos.filter(fecha_entrega__date__lte=fof)

            if search:
                try:
                    pedidos = pedidos.filter(
                        Q(id_factura__istartswith=search) |
                        Q(id_cliente__nombre_cliente__istartswith=search) |  
                        Q(ciudad__istartswith=search) 
                    )
                    
                except Exception as e:
                    return Response({"error": str(e)}, status=40)

            if not pedidos.exists():
                return Response(
                    {"mensaje": "No hay pedidos registrados."},
                    status=status.HTTP_204_NO_CONTENT
                )

            # Configuracion de paginación
            paginator = PaginacionPedido()
            result_page = paginator.paginate_queryset(pedidos, request)

            serializer = PedidoSerializer(result_page, many=True)
            return paginator.get_paginated_response(serializer.data)

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
            pedido = Pedidos.objects.get(id_factura=pk)
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
            search = request.query_params.get('search', '').strip()

            # Validar que el estado exista
            estado = EstadosPedidos.objects.filter(id_estado=id_estado).first()
            if not estado:
                return Response(
                    {'error': 'Estado no válido o no existe.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Base: filtrar por estado primero
            pedidos = Pedidos.objects.filter(id_estado=id_estado).order_by("-id_factura")


            # --- Filtros permitidos ---
            tipo_recaudo = request.query_params.get('tipo_recaudo')
            fecha_enrutamiento_inicio = request.query_params.get('fecha_enrutamiento_inicio')
            fecha_enrutamiento_fin = request.query_params.get('fecha_enrutamiento_fin')
            fecha_entrega_inicio = request.query_params.get('fecha_entrega_inicio')
            fecha_entrega_fin = request.query_params.get('fecha_entrega_fin')
            fecha_recibido_inicio = request.query_params.get('fecha_inicio')
            fecha_recibido_fin = request.query_params.get('fecha_fin')
            id_vendedor = request.query_params.get('vendedor')
            id_transportadora = request.query_params.get('transportadora')
            id_enrutador = request.query_params.get('enrutador')
            id_alistador = request.query_params.get('alistador')
            id_empacador = request.query_params.get('empacador')

            def parse_date(date_str):
                try:
                    return datetime.strptime(date_str, "%Y-%m-%d").date()
                except:
                    return None

            if tipo_recaudo:
                pedidos = pedidos.filter(tipo_recaudo__iexact=tipo_recaudo)
            if id_vendedor:
                pedidos = pedidos.filter(id_vendedor=id_vendedor)
            if id_transportadora:
                pedidos = pedidos.filter(id_transportadora=id_transportadora)
            if id_enrutador:
                pedidos = pedidos.filter(id_enrutador=id_enrutador)
            if id_alistador:
                pedidos = pedidos.filter(id_alistador=id_alistador)
            if id_empacador:
                pedidos = pedidos.filter(id_empacador=id_empacador)

            if fecha_recibido_inicio:
                fi = parse_date(fecha_recibido_inicio)
                if fi:
                    pedidos = pedidos.filter(fecha_recibido__date__gte=fi)
            if fecha_recibido_fin:
                ff = parse_date(fecha_recibido_fin)
                if ff:
                    pedidos = pedidos.filter(fecha_recibido__date__lte=ff)

            if fecha_enrutamiento_inicio:
                fei = parse_date(fecha_enrutamiento_inicio)
                if fei:
                    pedidos = pedidos.filter(fecha_enrutamiento__date__gte=fei)
            if fecha_enrutamiento_fin:
                fef = parse_date(fecha_enrutamiento_fin)
                if fef:
                    pedidos = pedidos.filter(fecha_enrutamiento__date__lte=fef)

            if fecha_entrega_inicio:
                foi = parse_date(fecha_entrega_inicio)
                if foi:
                    pedidos = pedidos.filter(fecha_entrega__date__gte=foi)
            if fecha_entrega_fin:
                fof = parse_date(fecha_entrega_fin)
                if fof:
                    pedidos = pedidos.filter(fecha_entrega__date__lte=fof)

            # Luego aplicar búsqueda si hay texto
            if search:
                pedidos = pedidos.filter(
                    Q(id_factura__istartswith=search) |
                    Q(id_cliente__nombre_cliente__istartswith=search) |
                    Q(ciudad__istartswith=search)
                )

            # Verificar si hay resultados
            if not pedidos.exists():
                return Response(
                    {'mensaje': f'No hay pedidos encontrados para este estado con ese criterio.'},
                    status=status.HTTP_204_NO_CONTENT
                )

            # Paginación y serialización
            paginator = PaginacionPedido()
            result_page = paginator.paginate_queryset(pedidos, request)
            serializer = PedidoSerializer(result_page, many=True)
            return paginator.get_paginated_response(serializer.data)

        except Exception as e:
            return Response(
                {'error': 'Error al obtener pedidos por transportadora.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            

# Mostrar los pedidos de cada transportador asignado
class PedidosPorTransportadora(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id_transportadora):
        try:
            # Obtener parámetros de búsqueda y paginación
            search = request.query_params.get('search', '')
            
            # Filtrar pedidos por transportadora
            pedidos = Pedidos.objects.filter(id_transportadora=id_transportadora).order_by('-id_factura')
            
            # Aplicar búsqueda por factura si existe
            if search:
                pedidos = pedidos.filter(
                    Q(id_factura__istartswith=search) 
                )
            
            if not pedidos.exists():
                return Response(
                    {'mensaje': 'No hay pedidos para esta transportadora.'},
                    status=status.HTTP_204_NO_CONTENT
                )
            
            # Paginación
            paginator = PaginacionPedido()
            result_page = paginator.paginate_queryset(pedidos, request)
            
            serializer = PedidoSerializer(result_page, many=True)
            return paginator.get_paginated_response(serializer.data)    

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
        

class HistorialGeneralView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            historial = HistorialEstados.objects.select_related('id_factura', 'id_estado').order_by('-fecha_cambio')

            if not historial.exists():
                return Response([], status=status.HTTP_200_OK)
                

            data = []
            for item in historial:
                data.append({
                    'id_historial': item.id_historial,
                    'id_pedido': item.id_factura.id_factura,
                    'id_estado': item.id_estado.id_estado,
                    'nombre_estado': item.id_estado.nombre_estado,
                    'fecha_cambio': item.fecha_cambio,
                    'observacion': item.observacion
                })

            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': 'Error al obtener el historial general.', 'detalle': str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class LimpiarPedido(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            pedido = Pedidos.objects.filter(id_factura=pk).first()
            if not pedido:
                return Response({'error': 'Pedido no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

            pedido.valor = None
            pedido.tipo_recaudo = None
            pedido.recaudo_efectivo = None
            pedido.recaudo_transferencia = None
            pedido.no_caja = None
            pedido.fecha_enrutamiento = None
            pedido.fecha_entrega = None
            pedido.fecha_recibido = None
            pedido.ubicacion = None
            pedido.observacion = None
            pedido.id_cliente = None
            pedido.id_vendedor = None
            pedido.id_transportadora = None
            pedido.id_estado = None
            pedido.id_enrutador = None
            pedido.id_alistador = None
            pedido.id_empacador = None

            pedido.save()

            return Response({'mensaje': 'Pedido limpiado exitosamente.'}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': 'Ocurrió un error al limpiar el pedido.', 'detalle': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PaginacionPedido(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'


    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })

# --------------------------------------------------------------------------------------------------------

class ClientesView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            search = request.query_params.get('search', '')
            clientes = Clientes.objects.all().order_by('id_cliente')

            if search:
                clientes = clientes.filter(nombre_cliente__icontains=search)

            if not clientes.exists():
                return Response(
                    {"mensaje": "No hay clientes registrados."},
                    status=status.HTTP_204_NO_CONTENT
                )
        
            serializer = ClienteSerializer(clientes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {
                    "error": "Ocurrió un error al obtener los clientes.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ClienteCreate(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            serializer = ClienteSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                {
                    'error': 'Ocurrió un error al crear el cliente.',
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# --------------------------------------------------------------------------------------------------------

class AlistadoresView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            search = request.query_params.get('search', '')
            alistadores = Alistadores.objects.all().order_by('id_alistador')

            if search:
                alistadores = alistadores.filter(nombre_alistador__icontains=search)

            alistadores = Alistadores.objects.all().order_by('id_alistador')
            if not alistadores.exists():
                return Response(
                    {"mensaje": "No hay alistadores registrados."},
                    status=status.HTTP_204_NO_CONTENT
                )
        
            serializer = AlistadorSerializer(alistadores, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {
                    "error": "Ocurrió un error al obtener los alistadores.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class AlistadorCreate(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            serializer = AlistadorSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                {
                    'error': 'Ocurrió un error al crear el alistador.',
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# --------------------------------------------------------------------------------------------------------

class EmpacadoresView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            search = request.query_params.get('search', '')
            empacadores = Empacadores.objects.all().order_by('id_empacador')

            if search:
                empacadores = empacadores.filter(nombre_empacador__icontains=search)

            empacadores = Empacadores.objects.all().order_by('id_empacador')
            if not empacadores.exists():
                return Response(
                    {"mensaje": "No hay empacadores registrados."},
                    status=status.HTTP_204_NO_CONTENT
                )
        
            serializer = EmpacadorSerializer(empacadores, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {
                    "error": "Ocurrió un error al obtener los empacadores.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class EmpacadorCreate(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            serializer = EmpacadorSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                {
                    'error': 'Ocurrió un error al crear el empacador.',
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# --------------------------------------------------------------------------------------------------------

class EnrutadoresView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            search = request.query_params.get('search', '')
            enrutadores = Enrutadores.objects.all().order_by('id_enrutador')

            if search:
                enrutadores = enrutadores.filter(nombre_enrutador__icontains=search)

            if not enrutadores.exists():
                return Response({"mensaje": "No hay enrutadores registrados."}, status=status.HTTP_204_NO_CONTENT)

            serializer = EnrutadorSerializer(enrutadores, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": "Ocurrió un error al obtener los enrutadores."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EnrutadorCreate(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            serializer = EnrutadorSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                {
                    'error': 'Ocurrió un error al crear el enrutador.',
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# --------------------------------------------------------------------------------------------------------

class TransportadorasView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            search = request.query_params.get('search', '')
            transportadoras = Transportadoras.objects.all().annotate(total=Count('pedidos'))

            if search:
                transportadoras = transportadoras.filter(
                    Q(id_transportadora__id_factura__istartswith=search) |
                    Q(nombre_transportadora__istartswith=search) 
                    
                    )

            if not transportadoras.exists():
                return Response({"mensaje": "No hay transportadoras registradas."}, status=status.HTTP_204_NO_CONTENT)

            serializer = TransportadoraSerializer(transportadoras, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": "Ocurrió un error al obtener las transportadoras."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class TransportadoraCreate(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            serializer = TransportadoraSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                {
                    'error': 'Ocurrió un error al crear el enrutador.',
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# --------------------------------------------------------------------------------------------------------

class VendedoresView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            vendedores = Vendedores.objects.all().order_by('id_vendedor')
            if not vendedores.exists():
                return Response(
                    {"mensaje": "No hay vendedores registrados."},
                    status=status.HTTP_204_NO_CONTENT
                )
        
            serializer = VendedorSerializer(vendedores, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {
                    "error": "Ocurrió un error al obtener los vendedores.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class VendedorCreate(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            serializer = VendedorSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                {
                    'error': 'Ocurrió un error al crear el vendedor.',
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# --------------------------------------------------------------------------------------------------------

class EstadosView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            estados = EstadosPedidos.objects.all().order_by('id_estado')
            serializer = EstadoPedidoSerializer(estados, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Error al obtener estados'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class FilterOptionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            vendedores = [
                {"value": v.id_vendedor, "label": v.nombre_vendedor}
                for v in Vendedores.objects.all()
            ]
            transportadoras = [
                {"value": t.id_transportadora, "label": t.nombre_transportadora}
                for t in Transportadoras.objects.all()
            ]
            enrutadores = [
                {"value": e.id_enrutador, "label": e.nombre_enrutador}
                for e in Enrutadores.objects.all()
            ]
            alistadores = [
                {"value": a.id_alistador, "label": a.nombre_alistador}
                for a in Alistadores.objects.all()
            ]
            empacadores = [
                {"value": e.id_empacador, "label": e.nombre_empacador}
                for e in Empacadores.objects.all()
            ]

            tipos_recaudo = [
                {"value": "efectivo", "label": "Efectivo"},
                {"value": "transferencia", "label": "Transferencia"},
                {"value": "efectivo y transferencia", "label": "Efectivo y Transferencia"},
            ]

            return Response({
                "vendedores": vendedores,
                "transportadoras": transportadoras,
                "enrutadores": enrutadores,
                "alistadores": alistadores,
                "empacadores": empacadores,
                "tipos_recaudo": tipos_recaudo
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)