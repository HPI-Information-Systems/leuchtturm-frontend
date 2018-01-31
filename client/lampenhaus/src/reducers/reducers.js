import { combineReducers } from 'redux';
import search from './search';
import correspondent from './correspondent';
import emailView from './emailView';

const reducers = combineReducers({
    search,
    correspondent,
    emailView,
});

export default reducers;
