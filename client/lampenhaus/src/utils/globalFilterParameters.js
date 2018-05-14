export default state => (
    (state.globalFilters.startDate ? `&start_date=${state.globalFilters.startDate}` : '') +
    (state.globalFilters.endDate ? `&end_date=${state.globalFilters.endDate}` : '')
);
