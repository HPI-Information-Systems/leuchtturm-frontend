import React, { Component } from 'react';
import Menu from 'react-toolbox/lib/menu/Menu';
import MenuItem from 'react-toolbox/lib/menu/MenuItem';
import Button from 'react-toolbox/lib/button/Button';

import styles from './moduleStyles.css';

export default class GraphContextMenu extends Component {
  constructor(props) {
    super(props);

    this.state = { active: false };

    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleMenuHide = this.handleMenuHide.bind(this);
  }

  handleButtonClick = function () {
    this.setState({ active: !this.state.active });
  };
  handleMenuHide = function () {
    this.setState({ active: false });
  };

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    this.setState({ active: nextProps.show });
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log(nextProps, nextState);
    return true;
  }

  render() {
    console.log(this.props.active);

    return (
      <div style={{ display: 'inline-block', position: 'relative' }}>
        <Button primary raised onClick={this.props.onHide} label="Hello"/>
        <Menu position="topLeft" active={this.state.active} onHide={this.handleMenuHide}>
          <MenuItem value='download' icon='get_app' caption='Download'/>
          <MenuItem value='help' icon='favorite' caption='Favorite'/>
          <MenuItem value='settings' icon='open_in_browser' caption='Open in app'/>
          <MenuItem value='signout' icon='delete' caption='Delete' disabled/>
        </Menu>
      </div>
    );
  }
}
