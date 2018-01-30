import React, { Component } from 'react';
import { connect } from 'react-redux';

import GraphView from './GraphView/GraphView';
import SideBar from './GraphView/SideBar/SideBar';

import { requestGraph } from '../../actions/actions';


import {
    clearGraph,
    fetchSuggestions,
    fetchNeighbours,
    fireCypherRequest,
    fireCleLRequest,
    genNNodes,
    getNNodes,
} from '../../actions/apiActions';

import './style.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebarActive: false,
            loading: false,
        };

        this.toggleSideBar = this.toggleSideBar.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.api.graph !== this.props.api.graph) this.setState({ loading: false });
    }

    componentDidMount() {
        this.props.requestGraph('MATCH(sender:Person{email:"scott.neal@enron.com"})-[w:WRITESTO]-(correspondent) RETURN correspondent.email');
    }

    toggleSideBar() {
        this.setState({ sidebarActive: !this.state.sidebarActive });
    }

    render() {
        return (
            <main>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic" />

                <SideBar
                    active={this.state.sidebarActive}
                    toggleSideBar={this.toggleSideBar}
                />
                <GraphView toggleSideBar={this.toggleSideBar} />
            </main>
        );
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
    };
}

export default connect(mapStateToProps, {
    clearGraph,
    fetchSuggestions,
    fetchNeighbours,
    fireCypherRequest,
    fireCleLRequest,
    getNNodes,
    genNNodes,
    requestGraph,
})(App);
