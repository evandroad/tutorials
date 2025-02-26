//go:build !windows
// +build !windows

package main

import "os/exec"

func hideWindow(cmd *exec.Cmd) {
	// No-op para Linux/macOS
}