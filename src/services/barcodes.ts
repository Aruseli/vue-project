
export type GoodBarcode = {
  prefix: "210",
  barcode: string,
  code: string
}

// 2201000000099
// -> 220 prefix
// -> 100000009 token
// -> 9 check digit
export type EmployeeBarcode = {
  prefix: "220",
  token: string,
  barcode: string,
}

// 2301000000099
// -> 230 prefix
// -> 1 docType
// -> 00000009 docId
// -> 9 check digit
export type DocumentBarcode = {
  prefix: "230",
  docType: number,
  docId: number,
  barcode: string,
}

export type Barcode = GoodBarcode | EmployeeBarcode | DocumentBarcode

export function parseBarcode(barcode: string): Barcode {
  if (barcode.length != 13) {
    throw new Error("Barcode is not EAN-13")
  }

  switch (barcode.slice(0, 3)) {
    case "210":
      return {
        prefix: "210",
        barcode,
        code: barcode.slice(3, 12),
      }
    case "220":
      return {
        prefix: "220",
        token: barcode.slice(3, 12),
        barcode,
      }
    case "230":
      return {
        prefix: "230",
        docType: parseInt(barcode.slice(3, 4)),
        docId: parseInt(barcode.slice(4, 12)),
        barcode,
      }
    default:
      throw new Error("Unknown barcode")
  }
}
