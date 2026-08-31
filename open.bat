@echo off
rem 开机入口：先确保本机中转在跑，再打开页面，避免「拒绝连接」
curl.exe -s --max-time 2 http://127.0.0.1:8787/health >nul 2>nul
if %errorlevel%==0 goto open
start "" /min pythonw "%~dp0proxy.py"
:wait
timeout /t 1 /nobreak >nul
curl.exe -s --max-time 2 http://127.0.0.1:8787/health >nul 2>nul
if %errorlevel% neq 0 goto wait
:open
start "" http://127.0.0.1:8787/
