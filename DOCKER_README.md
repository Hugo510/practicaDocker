# React Docker Lab

Aplicación React contenerizada con Docker para desarrollo y producción.

## Estructura del Proyecto

```
react-docker-lab/
  ├─ src/                      # Código fuente React
  ├─ public/                   # Archivos estáticos
  │  └─ env.template.js        # Template de variables de entorno
  ├─ package.json              # Dependencias
  ├─ pnpm-lock.yaml            # Lock file de pnpm
  ├─ .dockerignore             # Archivos ignorados por Docker
  ├─ Dockerfile.dev            # Dockerfile para desarrollo
  ├─ docker-compose.dev.yml    # Compose para desarrollo
  ├─ Dockerfile                # Dockerfile multi-stage para producción
  └─ nginx.conf                # Configuración Nginx para SPA
```

## Modo Desarrollo (Hot-Reload)

### Iniciar contenedor de desarrollo:

```powershell
docker compose -f docker-compose.dev.yml up --build
```

La aplicación estará disponible en: **http://localhost:5173**

**Características:**

- Hot-reload automático al editar código
- Volúmenes montados para cambios en tiempo real
- Entorno consistente sin instalar Node localmente

### Detener el contenedor:

```powershell
docker compose -f docker-compose.dev.yml down
```

## Modo Producción (Nginx)

### Construir imagen de producción:

```powershell
docker build -t react-docker-lab:prod .
```

### Ejecutar contenedor de producción:

```powershell
docker run -d -p 8080:80 --name react-app react-docker-lab:prod
```

La aplicación estará disponible en: **http://localhost:8080**

**Características:**

- Imagen multi-stage optimizada y liviana
- Servida por Nginx con configuración SPA
- History API fallback para React Router
- Cache de archivos estáticos (7 días)

### Detener y eliminar contenedor:

```powershell
docker stop react-app
docker rm react-app
```

## Variables de Entorno

### Variables en Tiempo de Build (estáticas)

Usa el prefijo `VITE_` para variables que se inyectan durante el build:

```powershell
docker build --build-arg VITE_API_URL=https://api.ejemplo.com -t react-docker-lab:prod .
```

En React, accede con:

```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

### Variables en Tiempo de Ejecución (dinámicas)

Pasa variables al iniciar el contenedor:

```powershell
docker run -e API_URL=https://api.produccion.com -p 8080:80 react-docker-lab:prod
```

En React, accede con:

```javascript
const apiUrl = window.RUNTIME_ENV?.API_URL;
```

### Ejemplo con múltiples variables:

```powershell
docker run `
  -e API_URL=https://api.produccion.com `
  -e APP_ENV=production `
  -p 8080:80 `
  --name react-app `
  react-docker-lab:prod
```

## Comandos Útiles

### Ver logs del contenedor:

```powershell
docker logs react-app
docker logs -f react-app  # Seguir logs en tiempo real
```

### Inspeccionar contenedor:

```powershell
docker inspect react-app
```

### Ver imágenes:

```powershell
docker images
```

### Eliminar imagen:

```powershell
docker rmi react-docker-lab:prod
```

### Limpiar sistema Docker:

```powershell
docker system prune -a  # Eliminar contenedores, imágenes y redes no usadas
```

## Publicar en Docker Hub

### 1. Login en Docker Hub:

```powershell
docker login
```

### 2. Etiquetar imagen:

```powershell
docker tag react-docker-lab:prod tu-usuario/react-docker-lab:latest
docker tag react-docker-lab:prod tu-usuario/react-docker-lab:v1.0.0
```

### 3. Push a Docker Hub:

```powershell
docker push tu-usuario/react-docker-lab:latest
docker push tu-usuario/react-docker-lab:v1.0.0
```

### 4. Ejecutar desde Docker Hub:

```powershell
docker run -d -p 8080:80 tu-usuario/react-docker-lab:latest
```

## Verificación

### Desarrollo:

1. Accede a http://localhost:5173
2. Edita `src/App.jsx` y verifica hot-reload
3. Verifica que las variables de entorno se muestran

### Producción:

1. Accede a http://localhost:8080
2. Verifica que la app carga correctamente
3. Refresca la página (F5) - no debe dar 404
4. Verifica las variables de entorno configuradas

## Notas Importantes

- **Multi-stage build**: Reduce el tamaño final de la imagen (solo contiene Nginx + archivos estáticos)
- **CHOKIDAR_USEPOLLING**: Necesario para hot-reload en Windows/macOS con volúmenes
- **try_files**: Configuración en Nginx para SPA con React Router
- **.dockerignore**: Excluye `node_modules` y otros archivos innecesarios del contexto Docker

## Solución de Problemas

### Hot-reload no funciona:

- Verifica que `CHOKIDAR_USEPOLLING=true` esté configurado
- Asegúrate de que no hay un proceso local en el puerto 5173

### Error al construir:

- Verifica que Docker Desktop esté corriendo
- Revisa los logs: `docker compose -f docker-compose.dev.yml logs`

### Puerto ocupado:

```powershell
# Cambiar puerto en docker-compose.dev.yml o en docker run
docker run -p 3000:80 react-docker-lab:prod
```

## Recursos

- [Docker Documentation](https://docs.docker.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [React Documentation](https://react.dev/)

## Objetivos Cumplidos

- Contenerizar aplicaciones React con Docker
- Diferenciar flujo desarrollo vs producción
- Usar docker-compose para desarrollo con hot-reload
- Construir imágenes reproducibles y livianas (multi-stage)
- Servir SPA con Nginx (history API fallback)
- Inyectar variables en build y en runtime
- Publicar y ejecutar imágenes desde un registry
