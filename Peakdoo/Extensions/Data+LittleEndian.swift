import Foundation

extension Data {
    func uint8(at offset: Int) -> UInt8? {
        guard offset < count else { return nil }
        return self[startIndex + offset]
    }

    func int8(at offset: Int) -> Int8? {
        guard offset < count else { return nil }
        return Int8(bitPattern: self[startIndex + offset])
    }

    func uint16LE(at offset: Int) -> UInt16? {
        guard offset + 1 < count else { return nil }
        let low = UInt16(self[startIndex + offset])
        let high = UInt16(self[startIndex + offset + 1])
        return low | (high << 8)
    }

    func uint32LE(at offset: Int) -> UInt32? {
        guard offset + 3 < count else { return nil }
        let b0 = UInt32(self[startIndex + offset])
        let b1 = UInt32(self[startIndex + offset + 1])
        let b2 = UInt32(self[startIndex + offset + 2])
        let b3 = UInt32(self[startIndex + offset + 3])
        return b0 | (b1 << 8) | (b2 << 16) | (b3 << 24)
    }
}
