import Dexie from 'dexie';

export const db = new Dexie("DatabaseCatalog");
db.version(1).stores({
  products: '++id, title, price, count, images, alt, description'
});
