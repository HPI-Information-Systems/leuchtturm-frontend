import { combineReducers } from 'redux';
import search from './search';
import correspondent from './correspondent';

const reducers = combineReducers({
    search,
    correspondent,
});

export default reducers;
