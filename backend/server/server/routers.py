# Este nombre debe coincidir con el que usas en DATABASES
USERS_DB = 'default' 
BODEGA_DB = 'bodega' 

USERS_MODELS = [
    'auth',
    'admin',
    'contenttypes',
    'sessions',
    'authtoken',
]

USERS_MODELS = ['auth', 'admin', 'contenttypes', 'sessions', 'authtoken']
BODEGA_MODELS = ['warehouse']

class MultiDBRouter:
    def db_for_read(self, model, **hints):
        if model._meta.app_label in USERS_MODELS:
            return USERS_DB
        if model._meta.app_label in BODEGA_MODELS:
            return BODEGA_DB
        return None

    def db_for_write(self, model, **hints):
        if model._meta.app_label in USERS_MODELS:
            return USERS_DB
        if model._meta.app_label in BODEGA_MODELS:
            return BODEGA_DB
        return None

    def allow_relation(self, obj1, obj2, **hints):
        return True

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label in USERS_MODELS:
            return db == USERS_DB
        if app_label in BODEGA_MODELS:
            return db == BODEGA_DB
        return db == 'default'