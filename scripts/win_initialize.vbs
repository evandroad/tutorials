Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "web-server\web-server.exe", 0, False
WshShell.Run "cmd /c start http://localhost:8080", 0, False
Set WshShell = Nothing