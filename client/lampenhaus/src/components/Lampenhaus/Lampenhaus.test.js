import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk'
import Lampenhaus from './Lampenhaus';
import reducers from '../../reducers/reducers';

it('renders without crashing', () => {
    const store = createStore(
        reducers,
        applyMiddleware(thunkMiddleware),
    );

    const div = document.createElement('div');

    ReactDOM.render(
        <Provider store={store}>
            <Lampenhaus/>
        </Provider>,
        div
    );
});
