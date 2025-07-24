from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Facturas
from .serializers import FacturaSerializer

class FacturaViewAll(APIView):
    def get(self, request):
        facturas = Facturas.objects.all()
        serializer = FacturaSerializer(facturas, many=True)
        return Response(serializer.data)

class FacturaDetail(APIView):
    def get(self, request, pk):
        try:
            factura = Facturas.objects.get(pk=pk)
            serializer = FacturaSerializer(factura)
            return Response(serializer.data)
        except Facturas.DoesNotExist:
            return Response({'error': 'Factura no encontrada'}, status=404)

class FacturaCreate(APIView):
    def post(sefl, request):
        serializer = FacturaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
class FacturaUpdate(APIView):
    def put(self, request, pk):
        try:
            factura = Facturas.objects.get(pk=pk)
            serializer = FacturaSerializer(factura, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        except Facturas.DoesNotExist:
            return Response({'error': 'Factura no encontrada'}, status=404)

class FacturaDelete(APIView):
    def delete(self, request, pk):
        try:
            factura = Facturas.objects.get(pk=pk)
            factura.delete()
            return Response(status=204)
        except Facturas.DoesNotExist:
            return Response({'error': 'Factura no encontrada'}, status=404)