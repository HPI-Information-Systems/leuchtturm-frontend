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
};

const store = createStore(lampenhaus, initialState);

const rootEl = document.getElementById('root');

const render = () => ReactDOM.render(
    <Provider store={store}>
    <Lampenhaus
        state={store.getState()}
        onIncrement={() => store.dispatch({ type: 'INCREMENT' })}
        onDecrement={() => store.dispatch({ type: 'DECREMENT' })}
        onSubmitSearch={() => store.dispatch({ type: 'SUBMIT_SEARCH' })}
    />
    </Provider>,
    rootEl
);

render();
store.subscribe(render);