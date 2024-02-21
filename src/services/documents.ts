const SET_COUNTER_IN_LS = 'SET_COUNTER';

function setCounterToLocalStorage(key: string, count: number) {
  localStorage.setItem(key, JSON.stringify({ counter: count }));
}

let lastCounterResetDate = new Date().setHours(0, 0, 0, 0);
let counter = 0;
function resetCounterIfNewDay() {
  const today = new Date().setHours(0, 0, 0, 0);

  if (today > lastCounterResetDate) {
    counter = 1;
    lastCounterResetDate = today;
  }
  setCounterToLocalStorage('LAST_RESET', counter);
}

function getStoredCounterFromLs(key: string) {
  try {
    const storedData = localStorage.getItem(key);

    if (!storedData) return null;
    return JSON.parse(storedData).counter || 1;
  } catch (error) {
    console.warn(`Error retrieving ${key}:`, error);
    return null;
  }
}

export function getNextInventoryNumber() {
  const storedCount = getStoredCounterFromLs('LAST_RESET');
  resetCounterIfNewDay();
  const newCount = storedCount ? storedCount + 1 : 0;
  setCounterToLocalStorage('LAST_RESET', newCount);
  return newCount.toString().padStart(4, "0");

  // resetCounterIfNewDay();
  // counter += 1;
  // return counter.toString().padStart(4, "0");
}

export function getNextInvoiceNumber() {
  const storedCount = getStoredCounterFromLs('LAST_RESET');
  resetCounterIfNewDay();
  const newCount = storedCount ? storedCount + 1 : 0;
  setCounterToLocalStorage('LAST_RESET', newCount);
  return newCount.toString().padStart(4, "0");

  // resetCounterIfNewDay();
  // counter += 1;
  // return counter.toString().padStart(4, "0");
}

