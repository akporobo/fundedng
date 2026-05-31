@echo off
cd /d fundedng-monitor"
start /b "" "C:\Users\Gray Empire\fundedng\"C:\Users\Gray Empire\AppData\Local\Programs\Python\Python314\pythonw.exe" equity_monitor.py >> task_errors.log 2>&1
if %errorlevel% neq 0 echo %date% %time% Monitor run failed >> task_errors.log
