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
        db_table = 'alistadores'
        verbose_name = "Alistador"
        verbose_name_plural = "Alistadores"
    
    def __str__(self):
        return self.nombre_alistador


class CamposVisiblesEstado(models.Model):
    id_estado = models.ForeignKey('EstadosPedido', models.DO_NOTHING, db_column='id_estado')
    campo = models.CharField(max_length=100)
    requerido = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'campos_visibles_estado'

    def __str__(self):
        return f"{self.campo} (Estado: {self.id_estado})"


class Clientes(models.Model):
    id_cliente = models.AutoField(primary_key=True)
    nombre_cliente = models.CharField(max_length=255)

    class Meta:
        db_table = 'clientes'
        verbose_name = "Cliente"
        verbose_name_plural = "Clientes"

    def __str__(self):
        return self.nombre_cliente

class Empacadores(models.Model):
    id_empacador = models.AutoField(primary_key=True)
    nombre_empacador = models.CharField(max_length=100)

    class Meta:
        db_table = 'empacadores'
        verbose_name = "Empacador"
        verbose_name_plural = "Empacadores"
    
    def __str__(self):
        return self.nombre_empacador

class Enrutadores(models.Model):
    id_enrutador = models.AutoField(primary_key=True)
    nombre_enrutador = models.CharField(max_length=100)

    class Meta:
        db_table = 'enrutadores'
        verbose_name = "Enrutador"
        verbose_name_plural = "Enrutadores"
    
    def __str__(self):
        return self.nombre_enrutador

class Transportadoras(models.Model):
    id_transportadora = models.AutoField(primary_key=True)
    nombre_transportadora = models.CharField(max_length=255)

    class Meta:
        db_table = 'transportadoras'
        verbose_name = "Transportadora"
        verbose_name_plural = "Transportadoras"

    def __str__(self):
        return self.nombre_transportadora

class Vendedores(models.Model):
    id_vendedor = models.AutoField(primary_key=True)
    nombre_vendedor = models.CharField(max_length=255)

    class Meta:
        db_table = 'vendedores'
        verbose_name = "Vendedor"
        verbose_name_plural = "Vendedores"

    def __str__(self):
        return self.nombre_vendedor

class EstadosPedido(models.Model):
    id_estado = models.AutoField(primary_key=True)
    nombre_estado = models.CharField(max_length=100)

    class Meta:
        db_table = 'estados_pedido'
    
    def __str__(self):
        return self.nombre_estado


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
        db_table = 'facturas'
        verbose_name = "Factura"
        verbose_name_plural = "Facturas"

    def __str__(self):
        return (
            f"Factura #{self.id_factura} - "
            f"Cliente: {self.id_cliente.nombre_cliente if self.id_cliente else 'Sin cliente'} - "
            f"Ciudad: {self.ciudad or 'Sin ciudad'} - "
            f"Estado: {self.id_estado.nombre_estado if self.id_estado else 'Sin estado'} - "
        )


class HistorialEstados(models.Model):
    id_historial = models.AutoField(primary_key=True)
    id_factura = models.ForeignKey(Facturas, models.DO_NOTHING, db_column='id_factura')
    id_estado = models.ForeignKey(EstadosPedido, models.DO_NOTHING, db_column='id_estado')
    fecha_cambio = models.DateTimeField()
    observacion = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'historial_estados'
        verbose_name = "Historial de Estado"
        verbose_name_plural = "Historiales de Estados"

    def __str__(self):
        return (
            f"Historial #{self.id_historial} | "
            f"Factura: {self.id_factura.id_factura if self.id_factura else 'N/A'} | "
            f"Cliente: {self.id_factura.id_cliente.nombre_cliente if self.id_factura and self.id_factura.id_cliente else 'Sin cliente'} | "
            f"Estado: {self.id_estado.nombre_estado if self.id_estado else 'Sin estado'} | "
        )


