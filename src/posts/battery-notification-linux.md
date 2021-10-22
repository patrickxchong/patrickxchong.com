---
title: Battery Notifications in Linux
excerpt: Setup battery notifications to help extend battery life.
status: published
tags:
  - Tech
  - Linux
author: patrick-chong
date: 2021-10-03T02:31:10.530Z
updatedAt: ''
image: /assets/images/uploads/danilo-alvesd-w1p05f4gyng-unsplash.jpg
---

## Bash Script

Put this anywhere and make the script file executable with with `chmod +x`.

```bash
#!/bin/bash

# watch --interval=5

CAPACITY=$(cat /sys/class/power_supply/BAT0/capacity)
STATUS=$(cat /sys/class/power_supply/BAT0/status)

if [[ (${CAPACITY} > 80) && (${STATUS} == "Charging")]]
then
  /usr/bin/notify-send -u critical "Battery" "Disconnect Charger. Battery is above 80%"
elif [[ (${CAPACITY} < 20) && (${STATUS} == "Discharging")]]
then
  /usr/bin/notify-send -u critical "Connect Charger. Battery" "Battery is below 20%"
fi
```

## Crontab script

Schedule to run script every 2 minutes

```bash
# for notify-send to work
DISPLAY=:0.0
XAUTHORITY=/home/$LOGNAME/.Xauthority
DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus

*/2 * * * * <location of script>
```

Guide: https://crontab.guru/#\*/2_\*\_\*\_\*\_\*

## Why keep laptop battery between 80-20 percent

Have to admit that I had a hard time finding reputable sources, but I guess it could be true if many sources are saying the same thing?

Example Sources:

- https://www.wired.co.uk/article/how-to-improve-battery-life-tips-myths-smartphones
- https://www.choice.com.au/electronics-and-technology/phones/mobile-phones/articles/how-to-care-for-phone-and-laptop-lithium-batteries

## Bonus: Windows PowerShell Battery Notification script

Not experienced with PowerShell at all, but managed to hack this to work on my Windows installation. Use at your own risk!

```powershell
# Requires -Version 3.0

$lowBattery = 21
$chargedBattery = 80
$delayIntervalMinutes = 2

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName PresentationFramework

# Doesn't seem like there's a powershell way to do this,
Add-Type -ReferencedAssemblies @("System.Windows.Forms"; "System.Drawing") -TypeDefinition @"
    using System;
    using System.Drawing;
    using System.Windows.Forms;
    public static class TextNotifyIcon
    {
        // it's difficult to call DestroyIcon() with powershell only...
        [System.Runtime.InteropServices.DllImport("user32")]
        private static extern bool DestroyIcon(IntPtr hIcon);

        public static void UpdateIcon(NotifyIcon notifyIcon, string text)
        {
            using (var b = new Bitmap(16, 16))
            using (var g = Graphics.FromImage(b))
            using (var font = new Font(FontFamily.GenericMonospace, 8))
            {
                g.DrawString(text, font, Brushes.White, 0, 0);

                var icon = b.GetHicon();
                try
                {
                    notifyIcon.Icon = Icon.FromHandle(icon);
                } finally
                {
                    DestroyIcon(icon);
                }
            }
        }
    }
"@

$notifyIcon= New-Object System.Windows.Forms.NotifyIcon
$notifyIcon.Visible = $true

$notifyIcon.BalloonTipIcon = [System.Windows.Forms.ToolTipIcon]::Warning
function showBalloon($title,$text) {
  $notifyIcon.BalloonTipTitle = $title
  $notifyIcon.BalloonTipText = $text
  $notifyIcon.ShowBalloonTip(20000)
}

function showMessageBox($title,$text) {
  $ButtonType = [System.Windows.MessageBoxButton]::OK
  $MessageIcon = [System.Windows.MessageBoxImage]::Error
  $Result = [System.Windows.MessageBox]::Show($text,$title,$ButtonType,$MessageIcon)
}

function checkBattery() {
    $batteryLevel = Get-CimInstance -ClassName Win32_Battery | Measure-Object -Property EstimatedChargeRemaining -Average | Select-Object -ExpandProperty Average
    $charging = (Get-CimInstance -ClassName Win32_Battery | Select-Object -ExpandProperty BatteryStatus) -ne 1
    if ($charging -and $batteryLevel -ge ($chargedBattery + 5)) {
        showMessageBox "Battery at 85%" "Please unplug charger"
    }

    #done charging
    if ($charging -and $batteryLevel -ge $chargedBattery) {
        showBalloon "Battery at 80%" "Please unplug charger"
    }
    #low battery warning
    elseif (!$charging -and $batteryLevel -le $lowBattery) {
        showBalloon "Battery at 20%" "Please plug in charger"
    }
    else {
        # $notifyIcon.Text = "Battery $batteryLevel%"
    }
    # $batteryLevel = [DateTime]::Now.Second.ToString()
    [TextNotifyIcon]::UpdateIcon($notifyIcon, $batteryLevel)
}

function exitApp() {
    # $balmsg.dispose()
    $delayTimer.dispose()
    $contextMenu.dispose()
    $notifyIcon.dispose()
    # $appContext.dispose()
    Stop-Process $PID
    [system.gc]::Collect()
    # Exit
}

$contextMenu = New-Object System.Windows.Forms.ContextMenu
$notifyIcon.ContextMenu = $contextMenu

#Add Trigger MenuItem
$menuTrigger = New-Object System.Windows.Forms.MenuItem -ArgumentList "Trigger"
$menuTrigger.add_Click({
    checkBattery
})
$contextMenu.MenuItems.AddRange($menuTrigger)

#Add Exit MenuItem
$menuExit = New-Object System.Windows.Forms.MenuItem -ArgumentList "Exit"
$menuExit.add_Click({
    exitApp
})
$contextMenu.MenuItems.AddRange($menuExit)

#timer
$delayTimer = New-Object System.Windows.Forms.Timer
$delayTimer.Interval = $delayIntervalMinutes * 60 * 1000
$delayTimer.add_Tick({checkBattery})
$delayTimer.start()

checkBattery

# Create an application context for it to all run within.
# This helps with responsiveness, especially when clicking Exit.
$appContext = New-Object System.Windows.Forms.ApplicationContext
[void][System.Windows.Forms.Application]::Run($appContext)
```
