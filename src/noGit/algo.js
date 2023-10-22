import algoliasearch from 'algoliasearch';

// const client = algoliasearch('K3MMXOERX4', 'd77dda3f60fbb5cebde99cf5e19e8b74');
const client = algoliasearch('R06E1817SD', 'cd058090d03dcb604cf7c385ee117d8f');
const library = client.initIndex('library');
const pages = client.initIndex('pages');

export { library, pages };
