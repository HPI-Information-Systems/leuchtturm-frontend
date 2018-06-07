export const getGlobalFilterParameters = globalFilter => (
    globalFilter ? `&filters=${JSON.stringify(globalFilter)}` : ''
);

export const getGlobalSearchTermFilter = globalFilter => (
    globalFilter ? `&search_phrase=${globalFilter.searchTerm}` : ''
);
