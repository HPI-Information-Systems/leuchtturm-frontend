export default globalFilter => (
    globalFilter ? `&filters=${JSON.stringify(globalFilter)}` : ''
);
