from warehouse.models import Pedidos, EstadosPedidos, Clientes, Vendedores, Transportadoras, Enrutadores, Alistadores, Empacadores
from django.db.models import Max
from datetime import datetime

def generar_pedidos_si_faltan():
    try:
        estado_sin_registro = EstadosPedidos.objects.filter(nombre_estado__icontains="SIN REGISTRO").first()
        cliente = Clientes.objects.get(id_cliente=83)
        vendedor = Vendedores.objects.get(id_vendedor=1)
        transportadora = Transportadoras.objects.get(id_transportadora=9)
        enrutador = Enrutadores.objects.get(id_enrutador=1)
        alistador = Alistadores.objects.get(id_alistador=9)
        empacador = Empacadores.objects.get(id_empacador=8)

    except Exception as e:
        print(f"❌ Error al buscar alguna de las instancias relacionadas: {e}")
        return

    pedidos_existentes = Pedidos.objects.filter(id_estado=estado_sin_registro).count()

    if pedidos_existentes < 100:
        ultimo_id = Pedidos.objects.aggregate(ultimo=Max('id_factura'))['ultimo'] or 0
        fecha_falsa = datetime(2000, 1, 1)  
        nuevos_pedidos = [
            Pedidos(
                id_factura=ultimo_id + i,
                id_cliente=cliente,
                id_vendedor=vendedor,
                id_transportadora=transportadora,
                id_estado=estado_sin_registro,
                id_enrutador=enrutador,
                id_alistador=alistador,
                id_empacador=empacador,
                fecha_recibido=fecha_falsa,
                fecha_enrutamiento=fecha_falsa,
                fecha_entrega=fecha_falsa,
                valor="0.00",
                tipo_recaudo="sin registro",
                recaudo_efectivo="0.00",
                recaudo_transferencia="0.00",
                no_caja=1,
                ciudad="SIN REGISTRO",
                observacion=None,
                ubicacion=None
                )
            for i in range(1, 1001)
        ]
        Pedidos.objects.bulk_create(nuevos_pedidos)
        print("✅ Se crearon 1000 pedidos con estado 'SIN REGISTRO'.")
    else:
        print("⚠️ Hay 100 o más pedidos con ese estado. No se creó nada.")