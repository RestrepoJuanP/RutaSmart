from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path
from django.shortcuts import redirect


def home_redirect(request):
    return redirect('accounts:login')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home_redirect, name='home'),
    path('accounts/', include('accounts.urls')),
    path('students/', include('students.urls')),
    path('vehiculos/', include('vehiculo.urls')),
    path('finanzas/', include('finanzas.urls')),
    path('pagos/', include('pagos.urls')),
    path('rutas/', include('ruta.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)