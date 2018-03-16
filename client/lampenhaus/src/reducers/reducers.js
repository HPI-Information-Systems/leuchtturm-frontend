import { combineReducers } from 'redux';
import termView from './termView';
import correspondent from './correspondent';
import emailView from './emailView';
import graph from './graph';
import datasets from './datasets';
import ApiReducer from './apiReducer';
import FilterReducer from './filterReducer';
import EventReducer from './eventReducer';
import SuggestionReducer from './suggestionReducer';

const reducers = combineReducers({
    datasets,
    termView,
    correspondent,
    emailView,
    graph,
    api: ApiReducer,
    filter: FilterReducer,
    events: EventReducer,
    suggestions: SuggestionReducer,
});

export default reducers;
