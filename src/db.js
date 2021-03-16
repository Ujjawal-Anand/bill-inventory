import Dexie from 'dexie'

const db = new Dexie('MarketList');
db.version(1).stores(
    { items: "id,itemName,displayName,sellingPrice,stockInShop" }
)

export default db;