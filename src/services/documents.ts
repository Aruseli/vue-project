
let lastOrderNumber = 0
export function getNextInvoiceNumber() {
  lastOrderNumber += 1
  return lastOrderNumber
}

let lastInventoryNumber = 0
export function getNextInventoryNumber() {
  lastInventoryNumber += 1
  return lastInventoryNumber
}
