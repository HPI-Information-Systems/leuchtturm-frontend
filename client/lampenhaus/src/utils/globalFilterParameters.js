export default globalFilters => (
    globalFilters ? `&filters=${JSON.stringify(globalFilters)}` : ''
);
