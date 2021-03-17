import Dexie from 'dexie';

const db = new Dexie('MarketList');
db.version(8).stores(
    { items: "id" }
)

export function resetDatabase(items) {
    return db.transaction("rw", db.items, async () => {
        await Promise.all(db.tables.map(table => table.clear()));
        await db.items.bulkAdd(items);
    });
}

export { db };

