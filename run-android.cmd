@echo off
setlocal
cd /d "%~dp0"
call npm.cmd run android
exit /b %ERRORLEVEL%

