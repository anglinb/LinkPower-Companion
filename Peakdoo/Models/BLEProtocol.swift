import CoreBluetooth

// MARK: - BLE Service & Characteristic UUIDs
enum BLEUUIDs {
    static let linkPowerService = CBUUID(string: "00005301-0000-1000-8000-00805f9b34fb")

    static let otaChar = CBUUID(string: "00004301-0000-1000-8000-00805f9b34fb")
    static let linkPowerChar = CBUUID(string: "00004302-0000-1000-8000-00805f9b34fb")
    static let extBatteryInfo = CBUUID(string: "00004303-0000-1000-8000-00805f9b34fb")
    static let dcPortStatus = CBUUID(string: "00004304-0000-1000-8000-00805f9b34fb")
    static let typeCPortStatus = CBUUID(string: "00004305-0000-1000-8000-00805f9b34fb")
    static let factoryMode = CBUUID(string: "00004310-0000-1000-8000-00805f9b34fb")

    static let deviceInformation = CBUUID(string: "180A")
    static let currentTime = CBUUID(string: "1805")

    // Device Information characteristics
    static let modelNumberString = CBUUID(string: "2A24")
    static let hardwareRevisionString = CBUUID(string: "2A27")
    static let firmwareRevisionString = CBUUID(string: "2A26")
    static let softwareRevisionString = CBUUID(string: "2A28")

    // Current Time characteristic
    static let currentTimeChar = CBUUID(string: "2A2B")

    // All services to discover
    static let allServices: [CBUUID] = [linkPowerService, deviceInformation, currentTime]
}

// MARK: - Device Commands
enum BLECommand: UInt8, Sendable {
    case dcControl = 0x01
    case typeCPowerLimit = 0x02
    case barrierFreeMode = 0x03
    case blePin = 0x04
    case scheduledOnOff = 0x06
    case deviceID = 0x10
    case restart = 0x11
    case typeCControl = 0x13
    case dcBypassControl = 0x14
    case dcBypassThreshold = 0x15
    case getUSBFwVersion = 0x17
    case runningModeControl = 0xE0
    case features = 0xFE
}

enum BLEAction: UInt8, Sendable {
    case get = 0x00
    case set = 0x01
    case delete = 0x02
}

// MARK: - OTA Commands
enum OTACommand: UInt8, Sendable {
    case program = 0x80
    case erase = 0x81
    case verify = 0x82
    case end = 0x83
    case info = 0x84
    case wholeVerify = 0x85
    case detectMTU = 0x89
    case features = 0x90
    case programV2 = 0xA0
}

// MARK: - Feature Flags
struct FeatureFlags: OptionSet, Sendable {
    let rawValue: UInt32

    static let display = FeatureFlags(rawValue: 1 << 0)
    static let factoryMode = FeatureFlags(rawValue: 1 << 1)
    static let sleep = FeatureFlags(rawValue: 1 << 2)
    static let shutdown = FeatureFlags(rawValue: 1 << 3)
    static let batteryCapacity = FeatureFlags(rawValue: 1 << 4)
    static let dcOutPort = FeatureFlags(rawValue: 1 << 5)
    static let dcOutControl = FeatureFlags(rawValue: 1 << 6)
    static let dcOutScheduler = FeatureFlags(rawValue: 1 << 7)
    static let usbPort = FeatureFlags(rawValue: 1 << 8)
    static let usbPowerLimit = FeatureFlags(rawValue: 1 << 9)
    static let usbOutputControl = FeatureFlags(rawValue: 1 << 10)
    static let dcBypass = FeatureFlags(rawValue: 1 << 11)
    static let dcBypassControl = FeatureFlags(rawValue: 1 << 12)
    static let usbDCInput = FeatureFlags(rawValue: 1 << 13)
    static let usbDCInputPower = FeatureFlags(rawValue: 1 << 14)
}

// MARK: - OTA Info
enum OTAMode: UInt8, Sendable {
    case app = 1
    case ota = 2
}

struct OTAInfo: Sendable {
    let mode: OTAMode
    let chipTypeId: UInt16?
    let appStartAddress: UInt32?
    let otaStartAddress: UInt32?
    let blockSize: UInt16?
    let cid: UInt16?
    let revision: UInt8
}
