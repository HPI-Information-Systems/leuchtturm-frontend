import React, { Component } from 'react';
import { Button } from 'reactstrap';

class ExampleComponent extends Component {
  render() {
    return (
      <div>
        <p> This button from inside the ExampleComponent </p>
        <Button color="danger">Danger!</Button>
      </div>
    );
  }
}

export default ExampleComponent;
