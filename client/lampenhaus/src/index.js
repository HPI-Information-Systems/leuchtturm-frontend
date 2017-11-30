import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Lampenhaus from './components/App/App';
import lampenhaus from './reducers';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

const initialState = {
    results: [],
    counter: 0,
    searchTerm: '',
};

const store = createStore(lampenhaus, initialState);

const rootEl = document.getElementById('root');

const render = () => ReactDOM.render(
    <Provider store={store}>
      <Lampenhaus/>
    </Provider>,
    rootEl
);

render();
store.subscribe(render);