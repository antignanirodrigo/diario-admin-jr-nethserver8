@echo off
cd /d "%~dp0"
powershell -NoProfile -Command "if (Get-NetTCPConnection -LocalPort 4174 -State Listen -ErrorAction SilentlyContinue) { Write-Host 'A porta 4174 ja esta em uso. Se o curso estiver aberto, use http://127.0.0.1:4174/'; exit 1 }"
if errorlevel 1 (
  pause
  exit /b 1
)
echo Curso NS8: http://127.0.0.1:4174/
echo Feche esta janela para encerrar o servidor.
python -m http.server 4174 --bind 127.0.0.1
pause
