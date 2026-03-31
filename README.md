# Peakdoo - Link-Power Companion App

A native iOS companion app for [PeakDo](https://peakdo.ca) Link-Power portable battery devices. Built with SwiftUI and CoreBluetooth.

> **This is an unofficial, community-built application. It is not affiliated with, endorsed by, or supported by PeakDo Tech. Inc. Use at your own risk.**

## Features

- **BLE Device Connection** - Scan, connect, auto-reconnect to Link-Power devices (LP1, LP2, LP+)
- **Real-Time Monitoring** - Live battery level, capacity, voltage, current, and remaining time via BLE notifications
- **DC Port Control** - Enable/disable DC output, monitor power/voltage/current, DC bypass toggle
- **USB-C Port Monitoring** - Charging/discharging status, power readings, temperature display, output control
- **DC On/Off Scheduler** - Create up to 6 scheduled timers (one-shot, daily, weekly, monthly) for automated DC port control
- **USB-C Power Limits** - Configure global, input, output, and runtime power limits (30W - 100W)
- **DateTime Sync** - Sync your phone's clock to the device
- **Expert & Dev Modes** - Advanced controls including device restart, shutdown, factory mode, and BLE PIN configuration

## Supported Devices

| Device | Model String | Key Features |
|--------|-------------|--------------|
| Link-Power 1 (LP1) | `BP4SL3V1` | Battery, DC, USB-C, shutdown, scheduled control |
| Link-Power 2 (LP2) | `BP4SL3V2` | Battery, DC, USB-C, DC bypass, DC input |
| Link-Power+ (LP+) | `BP4SL3` | DC port control |

## Requirements

- iOS 17.0+
- Xcode 16.0+
- A PeakDo Link-Power device

## Architecture

The app follows MVVM with `@Observable` (iOS 17+), uses CoreBluetooth directly, and has **zero third-party dependencies**.

```
Peakdoo/
├── Models/          # BLE protocol, device state, timer model, settings
├── Services/        # BLE manager, device connection, data parser
├── ViewModels/      # Connection & dashboard view models
├── Views/
│   ├── Connection/  # BLE scanning & device picker
│   ├── Dashboard/   # Main monitoring UI, cards, timer editor
│   └── Components/  # Reusable UI components
├── Design/          # Theme constants (colors, typography, spacing)
└── Extensions/      # Data parsing, color, view modifiers
```

### BLE Protocol

The app communicates with Link-Power devices over a custom BLE service (`0x5301`) with characteristics for:
- Device commands (`0x4302`) - DC control, power limits, timers, restart
- Battery info (`0x4303`) - Real-time battery notifications
- DC port status (`0x4304`) - Real-time DC port notifications
- USB-C port status (`0x4305`) - Real-time Type-C notifications
- OTA mode (`0x4301`) - Device mode detection

Standard BLE services are also used: `device_information` (model, firmware version) and `current_time` (datetime sync).

## Building

1. Clone the repository
2. Open `Peakdoo.xcodeproj` in Xcode
3. Select your development team in Signing & Capabilities
4. Build and run on a physical iOS device (BLE is not available in Simulator)

## Design

Clean Minimal Light design inspired by Apple Health and Home apps:
- White cards with subtle shadows on a light grey background
- SF Pro Rounded typography for readings
- SF Symbols throughout
- Spring animations and haptic feedback
- Color-coded status indicators (green = charging, orange = discharging, pink = bypass)

## Disclaimer

**THIS SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.** This is an unofficial application and is not affiliated with, endorsed by, or supported by PeakDo Tech. Inc. The authors and contributors take no responsibility for any damage, data loss, or device malfunction that may result from using this application. Use entirely at your own risk.

Interacting with device firmware (especially advanced features like scheduled timers, power limits, and device restart/shutdown) carries inherent risk. Always ensure your device has adequate power before performing any operations.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
