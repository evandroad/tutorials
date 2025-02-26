//go:build windows
// +build windows

package main

import (
	"golang.org/x/sys/windows"
	"os/exec"
)

func hideWindow(cmd *exec.Cmd) {
	cmd.SysProcAttr = &windows.SysProcAttr{HideWindow: true}
}