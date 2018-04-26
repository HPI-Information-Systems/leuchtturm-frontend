import { combineReducers } from 'redux';
import emailListView from './emailListView';
import correspondentView from './correspondentView';
import emailView from './emailView';
import graph from './graph';
import datasets from './datasets';
import globalFilters from './globalFilters';
import ApiReducer from './apiReducer';
import FilterReducer from './filterReducer';
import EventReducer from './eventReducer';
import SuggestionReducer from './suggestionReducer';

const reducers = combineReducers({
    datasets,
    emailListView,
    correspondentView,
    emailView,
    graph,
    globalFilters,
    api: ApiReducer,
    filter: FilterReducer,
    events: EventReducer,
    suggestions: SuggestionReducer,
});

export default reducers;
