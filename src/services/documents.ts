
const COUNTERS_LS_KEY = 'DOC_COUNTERS';

type Counters = {
  lastReset: number,
  counters: { [key: string]: number },
}

function getCountersFromLocalStorage(): Counters {
  try {
    const storedData = localStorage.getItem(COUNTERS_LS_KEY);

    if (!storedData) {
      return {
        lastReset: Date.now(),
        counters: {} as { [key: string]: number },
      };
    }
    return JSON.parse(storedData);
  } catch (error) {
    console.warn(`Error retrieving ${COUNTERS_LS_KEY}:`, error);
    return {
      lastReset: Date.now(),
      counters: {} as { [key: string]: number },
    };
  }
}

function resetCountersIfNewDay(counters: Counters) {
  const dayStart = new Date().setHours(0, 0, 0, 0);
  if (counters.lastReset >= dayStart) {
    return;
  }
  counters.lastReset = Date.now();
  for (const key in counters.counters) {
    counters.counters[key] = 0;
  }
}

function saveCountersToLocalStorage(counters: Counters) {
  localStorage.setItem(COUNTERS_LS_KEY, JSON.stringify(counters));
}

function getNextNumber(key: string) {
  const counters = getCountersFromLocalStorage();
  resetCountersIfNewDay(counters);
  const value = (counters.counters[key] ?? 0) + 1;
  counters.counters[key] = value;
  saveCountersToLocalStorage(counters);
  return value;
}

export function getNextInventoryNumber() {
  return getNextNumber('inventory');
}

export function getNextInvoiceNumber() {
  return getNextNumber('invoice');
}
