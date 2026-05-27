@echo off
title FundedNG Equity Monitor

cd /d "%~dp0"

python equity_monitor.py
if %errorlevel% neq 0 (
    echo %date% %time% Monitor run failed >> task_errors.log
    exit /b %errorlevel%
)
