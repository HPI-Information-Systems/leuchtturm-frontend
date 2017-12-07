import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Lampenhaus from './components/Lampenhaus/Lampenhaus';
import reducers from './reducers/index';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import './index.css';

const initialState = {
    search: {
        searchTerm: '',
        resultList: [],
        isFetching: false,
    },
    counter: 0,
};

const store = createStore(
    reducers,
    initialState,
    // config for redux chrome dev tool
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

render(
    <Provider store={store}>
      <Lampenhaus/>
    </Provider>,
    document.getElementById('root')
);