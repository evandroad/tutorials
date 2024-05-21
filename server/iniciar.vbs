Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "server.exe", 0, False
WshShell.Run "cmd /c start http://localhost:8080/tutorial", 0, False
WshShell.Run "cmd /c start http://localhost:8080/generate", 0, False
Set WshShell = Nothing