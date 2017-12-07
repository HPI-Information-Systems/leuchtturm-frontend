import { combineReducers } from 'redux';
import search from './search';
import counter from './counter';

const reducers = combineReducers({
    search,
    counter,
});

export default reducers;