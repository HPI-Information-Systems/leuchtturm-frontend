## Installation

The React project was generated with `create-react-app lampenhaus` and later ejected using `npm run eject`

To start the React project in 'development mode' do
```
cd client/lampenhaus

npm i

npm start
```

To build the React project and serve the app with flask
```
cd client/lampenhaus

npm run build

# You can then serve the minified, 'pure' HTML/JS/CSS files with this:

cd frontend

python app.py # make sure to have flask installed: pip install flask

# go to localhost:5000/app

```

## Testing Flask API
run `pytest`