import './index.css';
import App from './components/App/App';
import 'bootstrap/dist/css/bootstrap.css';

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import search from './reducers'

let store = createStore(search)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)