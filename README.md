# React Docker Lab

Aplicacion React contenerizada con Docker para desarrollo y produccion.

## Tabla de Contenidos

- [Inicio Rapido](#inicio-rapido)
- [Variables de Entorno](#variables-de-entorno)
- [Guia de Pruebas Basicas](#guia-de-pruebas-basicas)
- [Retos Extra](#retos-extra)
- [Comandos Utiles](#comandos-utiles)
- [Solucion de Problemas](#solucion-de-problemas)

---

## Inicio Rapido

### Requisitos

- Docker Desktop instalado y corriendo
- Verificar: `docker --version`

### Modo Desarrollo (con hot-reload)

```powershell
docker compose -f docker-compose.dev.yml up --build
```

Abre http://localhost:5173 y edita codigo para ver cambios en tiempo real.

Para detener: `Ctrl+C` o `docker compose -f docker-compose.dev.yml down`

### Modo Produccion (optimizado con Nginx)

```powershell
# Construir imagen
docker build -t react-docker-lab:prod .

# Ejecutar contenedor
docker run -d -p 8080:80 --name react-app react-docker-lab:prod
```

Abre http://localhost:8080

Para detener:

```powershell
docker stop react-app
docker rm react-app
```

---

## Variables de Entorno

### Variables en Tiempo de Ejecucion (dinamicas)

Se pueden cambiar sin reconstruir la imagen:

```powershell
docker run -d -p 8080:80 `
  -e API_URL=https://api.ejemplo.com `
  -e APP_ENV=production `
  --name react-app `
  react-docker-lab:prod
```

Acceso en React: `window.RUNTIME_ENV?.API_URL`

### Variables en Tiempo de Build (estaticas)

Se fijan al construir la imagen:

```powershell
docker build --build-arg VITE_API_URL=https://api.fija.com -t react-docker-lab:prod .
```

Acceso en React: `import.meta.env.VITE_API_URL`

---

## Guia de Pruebas Basicas

### Prueba 1: Desarrollo con Hot-Reload

1. Iniciar: `docker compose -f docker-compose.dev.yml up --build`
2. Abrir http://localhost:5173
3. Editar `src/App.jsx` y cambiar el titulo
4. Verificar que el navegador se actualiza automaticamente
5. Detener: Ctrl+C

### Prueba 2: Produccion con Nginx

1. Construir: `docker build -t react-docker-lab:prod .`
2. Ejecutar: `docker run -d -p 8080:80 --name react-app react-docker-lab:prod`
3. Abrir http://localhost:8080
4. Presionar F5 para recargar - NO debe dar error 404
5. Limpiar: `docker stop react-app && docker rm react-app`

### Prueba 3: Variables de Entorno

1. Ejecutar con variable:

```powershell
docker run -d -p 8080:80 -e API_URL=https://mi-api.com --name react-app react-docker-lab:prod
```

2. Abrir http://localhost:8080
3. Verificar que "Runtime API URL" muestra: https://mi-api.com
4. Limpiar: `docker stop react-app && docker rm react-app`

---

## Retos Extra

### Reto 1: Pruebas Automatizadas con Vitest

Las pruebas se ejecutan automaticamente durante el build:

```powershell
# Ejecutar pruebas localmente
pnpm test

# Build con pruebas (si fallan, el build se detiene)
docker build -t react-docker-lab:prod .
```

### Reto 2: Compresion Gzip

Verificar que Nginx esta comprimiendo archivos:

```powershell
# Iniciar contenedor
docker run -d -p 8080:80 --name react-app react-docker-lab:prod

# Verificar headers
curl.exe -I -H "Accept-Encoding: gzip" http://localhost:8080
```

Debe mostrar: `Content-Encoding: gzip`

### Reto 3: Docker Compose con Backend Mock

Levantar frontend y backend juntos:

```powershell
# Iniciar todo el stack
docker compose -f docker-compose.prod.yml up -d

# Verificar servicios
docker compose -f docker-compose.prod.yml ps

# Probar frontend
# Abrir http://localhost:8080

# Probar backend API
curl.exe http://localhost:3001/posts
curl.exe http://localhost:3001/users
curl.exe http://localhost:3001/comments

# Detener todo
docker compose -f docker-compose.prod.yml down
```

#### Endpoints disponibles:

- `GET http://localhost:3001/posts` - Listar posts
- `GET http://localhost:3001/posts/1` - Obtener post especifico
- `GET http://localhost:3001/users` - Listar usuarios
- `GET http://localhost:3001/comments` - Listar comentarios
- `POST http://localhost:3001/posts` - Crear nuevo post
- `PUT http://localhost:3001/posts/1` - Actualizar post
- `DELETE http://localhost:3001/posts/1` - Eliminar post

#### Crear un post desde PowerShell:

```powershell
$body = @{
    title = "Nuevo Post"
    content = "Contenido del nuevo post"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:3001/posts -Method POST -Body $body -ContentType "application/json"
```

### Reto 4: CI/CD con GitHub Actions

Configurar publicacion automatica en Docker Hub:

#### Paso 1: Configurar secrets en GitHub

1. Crear token en Docker Hub: https://hub.docker.com/settings/security
2. En GitHub: Repositorio > Settings > Secrets > New repository secret
   - `DOCKER_USERNAME`: tu usuario de Docker Hub
   - `DOCKER_TOKEN`: el token generado

#### Paso 2: Crear y pushear tag

```powershell
git tag v1.0.0
git push origin v1.0.0
```

GitHub Actions automaticamente:

- Construye la imagen
- Ejecuta las pruebas
- Publica en Docker Hub

#### Paso 3: Usar la imagen publicada

```powershell
docker pull tu-usuario/react-docker-lab:1.0.0
docker run -d -p 8080:80 tu-usuario/react-docker-lab:1.0.0
```

---

## Comandos Utiles

### Ver contenedores corriendo

```powershell
docker ps
```

### Ver logs

```powershell
docker logs react-app
docker logs -f react-app  # Seguir en tiempo real
```

### Ver imagenes

```powershell
docker images
```

### Limpiar sistema

```powershell
# Eliminar contenedor especifico
docker stop react-app && docker rm react-app

# Eliminar imagen especifica
docker rmi react-docker-lab:prod

# Limpieza completa (cuidado!)
docker system prune -a
```

### Docker Compose

```powershell
# Ver servicios
docker compose -f docker-compose.prod.yml ps

# Ver logs de un servicio
docker compose -f docker-compose.prod.yml logs backend

# Ver logs en tiempo real
docker compose -f docker-compose.prod.yml logs -f

# Detener servicios
docker compose -f docker-compose.prod.yml down
```

---

## Checklist de Verificacion

### Pruebas Basicas

- [ ] Desarrollo funciona en http://localhost:5173
- [ ] Hot-reload actualiza sin recargar pagina
- [ ] Produccion funciona en http://localhost:8080
- [ ] F5 no da error 404 (SPA fallback)
- [ ] Variables de entorno se muestran correctamente

### Retos Extra

- [ ] Pruebas se ejecutan en el build
- [ ] Compresion gzip esta activa (Content-Encoding: gzip)
- [ ] Docker Compose levanta frontend y backend
- [ ] Backend API responde en http://localhost:3001
- [ ] CI/CD publica imagen en Docker Hub

---

## Solucion de Problemas

### Docker Desktop no esta corriendo

**Error**: `pipe/dockerDesktopLinuxEngine`
**Solucion**: Abre Docker Desktop y espera a que inicie completamente

### Puerto ocupado

**Error**: `port is already allocated`
**Solucion**: Cambia el puerto en el comando

```powershell
docker run -p 3000:80 react-docker-lab:prod
```

### Hot-reload no funciona

**Solucion**: Verifica que `CHOKIDAR_USEPOLLING=true` este en `docker-compose.dev.yml`

### Backend no responde

**Solucion**: Ver logs del backend

```powershell
docker compose -f docker-compose.prod.yml logs backend
```

### Gzip no funciona

**Solucion**: Verificar que `gzip_min_length` en `nginx.conf` sea menor que el tamano de tus archivos

---

## Recursos

- [Docker Documentation](https://docs.docker.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [React Documentation](https://react.dev/)

## Estructura del Proyecto

```
practicaDockerPrueba/
├── src/                          # Codigo fuente React
├── public/                       # Archivos estaticos
│   └── env.template.js          # Template de variables de entorno
├── Dockerfile                    # Build multi-stage para produccion
├── Dockerfile.dev                # Build para desarrollo
├── docker-compose.dev.yml        # Compose para desarrollo
├── docker-compose.prod.yml       # Compose para produccion con backend
├── nginx.conf                    # Configuracion Nginx
├── db.json                       # Base de datos mock para json-server
└── README.md                     # Esta guia
```
