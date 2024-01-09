export function serialize(data) {
  if (Array.isArray(data)) {
      // Если это массив, обрабатывать каждый элемент
      // и применить наш метод сериализации
      return data.map(item => serialize(item));
  } else if (typeof data === "object" && data !== null) {
      // Если это объект, нужно обработать каждое свойство
      let result = {};
      for (let key in data) {
          if (data.hasOwnProperty(key)) {
              // Применяем метод сериализации к каждому свойству
              result[key] = serialize(data[key]);
          }
      }
      return result;
  } else {
      // Для примитивов просто возвращаем значение
      return data;
  }
}

export const customSerializer = {
  save: (key, value) => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (e) {
      // обработка ошибок при сериализации данных
      console.error("Error saving data to localStorage:", e);
    }
  },
  get: (key) => {
    try {
      const serializedValue = localStorage.getItem(key);
      if (serializedValue === null) {
        return undefined;
      }
      return JSON.parse(serializedValue);
    } catch (e) {
      // обработка ошибок при десериализации данных
      console.error("Error getting data from localStorage:", e);
      return undefined;
    }
  },
};
