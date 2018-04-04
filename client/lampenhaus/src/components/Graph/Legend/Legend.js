import React, { Component } from 'react';
import { connect } from 'react-redux';

import { filterNodeType, filterLinkType } from '../../../actions/filterActions';

import FontIcon from 'react-toolbox/lib/font_icon';
import linkStyles from 'react-toolbox/lib/link/theme.css';

import styles from './moduleStyles.css';

class Legend extends Component {
    constructor(props) {
        super(props);

        this.filterNodeType = this.filterNodeType.bind(this);
        this.filterLinkType = this.filterLinkType.bind(this);
    }

    filterNodeType(type) {
        this.props.filterNodeType(type);
    }

    filterLinkType(type) {
        this.props.filterLinkType(type);
    }

    render() {
        const self = this;
        const graph = self.props.api.graph;
        const nodeIconTypes = [];
        const linkIconTypes = [];

        // the brightness_1 icon is a circle that indicates an default icon
        graph.nodes.forEach((node) => {
            nodeIconTypes[node.type] = self.props.config.getIcon(node.type);
        });

        this.props.suggestions.suggestedNodes.forEach((node) => {
            nodeIconTypes[node.type] = self.props.config.getIcon(node.type);
        });

        // every link gets the same icon
        graph.links.forEach((link) => {
            linkIconTypes[link.type] = 'remove';
        });

        this.props.suggestions.suggestedLinks.forEach((link) => {
            linkIconTypes[link.type] = 'remove';
        });

        return (
            <div className={styles.container}>
                {Object.keys(nodeIconTypes).map(function (type) {
                    return (<a
                        onClick={self.filterNodeType.bind(this, type)}
                        key={`node_${type}`}
                        className={`${linkStyles.link} ${styles.link} ${self.props.filter.nodeTypes[type] ? styles.clicked : ''}`}
                    ><abbr>{type}</abbr>
                        <FontIcon value={nodeIconTypes[type]} />
                            </a>);
                })}
                {Object.keys(linkIconTypes).map(function (type) {
                    return (<a
                        onClick={self.filterLinkType.bind(this, type)}
                        key={`link_${type}`}
                        className={`${linkStyles.link} ${styles.link} ${self.props.filter.linkTypes[type] ? styles.clicked : ''}`}
                    ><abbr>{type}</abbr>
                        <FontIcon value={linkIconTypes[type]} />
                            </a>);
                })}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        config: state.config,
        filter: state.filter,
        suggestions: state.suggestions,
    };
}

export default connect(mapStateToProps, { filterNodeType, filterLinkType })(Legend);
