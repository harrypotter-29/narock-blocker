@echo off
cd /d "%~dp0"
echo.
echo NAROCK BLOCKER V3.6.1 local preview
echo http://127.0.0.1:5173
echo.
start "" http://127.0.0.1:5173/index.html
py -m http.server 5173 --bind 127.0.0.1
pause
