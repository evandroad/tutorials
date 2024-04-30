Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "server.exe", 0, False
WshShell.Run "cmd /c start http://localhost:8000", 0, False
WshShell.Run "cmd /c start http://localhost:8001", 0, False
Set WshShell = Nothing