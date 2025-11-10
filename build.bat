@echo off

@REM Ren "./index.html" "index2.html"
@REM Ren "./main.html" "index.html"

Start /B /Wait cmd /C npm run build

@REM Ren "./index.html" "main.html"
@REM Ren "./index2.html" "index.html"

xcopy /E /I /Y "C:\Xampp\htdocs\untis" "./dist/php/"

xcopy /E /I "./fonts" "./dist/fonts"
xcopy /E /I "./src/scss" "./dist/scss"

xcopy /E /I "./icons" "./dist/icons"
xcopy /E /I "./imgs" "./dist/imgs"

copy "./serviceWorker.js" "./dist/"

@REM xcopy /E /I /Y "./lang" "./dist/lang"

setlocal enabledelayedexpansion

set items=login offline register

for %%i in (%items%) do (
    xcopy /E /I /Y "./%%i/scss" "./dist/%%i/scss"
    xcopy /E /I /Y "./%%i/imgs" "./dist/%%i/imgs"
)

@REM xcopy /E /I /Y "./impressum" "./dist/impressum"
@REM xcopy /E /I /Y "./policy" "./dist/policy"
@REM xcopy /E /I /Y "./gallery" "./dist/gallery"

@REM xcopy /E /I /Y "./aboutUs" "./dist/aboutUs"
@REM xcopy /E /I /Y "./contactFormular" "./dist/contactFormular"
@REM xcopy /E /I /Y "./footer" "./dist/footer"
@REM xcopy /E /I /Y "./gofundme" "./dist/gofundme"
@REM xcopy /E /I /Y "./sponsoringRows" "./dist/sponsoringRows"
@REM xcopy /E /I /Y "./sponsorings" "./dist/sponsorings"
@REM xcopy /E /I /Y "./theCar" "./dist/theCar"
@REM xcopy /E /I /Y "./whatIsStemracing" "./dist/whatIsStemracing"

mkdir "./dist/src"

xcopy /E /I /Y "./fonts" "./dist/src/fonts"


@REM start python compile.py
start python resizeAllImages.py
start python convertToWebp.py

@REM cls
echo Alle Aufgaben erfolgreich abgeschlossen!