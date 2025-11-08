@echo off
echo ================================================================
echo INSTRUCCIONES PARA AGREGAR EL LOGO DE LA UTN FRLP
echo ================================================================
echo.
echo 1. Guarda la imagen del logo que te enviaron como "logo-utn.png"
echo 2. Coloca el archivo en la carpeta: frontend-bolsa-UTN\public\
echo 3. El archivo debe llamarse exactamente: logo-utn.png
echo.
echo El logo se mostrara:
echo - En modo CLARO: con sus colores originales (negro)
echo - En modo OSCURO: invertido a blanco automaticamente
echo.
echo ================================================================
echo.
echo Presiona cualquier tecla cuando hayas colocado el archivo...
pause > nul

if exist "public\logo-utn.png" (
    echo.
    echo [OK] Archivo logo-utn.png encontrado en public\
    echo El logo ya esta configurado y listo para usar.
) else (
    echo.
    echo [ERROR] No se encontro el archivo logo-utn.png en public\
    echo Por favor, coloca la imagen en la carpeta public\ y ejecuta este script nuevamente.
)

echo.
pause
