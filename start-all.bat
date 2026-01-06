@echo off
echo ========================================
echo Sistema de Trazabilidad Alimentaria
echo Arquitectura 3 Capas
echo ========================================
echo.
echo Iniciando las 3 capas del sistema...
echo.

echo [1/3] Iniciando Capa de Datos (Puerto 3001)...
start "Capa de Datos" cmd /k "cd data && npm start"
timeout /t 3 /nobreak > nul

echo [2/3] Iniciando Capa de Logica de Negocio (Puerto 3000)...
start "Capa de Logica" cmd /k "cd server && npm start"
timeout /t 3 /nobreak > nul

echo [3/3] Iniciando Capa de Presentacion (Puerto 8080)...
start "Capa de Presentacion" cmd /k "cd client && npx http-server -p 8080 -c-1"
timeout /t 2 /nobreak > nul

echo.
echo ========================================
echo Sistema iniciado correctamente!
echo ========================================
echo.
echo Abriendo el navegador...
timeout /t 2 /nobreak > nul
start http://localhost:8080
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause > nul

