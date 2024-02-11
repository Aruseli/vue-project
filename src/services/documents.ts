
let lastOrderNumber = 0
export function getNextInvoiceNumber() {
  lastOrderNumber += 1
  return lastOrderNumber
}
let lastArrivalNumber = 0
export function getNextArrivalInvoiceNumber() {
  lastOrderNumber += 1
  return lastOrderNumber
}
