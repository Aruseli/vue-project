
let lastOrderNumber = 0
export function getNextInvoiceNumber() {
  lastOrderNumber += 1
  return lastOrderNumber
}
