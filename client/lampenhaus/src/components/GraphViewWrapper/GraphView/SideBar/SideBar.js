import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Card } from 'react-toolbox/lib/card/Card';
import { CardMedia } from 'react-toolbox/lib/card/CardMedia';
import { CardText } from 'react-toolbox/lib/card/CardText';
import { CardTitle } from 'react-toolbox/lib/card/CardTitle';
import { IconButton } from 'react-toolbox/lib/button/IconButton';

import { Col, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import styles from './moduleStyles.css';
import ToolboxElement from "./ToolboxElement/ToolboxElement";

import { showNodeInfo } from '../../../../actions/sidebarActions';
import { removeNode } from "../../../../actions/suggestionActions";

class SideBar extends Component {
  constructor(props) {
    super(props);
  }

  close = () => {
    this.props.toggleSideBar();
  };

  deleteNode = () => {
    this.props.removeNode(this.props.sidebar.node.id);
    this.props.showNodeInfo({ id: null, props: {} });
  };

  cover = (binary) => (
    <CardMedia className={styles.cover}
      aspectRatio="wide"
      image={`${binary}`}
    />
  );

  render() {
    const self = this;
    const node = self.props.sidebar.node;

    return (
      <div style={{ zIndex: 10 }}>
        <Modal id="sidebar" className={`${styles.bar}`} isOpen={this.props.active} toggle={this.props.toggleSideBar}>
          <Card className={styles.close_button_panel}>
            <IconButton className={styles.close_button} icon='keyboard_arrow_left' ripple onClick={this.close}/>
          </Card>
          <Card className={`${styles.card}`}>
            {node.props.__cover ? self.cover(node.props.__cover) : ''}
            <div className={`${styles.empty_space} ${styles.card_title}`}></div>
            <div className={`${styles.card_title}`}>
              <CardTitle>{node.props.name}</CardTitle>
            </div>
            <div className={`${styles.card_toolbox}`}>
              <ToolboxElement icon="edit" text="Änderungen Vorschlagen" onClick={self.props.toggleEdit}/>
              <ToolboxElement icon="delete" text="Entfernen" onClick={self.deleteNode}/>
              <ToolboxElement icon="description" text="Zeige Herkunft" onClick={self.props.showSnippets}/>
            </div>
            <CardText className={styles.sidebar_scroll}>

              <h3 className={styles.subHeader}>
                Attribute
              </h3>
              {Object.keys(node.props).map(function (key) {
                if(key === 'name') return ('');

                if (key.startsWith('__')) {
                  // don't show attribute
                  return ('');
                } else if (key.startsWith('_')) {
                  // don't show key, but show the attribute
                  return (
                    <p key={key} className={styles.facts}>
                      {node.props[key]}
                    </p>
                  );
                }
                else {
                  return (
                    <p key={key} className={styles.facts}>
                      <em>{key}:</em> {node.props[key]}
                    </p>
                  );
                }
              })}
            </CardText>
          </Card>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    sidebar: state.sidebar
  };
}

export default connect(mapStateToProps, { showNodeInfo, removeNode })(SideBar);
