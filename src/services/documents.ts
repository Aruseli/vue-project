let lastCounterResetDate = new Date().setHours(0, 0, 0, 0); let counter = 0;
function resetCounterIfNewDay() {
  const today = new Date().setHours(0, 0, 0, 0);

  if (today > lastCounterResetDate) {
    counter = 0;
    lastCounterResetDate = today;
  }
}

export function getNextInventoryNumber() {
  resetCounterIfNewDay();
  counter += 1;
  return counter.toString().padStart(4, "0");
}

export function getNextInvoiceNumber() {
  resetCounterIfNewDay();
  counter += 1;
  return counter.toString().padStart(4, "0");
}

