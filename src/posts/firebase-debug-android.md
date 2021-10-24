---
title: Enable Firebase debug mode for Android apps
excerpt: Guide to setup Firebase debug mode on Android
status: published
tags:
  - Tech
author: patrick-chong
date: 2021-10-02T02:31:10.530Z
updatedAt: ''
image: /assets/images/uploads/bug-tracking.png
imageHero: true
imageHeroObjectFit: object-contain
---

1. Install Android debug bridge: https://www.xda-developers.com/install-adb-windows-macos-linux/
2. Enable USB debugging on phone (if not already done in step 1): https://developer.android.com/studio/command-line/adb#Enabling
3. Connect your device to your laptop and make sure device shows up in ADB with running this command in the terminal: `adb devices` (if not already done in step 1)
4. If you don't know the package name, search for it with the following command:

```shell
adb shell "pm list packages -f <search-term>"
```

_Example_

```shell
adb shell "pm list packages -f telegram"
# output from command
package:/data/app/org.telegram.messenger-bpV9sE5semiBisZel2YxUA==/base.apk=org.telegram.messenger
```

The package name is at the very end of the output(after `base.apk=`). In this case, it's `org.telegram.messenger`

5. To enable Firebase debug mode, run this in the terminal:

```shell
adb shell setprop debug.firebase.analytics.app <insert package name>
```

_Example_

```shell
adb shell setprop debug.firebase.analytics.app org.telegram.messenger
```

`setprop` itself doesn't output anything, but you can check if the property is set correctly with:

```shell
adb shell getprop debug.firebase.analytics.app
```

Which should return `org.telegram.messenger` if `setprop` ran successfully.

6. Congrats, you have successfully enabled Firebase Debug Mode on your device! You can now open the app you're testing and check Firebase Analytics events sent by your device at the [DebugView page on Firebase](https://console.firebase.google.com/project/_/analytics/debugview). If you don't see any events after a few minutes, try restarting the app, that usually triggers the app to start sending debug events.

Note: Firebase Debug mode for iOS requires using XCode on a Mac, for more info see here: https://firebase.google.com/docs/analytics/debugview
