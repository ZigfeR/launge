import algoliasearch from 'algoliasearch';

const client = algoliasearch('K3MMXOERX4', 'd77dda3f60fbb5cebde99cf5e19e8b74');
const index = client.initIndex('library');

export default index;
