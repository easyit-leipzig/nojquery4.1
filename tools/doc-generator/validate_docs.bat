@echo off
setlocal
cd /d "%~dp0\..\.."
py -3 tools\doc-generator\generate_docs_inventory.py --project-root .
if errorlevel 1 (
  echo.
  echo Validierung fehlgeschlagen. Siehe tools\doc-generator\documentation_status.json
  exit /b 1
)
echo.
echo Validierung erfolgreich.
echo Naechstes Modul: tools\doc-generator\next_module.json
