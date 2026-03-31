import Foundation

// MARK: - BLE Data Parser
enum BLEDataParser {

    // MARK: - BLEFloat16 Decoder (exact match of PWA parseBLEFloat16)
    /// Decodes a 16-bit BLE float from a raw UInt16 value.
    ///
    /// Matches the PWA implementation:
    /// ```js
    /// function parseBLEFloat16(raw) {
    ///     const mantissaRaw = raw & 0x0FFF;
    ///     const exponentRaw = raw >> 12;
    ///     const mantissa = (mantissaRaw & 0x0800) ? mantissaRaw - 0x1000 : mantissaRaw;
    ///     const exponent = (exponentRaw & 0x08) ? exponentRaw - 0x10 : exponentRaw;
    ///     return mantissa * Math.pow(10, exponent);
    /// }
    /// ```
    static func parseBLEFloat16(_ raw: UInt16) -> Double {
        let mantissaRaw = Int(raw & 0x0FFF)
        let exponentRaw = Int(raw >> 12)
        let mantissa = (mantissaRaw & 0x0800) != 0 ? mantissaRaw - 0x1000 : mantissaRaw
        let exponent = (exponentRaw & 0x08) != 0 ? exponentRaw - 0x10 : exponentRaw
        return Double(mantissa) * pow(10.0, Double(exponent))
    }

    // MARK: - ExtBatteryInfo (0x4303) - 16 bytes
    static func parseExtBatteryInfo(_ data: Data) -> BatteryInfo? {
        guard data.count >= 16 else { return nil }

        let enabledByte = data.uint8(at: 0) ?? 0
        let statusByte = data.int8(at: 1) ?? 0
        let fullByte = data.uint8(at: 2) ?? 0

        let maxCapacityRaw = data.uint16LE(at: 3) ?? 0
        let capacityRaw = data.uint16LE(at: 5) ?? 0
        let levelByte = data.uint8(at: 7) ?? 0
        let voltageRaw = data.uint16LE(at: 8) ?? 0
        let currentRaw = data.uint16LE(at: 10) ?? 0
        let powerRaw = data.uint16LE(at: 12) ?? 0
        let remainRaw = data.uint16LE(at: 14) ?? 0

        // Map status: -1 -> discharging, 1 -> charging, 0 -> idle
        let status: BatteryStatus
        switch statusByte {
        case -1: status = .discharging
        case 1:  status = .charging
        default: status = .idle
        }

        return BatteryInfo(
            enabled: enabledByte != 0,
            status: status,
            isFull: fullByte == 1,
            maxCapacity: parseBLEFloat16(maxCapacityRaw),
            capacity: parseBLEFloat16(capacityRaw),
            level: Int(levelByte),
            voltage: parseBLEFloat16(voltageRaw),
            current: parseBLEFloat16(currentRaw),
            power: parseBLEFloat16(powerRaw),
            remainMinutes: Int(remainRaw)
        )
    }

    // MARK: - DCPortStatus (0x4304) - 8-9 bytes
    static func parseDCPortStatus(_ data: Data) -> DCPortStatus? {
        guard data.count >= 8 else { return nil }

        let enabledByte = data.uint8(at: 0) ?? 0
        let statusByte = data.int8(at: 1) ?? 0
        let voltageRaw = data.uint16LE(at: 2) ?? 0
        let currentRaw = data.uint16LE(at: 4) ?? 0
        let powerRaw = data.uint16LE(at: 6) ?? 0

        // Map status: -1 -> discharging, 1 -> charging, 0 -> idle
        let portStatus: PortStatus
        switch statusByte {
        case -1: portStatus = .discharging
        case 1:  portStatus = .charging
        default: portStatus = .idle
        }

        // bypassOn is optional, present if data length >= 9
        let bypassOn: Bool
        if data.count >= 9, let bypassByte = data.uint8(at: 8) {
            bypassOn = bypassByte != 0
        } else {
            bypassOn = false
        }

        return DCPortStatus(
            enabled: enabledByte != 0,
            status: portStatus,
            voltage: parseBLEFloat16(voltageRaw),
            current: parseBLEFloat16(currentRaw),
            power: parseBLEFloat16(powerRaw),
            isBypassOn: bypassOn
        )
    }

    // MARK: - TypeCPortStatus (0x4305) - 10-13 bytes
    static func parseTypeCPortStatus(_ data: Data) -> TypeCPortStatus? {
        guard data.count >= 10 else { return nil }

        let enabledByte = data.uint8(at: 0) ?? 0
        let statusByte = data.int8(at: 1) ?? 0
        let voltageRaw = data.uint16LE(at: 2) ?? 0
        let currentRaw = data.uint16LE(at: 4) ?? 0
        let powerRaw = data.uint16LE(at: 6) ?? 0
        let temperatureRaw = data.uint16LE(at: 8) ?? 0

        // Map status: -1 -> discharging, 1 -> charging, 0 -> idle
        let portStatus: PortStatus
        switch statusByte {
        case -1: portStatus = .discharging
        case 1:  portStatus = .charging
        default: portStatus = .idle
        }

        // Optional fields
        let mode: UInt8
        if data.count >= 12 {
            mode = data.uint8(at: 11) ?? 0
        } else {
            mode = 0
        }

        let isDCInput: Bool
        if data.count >= 13 {
            isDCInput = (data.uint8(at: 12) ?? 0) != 0
        } else {
            isDCInput = false
        }

        return TypeCPortStatus(
            enabled: enabledByte != 0,
            status: portStatus,
            voltage: parseBLEFloat16(voltageRaw),
            current: parseBLEFloat16(currentRaw),
            power: parseBLEFloat16(powerRaw),
            temperature: parseBLEFloat16(temperatureRaw),
            mode: mode,
            isDCInput: isDCInput
        )
    }

    // MARK: - OTA Info (0x4301 response to 0x84 command)
    static func parseOTAInfo(_ data: Data) -> OTAInfo? {
        guard data.count >= 1 else { return nil }

        guard let modeByte = data.uint8(at: 0),
              let mode = OTAMode(rawValue: modeByte) else {
            return nil
        }

        // Optional CID at bytes 13-14 and revision at byte 15
        let cid: UInt16? = data.count >= 15 ? data.uint16LE(at: 13) : nil
        let revision: UInt8 = data.count >= 16 ? (data.uint8(at: 15) ?? 0) : 0

        switch mode {
        case .app:
            // Mode 1 (App): byte 0 = mode(1), optional CID and revision
            return OTAInfo(
                mode: .app,
                chipTypeId: nil,
                appStartAddress: nil,
                otaStartAddress: nil,
                blockSize: nil,
                cid: cid,
                revision: revision
            )

        case .ota:
            // Mode 2 (OTA): byte 0 = mode(2),
            //   bytes 1-4 = otaStartAddr (uint32LE),
            //   bytes 5-6 = blockSize (uint16LE),
            //   bytes 7-8 = chipType (uint16LE),
            //   bytes 9-12 = appStartAddr (uint32LE),
            //   bytes 13-14 = CID (optional),
            //   byte 15 = revision (optional)
            guard data.count >= 13 else { return nil }

            let otaStartAddress = data.uint32LE(at: 1)
            let blockSize = data.uint16LE(at: 5)
            let chipTypeId = data.uint16LE(at: 7)
            let appStartAddress = data.uint32LE(at: 9)

            return OTAInfo(
                mode: .ota,
                chipTypeId: chipTypeId,
                appStartAddress: appStartAddress,
                otaStartAddress: otaStartAddress,
                blockSize: blockSize,
                cid: cid,
                revision: revision
            )
        }
    }
}
