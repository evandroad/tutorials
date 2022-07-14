# ADB comands

[Home](../README.md)

- ## Summary

  - [#1 Server](#1-server)
  - [#2 Reboot](#2-reboot)
  - [#3 Shell](#3-shell)
  - [#4 Devices](#4-devices)
  - [#5 Get device android version](#5-get-device-android-version)
  - [#6 Logcat](#6-logcat)
  - [#7 Files](#7-files)
  - [#8 App install](#8-app-install)
  - [#9 Uninstalling app](#9-uninstalling-app)
  - [#10 Update app](#10-update-app)
  - [#11 Home button](#11-home-button)
  - [#12 Activity Manager](#12-activity-manager)
  - [#13 Make a call](#13-make-a-call)
  - [#14 Send sms](#14-send-sms)
  - [#15 Reset permissions](#15-reset-permissions)
  - [#16 Emulate device](#16-emulate-device)
  - [#17 And reset to default](#17-and-reset-to-default)
  - [#18 Print text](#18-print-text)
  - [#19 Screenshot](#19-screenshot)
  - [#20 Key event](#20-key-event)
  - [#21 SharedPreferences](#21-sharedpreferences)
  - [#22 Data types](#22-data-types)
  - [#23 Paths](#23-paths)
  - [#24 Phone state](#24-phone-state)
  - [#25 Package info](#25-package-info)
  - [#26 Configure Settings Commands](#26-configure-settings-commands)
  - [#27 Device Related Commands](#27-device-related-commands)

## #1 Server

`adb kill-server`  
`adb start-server`

## #2 Reboot

`adb reboot`  
`adb reboot recovery`  
`adb reboot bootloader`

## #3 Shell

Open or run commands in a terminal on the host Android device.  
`adb shell`

## #4 Devices

Show devices attached  
`adb devices`

Devices (product/model)  
`adb devices -l`

`adb connect ip_address_of_device`

## #5 Get device android version

`adb shell getprop ro.build.version.release`

## #6 Logcat

`adb logcat`

Clear the parameter -c will clear the current logs on the device.  
`adb logcat -c`

Save the logcat output to a file on the local system.  
`adb logcat -d > [path_to_file]`

Will dump the whole device information like dumpstate, dumpsys and logcat output.  
`adb bugreport > [path_to_file]`

## #7 Files

Copy files from your computer to your phone.  
`adb push [source] [destination]`

Copy files from your phone to your computer.  
`adb pull [device file location] [local file location]`

## #8 App install

Install app  
`adb shell install <apk>`

Install app from phone path  
`adb shell install <path>`

Install app from phone path  
`adb shell install -r <path>`

## #9 Uninstalling app

`adb uninstall com.myAppPackage`  
`adb uninstall <app .apk name>`

Uninstall .apk withour deleting data  
`adb uninstall -k <app .apk name>`

`adb shell pm uninstall com.example.MyApp`

Deletes all data associated with a package.  
`adb shell pm clear [package]`

Uninstall the given app from all connected devices  
`adb devices | tail -n +2 | cut -sf 1 | xargs -IX adb -s X uninstall com.myAppPackage`

## #10 Update app

Means re-install the app and keep its data on the device.  
`-r`  
`adb install -r yourApp.apk`  
`adb install –k <.apk file path on computer>`

## #11 Home button

`adb shell am start -W -c android.intent.category.HOME -a android.intent.action.MAIN`

## #12 Activity Manager

`adb shell am start -a android.intent.action.VIEW`  
`adb shell am broadcast -a 'my_action'`

## #13 Make a call

`adb shell am start -a android.intent.action.CALL -d tel:+972527300294`

## #14 Send sms

`adb shell am start -a android.intent.action.SENDTO -d sms:+972527300294   --es  sms_body "Test --ez exit_on_sent false"`

## #15 Reset permissions

list permission groups definitions  
`adb shell permissions groups`

list permissions details  
`adb shell list permissions -g -r`

Grant a permission to an app.  
`adb shell pm grant [packageName] [ Permission]`

Revoke a permission from an app.  
`adb shell pm revoke [packageName] [ Permission]`

## #16 Emulate device

`adb shell wm size 2048x1536`  
`adb shell wm density 288`

## #17 And reset to default

`adb shell wm size reset`  
`adb shell wm density reset`

## #18 Print text

`adb shell input text 'Wow, it so cool feature'`

## #19 Screenshot

`adb shell screencap -p /sdcard/screenshot.png`

```bahs
$ adb shell
shell@ $ screencap /sdcard/screen.png
shell@ $ exit
$ adb pull /sdcard/screen.png
```

`adb shell screenrecord /sdcard/NotAbleToLogin.mp4`

```bash
$ adb shell
shell@ $ screenrecord --verbose /sdcard/demo.mp4
(press Control + C to stop)
shell@ $ exit
$ adb pull /sdcard/demo.mp4
```

## #20 Key event

Home btn  
`adb shell input keyevent 3`

Back btn  
`adb shell input keyevent 4`

Call  
`adb shell input keyevent 5`

End call  
`adb shell input keyevent 6`

Turn Android device ON and OFF. It will toggle device to on/off status.  
`adb shell input keyevent 26`

Camera  
`adb shell input keyevent 27`

Open browser  
`adb shell input keyevent 64`

Enter  
`adb shell input keyevent 66`

Delete (backspace)  
`adb shell input keyevent 67`

Contacts  
`adb shell input keyevent 207`

Brightness down/up  
`adb shell input keyevent 220 / 221`

Cut/Copy/Paste  
`adb shell input keyevent 277 / 278 /279`

0 -->  "KEYCODE_0"  
1 -->  "KEYCODE_SOFT_LEFT"  
2 -->  "KEYCODE_SOFT_RIGHT"  
3 -->  "KEYCODE_HOME"  
4 -->  "KEYCODE_BACK"  
5 -->  "KEYCODE_CALL"  
6 -->  "KEYCODE_ENDCALL"  
7 -->  "KEYCODE_0"  
8 -->  "KEYCODE_1"  
9 -->  "KEYCODE_2"  
10 -->  "KEYCODE_3"  
11 -->  "KEYCODE_4"  
12 -->  "KEYCODE_5"  
13 -->  "KEYCODE_6"  
14 -->  "KEYCODE_7"  
15 -->  "KEYCODE_8"  
16 -->  "KEYCODE_9"  
17 -->  "KEYCODE_STAR"  
18 -->  "KEYCODE_POUND"  
19 -->  "KEYCODE_DPAD_UP"  
20 -->  "KEYCODE_DPAD_DOWN"  
21 -->  "KEYCODE_DPAD_LEFT"  
22 -->  "KEYCODE_DPAD_RIGHT"  
23 -->  "KEYCODE_DPAD_CENTER"  
24 -->  "KEYCODE_VOLUME_UP"  
25 -->  "KEYCODE_VOLUME_DOWN"  
26 -->  "KEYCODE_POWER"  
27 -->  "KEYCODE_CAMERA"  
28 -->  "KEYCODE_CLEAR"  
29 -->  "KEYCODE_A"  
30 -->  "KEYCODE_B"  
31 -->  "KEYCODE_C"  
32 -->  "KEYCODE_D"  
33 -->  "KEYCODE_E"  
34 -->  "KEYCODE_F"  
35 -->  "KEYCODE_G"  
36 -->  "KEYCODE_H"  
37 -->  "KEYCODE_I"  
38 -->  "KEYCODE_J"  
39 -->  "KEYCODE_K"  
40 -->  "KEYCODE_L"  
41 -->  "KEYCODE_M"  
42 -->  "KEYCODE_N"  
43 -->  "KEYCODE_O"  
44 -->  "KEYCODE_P"  
45 -->  "KEYCODE_Q"  
46 -->  "KEYCODE_R"  
47 -->  "KEYCODE_S"  
48 -->  "KEYCODE_T"  
49 -->  "KEYCODE_U"  
50 -->  "KEYCODE_V"  
51 -->  "KEYCODE_W"  
52 -->  "KEYCODE_X"  
53 -->  "KEYCODE_Y"  
54 -->  "KEYCODE_Z"  
55 -->  "KEYCODE_COMMA"  
56 -->  "KEYCODE_PERIOD"  
57 -->  "KEYCODE_ALT_LEFT"  
58 -->  "KEYCODE_ALT_RIGHT"  
59 -->  "KEYCODE_SHIFT_LEFT"  
60 -->  "KEYCODE_SHIFT_RIGHT"  
61 -->  "KEYCODE_TAB"  
62 -->  "KEYCODE_SPACE"  
63 -->  "KEYCODE_SYM"  
64 -->  "KEYCODE_EXPLORER"  
65 -->  "KEYCODE_ENVELOPE"  
66 -->  "KEYCODE_ENTER"  
67 -->  "KEYCODE_DEL"  
68 -->  "KEYCODE_GRAVE"  
69 -->  "KEYCODE_MINUS"  
70 -->  "KEYCODE_EQUALS"  
71 -->  "KEYCODE_LEFT_BRACKET"  
72 -->  "KEYCODE_RIGHT_BRACKET"  
73 -->  "KEYCODE_BACKSLASH"  
74 -->  "KEYCODE_SEMICOLON"  
75 -->  "KEYCODE_APOSTROPHE"  
76 -->  "KEYCODE_SLASH"  
77 -->  "KEYCODE_AT"  
78 -->  "KEYCODE_NUM"  
79 -->  "KEYCODE_HEADSETHOOK"  
80 -->  "KEYCODE_FOCUS"  
81 -->  "KEYCODE_PLUS"  
82 -->  "KEYCODE_MENU"  
83 -->  "KEYCODE_NOTIFICATION"  
84 -->  "KEYCODE_SEARCH"  
85 -->  "KEYCODE_MEDIA_PLAY_PAUSE"  
86 -->  "KEYCODE_MEDIA_STOP"  
87 -->  "KEYCODE_MEDIA_NEXT"  
88 -->  "KEYCODE_MEDIA_PREVIOUS"  
89 -->  "KEYCODE_MEDIA_REWIND"  
90 -->  "KEYCODE_MEDIA_FAST_FORWARD"  
91 -->  "KEYCODE_MUTE"  
92 -->  "KEYCODE_PAGE_UP"  
93 -->  "KEYCODE_PAGE_DOWN"  
94 -->  "KEYCODE_PICTSYMBOLS"  
122 -->  "KEYCODE_MOVE_HOME"  
123 -->  "KEYCODE_MOVE_END"  

## #21 SharedPreferences

Replace org.example.app with your application id

Add a value to default shared preferences.

`adb shell 'am broadcast -a org.example.app.sp.PUT --es key key_name --es value "hello world!"'`

Remove a value to default shared preferences.

`adb shell 'am broadcast -a org.example.app.sp.REMOVE --es key key_name'`

Clear all default shared preferences.

`adb shell 'am broadcast -a org.example.app.sp.CLEAR --es key key_name'`

It's also possible to specify shared preferences file.

`adb shell 'am broadcast -a org.example.app.sp.PUT --es name Game --es key level --ei value 10'`

## #22 Data types

`adb shell 'am broadcast -a org.example.app.sp.PUT --es key string --es value "hello world!"'`  
`adb shell 'am broadcast -a org.example.app.sp.PUT --es key boolean --ez value true'`  
`adb shell 'am broadcast -a org.example.app.sp.PUT --es key float --ef value 3.14159'`  
`adb shell 'am broadcast -a org.example.app.sp.PUT --es key int --ei value 2015'`  
`adb shell 'am broadcast -a org.example.app.sp.PUT --es key long --el value 9223372036854775807'`

## #23 Paths

/data/data/`<package>`/databases (app databases)  
/data/data/`<package>`/shared_prefs/ (shared preferences)  
/data/app (apk installed by user)  
/system/app (pre-installed APK files)  
/mmt/asec (encrypted apps) (App2SD)  
/mmt/emmc (internal SD Card)  
/mmt/adcard (external/Internal SD Card)  
/mmt/adcard/external_sd (external SD Card)

List directory contents  
`adb shell ls`

Print size of each file  
`adb shell ls -s`

List subdirectories recursively  
`adb shell ls -R`

## #24 Phone state

Print device state  
`adb get-statе`

Get the serial number  
`adb get-serialno`

Get the IMEI  
`adb shell dumpsys iphonesybinfo`

List TCP connectivity  
`adb shell netstat`

Print current working directory  
`adb shell pwd`

Battery status  
`adb shell dumpsys battery`

List phone features  
`adb shell pm list features`

List all services  
`adb shell service list`

Activity info  
`adb shell dumpsys activity <package>/<activity>`

Print process status  
`adb shell ps`

Displays the current screen resolution  
`adb shell wm size`

Print current app's opened activity  
`dumpsys window windows | grep -E 'mCurrentFocus|mFocusedApp'`

## #25 Package info

List package names  
`adb shell list packages`

List package name + path to apks  
`adb shell list packages -r`

List third party package names  
`adb shell list packages -3`

List only system packages  
`adb shell list packages -s`

List package names + uninstalled  
`adb shell list packages -u`

list info on all apps  
`adb shell dumpsys package packages`

List info on one package  
`adb shell dump <name>`

Path to the apk file  
`adb shell path <package>`

## #26 Configure Settings Commands

Change the level from 0 to 100  
`adb shell dumpsys battery set level <n>`

Change the level to unknown, charging, discharging, not charging or full  
`adb shell dumpsys battery set status<n>`

Reset the battery  
`adb shell dumpsys battery reset`

Change the status of USB connection. ON or OFF  
`adb shell dumpsys battery set usb <n>`

Sets the resolution to WxH  
`adb shell wm size WxH`

## #27 Device Related Commands

Reboot device into recovery mode  
`adb reboot-recovery`

Reboot device into recovery mode  
`adb reboot fastboot`

Capture screenshot  
`adb shell screencap -p "/path/to/screenshot.png"`

Record device screen  
`adb shell screenrecord "/path/to/record.mp4"`

Backup settings and apps  
`adb backup -apk -all -f backup.ab`

Backup settings, apps and shared storage  
`adb backup -apk -shared -all -f backup.ab`

Backup only non-system apps  
`adb backup -apk -nosystem -all -f backup.ab`

restore a previous backup  
`adb restore backup.ab`
