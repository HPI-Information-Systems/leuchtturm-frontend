import { combineReducers } from 'redux';
import search from './search';
import pagination from './pagination';

const reducers = combineReducers({
    search,
    pagination,
});

export default reducers;