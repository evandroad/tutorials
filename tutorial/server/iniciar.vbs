Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "appserver.exe", 0, False
WshShell.Run "cmd /c start http://localhost:8000", 0, False
Set WshShell = Nothing