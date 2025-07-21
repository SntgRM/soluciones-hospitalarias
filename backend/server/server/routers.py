# Este nombre debe coincidir con el que usas en DATABASES
USERS_DB = 'default'  # porque 'default' apunta a 'sh_usuarios'

USERS_MODELS = [
    'auth',
    'admin',
    'contenttypes',
    'sessions',
    'authtoken',
]

class AuthRouter:
    def db_for_read(self, model, **hints):
        if model._meta.app_label in USERS_MODELS:
            return USERS_DB
        return None

    def db_for_write(self, model, **hints):
        if model._meta.app_label in USERS_MODELS:
            return USERS_DB
        return None

    def allow_relation(self, obj1, obj2, **hints):
        return True

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label in USERS_MODELS:
            return db == USERS_DB
        return db != USERS_DB  # Esto previene que los modelos normales se vayan a 'default' también
