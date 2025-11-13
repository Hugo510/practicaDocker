# Retos Extra - React Docker Lab

## 1. Pruebas con Vitest

### Configuración

Las pruebas se ejecutan automáticamente durante el build del Dockerfile. Si fallan, el build se detiene.

### Archivos creados:

- `src/App.test.jsx` - Pruebas del componente principal
- `src/setupTests.js` - Configuración de testing
- `vite.config.js` - Configurado para Vitest

### Comandos:

```powershell
# Ejecutar pruebas localmente
pnpm test

# Modo watch
pnpm test:watch

# Build con pruebas (Docker)
docker build -t react-docker-lab:prod .
```

Si las pruebas fallan, el build de Docker se detiene automáticamente.

---

## 2. Compresión Gzip en Nginx

### Configuración

Se ha habilitado compresión gzip en `nginx.conf` con las siguientes opciones:

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript
           application/json application/javascript application/xml+rss;
```

### Verificar compresión:

```powershell
# Después de iniciar el contenedor
curl -I -H "Accept-Encoding: gzip" http://localhost:8080

# Debería mostrar: Content-Encoding: gzip
```

### Beneficios:

- Reducción del tamaño de archivos transferidos (60-80%)
- Carga más rápida de la aplicación
- Menor uso de ancho de banda

---

## 3. Soporte para Create React App (CRA)

### Archivos creados:

- `Dockerfile.cra` - Build de producción para CRA
- `Dockerfile.cra.dev` - Desarrollo para CRA
- `docker-compose.cra.dev.yml` - Compose para desarrollo CRA

### Diferencias con Vite:

- Puerto: 3000 (en lugar de 5173)
- Carpeta de build: `build/` (en lugar de `dist/`)
- Variables de entorno: `REACT_APP_*` (en lugar de `VITE_*`)

### Uso:

```powershell
# Desarrollo
docker compose -f docker-compose.cra.dev.yml up --build

# Producción
docker build -f Dockerfile.cra -t react-docker-lab:cra .
docker run -d -p 8080:80 --name react-app react-docker-lab:cra
```

---

## 4. Docker Compose de Producción con Backend Mock

### Configuración

Se ha creado `docker-compose.prod.yml` con:

- Frontend (React + Nginx)
- Backend (json-server como API mock)
- Red personalizada para comunicación entre servicios

### Archivos:

- `docker-compose.prod.yml` - Orchestración de servicios
- `db.json` - Base de datos mock con datos de ejemplo

### Uso:

```powershell
# Iniciar todo el stack
docker compose -f docker-compose.prod.yml up --build

# Detener
docker compose -f docker-compose.prod.yml down
```

### URLs:

- Frontend: http://localhost:8080
- Backend API: http://localhost:3001

### Endpoints del backend:

```
GET    http://localhost:3001/posts
GET    http://localhost:3001/posts/1
GET    http://localhost:3001/users
GET    http://localhost:3001/comments
POST   http://localhost:3001/posts
PUT    http://localhost:3001/posts/1
DELETE http://localhost:3001/posts/1
```

### Probar la API:

```powershell
# Obtener posts
curl http://localhost:3001/posts

# Crear un nuevo post
curl -X POST http://localhost:3001/posts `
  -H "Content-Type: application/json" `
  -d '{"title":"Nuevo Post","content":"Contenido del nuevo post"}'
```

---

## 5. CI/CD con GitHub Actions

### Configuración

Se ha creado `.github/workflows/docker-publish.yml` que:

1. Se activa automáticamente al crear un tag con formato `v*`
2. Construye la imagen Docker
3. Ejecuta las pruebas (incluidas en el build)
4. Publica la imagen en Docker Hub

### Requisitos previos:

Configurar secrets en GitHub:

1. Ve a Settings > Secrets and variables > Actions
2. Agrega los siguientes secrets:
   - `DOCKER_USERNAME` - Tu usuario de Docker Hub
   - `DOCKER_PASSWORD` - Tu token de Docker Hub

### Uso:

```powershell
# Crear un tag y pushearlo
git tag v1.0.0
git push origin v1.0.0

# GitHub Actions automáticamente:
# 1. Construye la imagen
# 2. Ejecuta las pruebas
# 3. Publica en Docker Hub como:
#    - tu-usuario/react-docker-lab:1.0.0
#    - tu-usuario/react-docker-lab:1.0
#    - tu-usuario/react-docker-lab:1
#    - tu-usuario/react-docker-lab:latest
```

### Ver el progreso:

1. Ve a tu repositorio en GitHub
2. Click en "Actions"
3. Verás el workflow ejecutándose

### Verificar imagen publicada:

```powershell
docker pull tu-usuario/react-docker-lab:1.0.0
docker run -d -p 8080:80 tu-usuario/react-docker-lab:1.0.0
```

---

## Resumen de Comandos

### Pruebas:

```powershell
pnpm test                    # Ejecutar pruebas
pnpm test:watch              # Modo watch
```

### Desarrollo:

```powershell
# Vite
docker compose -f docker-compose.dev.yml up --build

# CRA
docker compose -f docker-compose.cra.dev.yml up --build
```

### Producción:

```powershell
# Solo frontend
docker build -t react-docker-lab:prod .
docker run -d -p 8080:80 react-docker-lab:prod

# Frontend + Backend mock
docker compose -f docker-compose.prod.yml up --build
```

### CI/CD:

```powershell
git tag v1.0.0
git push origin v1.0.0
# GitHub Actions se encarga del resto
```

---

## Verificación de Retos

### Reto 1 - Pruebas

- [ ] Las pruebas se ejecutan en el Dockerfile
- [ ] El build falla si las pruebas fallan
- [ ] `pnpm test` funciona localmente

### Reto 2 - Compresión Gzip

- [ ] nginx.conf tiene `gzip on;`
- [ ] Headers muestran `Content-Encoding: gzip`
- [ ] Archivos se sirven comprimidos

### Reto 3 - Soporte CRA

- [ ] Dockerfile.cra usa carpeta `build/`
- [ ] Puerto 3000 en desarrollo
- [ ] Variables `REACT_APP_*` funcionan

### Reto 4 - Compose Producción

- [ ] Frontend y backend se comunican
- [ ] Red personalizada funciona
- [ ] API mock responde en http://localhost:3001

### Reto 5 - CI/CD

- [ ] Workflow existe en `.github/workflows/`
- [ ] Secrets configurados en GitHub
- [ ] Tag dispara el workflow
- [ ] Imagen se publica en Docker Hub

---

## Troubleshooting

### Pruebas fallan en Docker

**Solución:** Verifica que las dependencias de testing estén en `package.json`

### Gzip no funciona

**Solución:** Verifica headers con `curl -I -H "Accept-Encoding: gzip" URL`

### Backend no responde

**Solución:**

```powershell
docker compose -f docker-compose.prod.yml logs backend
```

### GitHub Actions falla

**Solución:**

- Verifica que los secrets estén configurados
- Revisa los logs en la pestaña Actions
- Asegúrate de que el tag tenga formato `vX.Y.Z`
