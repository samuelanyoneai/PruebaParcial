@echo off
echo ========================================
echo Instalacion de Dependencias
echo Sistema de Trazabilidad Alimentaria
echo ========================================
echo.

echo [1/2] Instalando dependencias de la Capa de Datos...
cd data
call npm install
echo.
echo Capa de Datos: OK
echo.

echo [2/2] Instalando dependencias de la Capa de Logica de Negocio...
cd ..\server
call npm install
echo.
echo Capa de Logica: OK
echo.

cd ..
echo ========================================
echo Instalacion completada exitosamente!
echo ========================================
echo.
echo Ahora puedes ejecutar start-all.bat
echo.
pause

