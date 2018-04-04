import { combineReducers } from 'redux';
import termView from './termView';
import correspondentView from './correspondentView';
import emailView from './emailView';
import graph from './graph';
import ApiReducer from './apiReducer';
import FilterReducer from './filterReducer';
import EventReducer from './eventReducer';
import SuggestionReducer from './suggestionReducer';

const reducers = combineReducers({
    termView,
    correspondentView,
    emailView,
    graph,
    api: ApiReducer,
    filter: FilterReducer,
    events: EventReducer,
    suggestions: SuggestionReducer,
});

export default reducers;
