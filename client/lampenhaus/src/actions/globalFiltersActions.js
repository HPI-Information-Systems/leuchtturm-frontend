export const handleGlobalFiltersChange = globalFilters => ({
    type: 'HANDLE_GLOBAL_FILTERS_CHANGE',
    globalFilters,
});

export const updateSearchTerm = searchTerm => ({
    type: 'UPDATE_SEARCH_TERM',
    searchTerm,
});
