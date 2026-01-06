@echo off
echo ============================================
echo   Configuracion de Base de Datos PostgreSQL
echo   Sistema de Trazabilidad Alimentaria
echo ============================================
echo.

echo Este script creara la base de datos automaticamente.
echo.
echo REQUISITO: PostgreSQL debe estar instalado.
echo.

set /p password="Ingresa la contrasena del usuario postgres: "
echo.

echo [1/3] Creando base de datos trazabilidad_db...
psql -U postgres -c "DROP DATABASE IF EXISTS trazabilidad_db;"
psql -U postgres -c "CREATE DATABASE trazabilidad_db;"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: No se pudo conectar a PostgreSQL.
    echo.
    echo Verifica que:
    echo - PostgreSQL este instalado
    echo - El servicio de PostgreSQL este corriendo
    echo - La contrasena sea correcta
    echo.
    pause
    exit /b 1
)

echo OK: Base de datos creada
echo.

echo [2/3] Creando tablas (ejecutando init.sql)...
psql -U postgres -d trazabilidad_db -f data\database\init.sql

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: No se pudieron crear las tablas.
    pause
    exit /b 1
)

echo OK: Tablas creadas
echo.

echo [3/3] Configurando archivo .env...
(
echo DB_HOST=localhost
echo DB_PORT=5432
echo DB_NAME=trazabilidad_db
echo DB_USER=postgres
echo DB_PASSWORD=%password%
) > data\.env

echo OK: Archivo .env creado
echo.

echo ============================================
echo   VERIFICACION
echo ============================================
echo.
echo Verificando tablas creadas...
psql -U postgres -d trazabilidad_db -c "\dt"
echo.

echo ============================================
echo   BASE DE DATOS LISTA!
echo ============================================
echo.
echo Base de datos: trazabilidad_db
echo Tablas creadas: lotes, procesos, logistica
echo Archivo configurado: data\.env
echo.
echo Ahora puedes ejecutar: start-all.bat
echo.
pause

