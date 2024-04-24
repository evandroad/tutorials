Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "apiserver.exe", 0, False
WshShell.Run "cmd /c start http://localhost:8001", 0, False
Set WshShell = Nothing