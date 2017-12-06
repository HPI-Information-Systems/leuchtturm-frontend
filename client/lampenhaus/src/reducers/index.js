import { combineReducers } from 'redux';
import searchTerm from './searchTerm';
import results from './results';
import counter from './counter';

const reducers = combineReducers({
    results,
    counter,
    searchTerm,
});

export default reducers;