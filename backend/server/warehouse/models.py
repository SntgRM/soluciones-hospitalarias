# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Alistadores(models.Model):
    id_alistador = models.AutoField(primary_key=True)
    nombre_alistador = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'alistadores'


class CamposVisiblesEstado(models.Model):
    id_estado = models.ForeignKey('EstadosPedido', models.DO_NOTHING, db_column='id_estado')
    campo = models.CharField(max_length=100)
    requerido = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'campos_visibles_estado'


class Clientes(models.Model):
    id_cliente = models.AutoField(primary_key=True)
    nombre_cliente = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'clientes'


class Empacadores(models.Model):
    id_empacador = models.AutoField(primary_key=True)
    nombre_empacador = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'empacadores'


class Enrutadores(models.Model):
    id_enrutador = models.AutoField(primary_key=True)
    nombre_enrutador = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'enrutadores'

class Transportadoras(models.Model):
    id_transportadora = models.AutoField(primary_key=True)
    nombre_transportadora = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'transportadoras'


class Vendedores(models.Model):
    id_vendedor = models.AutoField(primary_key=True)
    nombre_vendedor = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'vendedores'


class EstadosPedido(models.Model):
    id_estado = models.AutoField(primary_key=True)
    nombre_estado = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'estados_pedido'


class Facturas(models.Model):
    TIPO_RECAUDO_CHOICES = [
        ('Credito', 'Credito'),
        ('Efectivo', 'Efectivo'),
        ('Transferencia', 'Transferencia'),
        ('Efectivo Y Transferencia', 'Efectivo Y Transferencia'),
    ]
    id_factura = models.IntegerField(primary_key=True)
    fecha_recibido = models.DateTimeField(blank=True, null=True)
    valor = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    tipo_recaudo = models.CharField(max_length=24, blank=True, null=True)
    recaudo_efectivo = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    recaudo_transferencia = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    no_caja = models.IntegerField(blank=True, null=True)
    fecha_enrutamiento = models.DateTimeField(blank=True, null=True)
    ubicacion = models.CharField(max_length=255, blank=True, null=True)
    fecha_entrega = models.DateTimeField(blank=True, null=True)
    ciudad = models.CharField(max_length=100, blank=True, null=True)
    observacion = models.TextField(blank=True, null=True)
    id_cliente = models.ForeignKey(Clientes, models.DO_NOTHING, db_column='id_cliente', blank=True, null=True)
    id_vendedor = models.ForeignKey('Vendedores', models.DO_NOTHING, db_column='id_vendedor', blank=True, null=True)
    id_transportadora = models.ForeignKey('Transportadoras', models.DO_NOTHING, db_column='id_transportadora', blank=True, null=True)
    id_estado = models.ForeignKey(EstadosPedido, models.DO_NOTHING, db_column='id_estado', blank=True, null=True)
    id_enrutador = models.ForeignKey(Enrutadores, models.DO_NOTHING, db_column='id_enrutador', blank=True, null=True)
    id_alistador = models.ForeignKey(Alistadores, models.DO_NOTHING, db_column='id_alistador', blank=True, null=True)
    id_empacador = models.ForeignKey(Empacadores, models.DO_NOTHING, db_column='id_empacador', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'facturas'


class HistorialEstados(models.Model):
    id_historial = models.AutoField(primary_key=True)
    id_factura = models.ForeignKey(Facturas, models.DO_NOTHING, db_column='id_factura')
    id_estado = models.ForeignKey(EstadosPedido, models.DO_NOTHING, db_column='id_estado')
    fecha_cambio = models.DateTimeField()
    observacion = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'historial_estados'


