import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import EntityList from './EntityList/EntityList';
import * as actions from '../../actions/actions';

const mapStateToProps = state => ({
    docId: state.emailView.docId,
    email: state.emailView.email,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    onDocIdUpdated: actions.setDocId,
    getEmail: actions.requestEmail,
}, dispatch);

// eslint-disable-next-line
class EmailView extends Component {
    constructor(props) {
        super(props);
        const { docId } = props.match.params;
        props.onDocIdUpdated(docId);
        props.getEmail(docId);
    }

    componentDidUpdate(prevProps) {
        if (this.didDocIdChange(prevProps)) {
            const { docId } = this.props.match.params;
            this.props.onDocIdUpdated(docId);
            this.props.getEmail(docId);
        }
    }

    didDocIdChange(prevProps) {
        return prevProps.match.params.docId !== this.props.match.params.docId;
    }


    render() {
        if (Object.keys(this.props.email).length === 0) {
            return <div>...LOADING...</div>;
        }
        const entityList = Object.keys(this.props.email.entities).map(entityType => (
            <EntityList
                key={entityType}
                entityType={entityType}
                entities={this.props.email.entities[entityType]}
            />
        ));

        const allEntityNames = [];
        Object.keys(this.props.email.entities).forEach(entityType => (
            this.props.email.entities[entityType].forEach(entity => (
                allEntityNames.push(entity.entity)
            ))
        ));

        let bodyWithEntitiesHighlighted = this.props.email.body[0];

        if (allEntityNames.length) {
            const allEntityNamesRegExp = new RegExp(`(${allEntityNames.join('|')})`, 'gi');
            const parts = this.props.email.body[0].split(allEntityNamesRegExp);
            let key = 0;
            bodyWithEntitiesHighlighted = parts.map((part) => {
                key += 1;
                return (
                    <span key={key}>
                        {allEntityNames.includes(part) ?
                            <Link to={`/search/${part}`} className="text-primary">
                                {part}
                            </Link> :
                            part
                        }
                    </span>
                );
            });
        }

        return (
            <Row>
                <Col sm="8">
                    {bodyWithEntitiesHighlighted}
                </Col>
                <Col sm="4">
                    {entityList}
                </Col>
            </Row>
        );
    }
}

EmailView.propTypes = {
    email: PropTypes.shape({
        entities: PropTypes.objectOf(PropTypes.array.isRequired),
        body: PropTypes.arrayOf(PropTypes.string.isRequired),
        subject: PropTypes.arrayOf(PropTypes.string.isRequired),
    }).isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            docId: PropTypes.string,
        }),
    }).isRequired,
    onDocIdUpdated: PropTypes.func.isRequired,
    getEmail: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(EmailView);
