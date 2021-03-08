import algoliasearch from 'algoliasearch';

const client = () =>  algoliasearch('MELG5CBL4E', '6003769ef2be471cd16b2065f79e6be3');

const index = () => client().initIndex('ITEM_LIST');


export {client, index};