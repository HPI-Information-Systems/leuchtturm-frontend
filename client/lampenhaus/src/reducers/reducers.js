import { combineReducers } from 'redux';
import search from './search';
import correspondent from './correspondent';
import graph from './graph';
import ApiReducer from './apiReducer';
import FilterReducer from './filterReducer';
import SidebarReducer from './sidebarReducer';
import EventReducer from './eventReducer';
import SuggestionReducer from './suggestionReducer';

const reducers = combineReducers({
    search,
    correspondent,
    graph,
    api: ApiReducer,
    sidebar: SidebarReducer,
    filter: FilterReducer,
    events: EventReducer,
    suggestions: SuggestionReducer,
});

export default reducers;
