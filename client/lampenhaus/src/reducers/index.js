import { combineReducers } from 'redux';
import searchInput from './searchInput';
import results from './results';
import counter from './counter';

const lampenhaus = combineReducers({
    results,
    counter,
});

export default lampenhaus;