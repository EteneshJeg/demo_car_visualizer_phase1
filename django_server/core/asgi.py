import os
from django.core.asgi import get_asgi_application
from dotenv import load_dotenv
load_dotenv('./.env')
debug = os.environ.get('DEBUG', "true")
if debug == "true":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings.local")
else:
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings.production")

application = get_asgi_application()
