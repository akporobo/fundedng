@echo off
REM FundedNG Equity Monitor - Silent launcher
REM Uses pythonw.exe so NO console window appears

cd /d "C:\Users\Gray Empire\fundedng\fundedng-monitor"

"C:\Users\Gray Empire\AppData\Local\Programs\Python\Python314\pythonw.exe" ^
    "C:\Users\Gray Empire\fundedng\fundedng-monitor\equity_monitor.py" ^
    >> "C:\Users\Gray Empire\fundedng\fundedng-monitor\task_errors.log" 2>&1
