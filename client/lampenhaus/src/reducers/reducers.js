import { combineReducers } from 'redux';
import search from './search';
import correspondent from './correspondent';
import emailView from './emailView';
import graph from './graph';
import ApiReducer from './apiReducer';
import FilterReducer from './filterReducer';
import EventReducer from './eventReducer';
import SuggestionReducer from './suggestionReducer';

const reducers = combineReducers({
    search,
    correspondent,
    emailView,
    graph,
    api: ApiReducer,
    filter: FilterReducer,
    events: EventReducer,
    suggestions: SuggestionReducer,
});

export default reducers;
