import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, UncontrolledTooltip, Card, CardHeader, CardBody } from 'reactstrap';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.errorInfo) {
            return this.props.displayAsCard ? (
                <Card className="text-danger">
                    <CardHeader tag="h4">{this.props.info}</CardHeader>
                    <CardBody>{this.state.error && this.state.error.toString()}</CardBody>
                </Card>
            ) : (
                <div>
                    <Alert color="danger" id="error">{this.props.info}</Alert>
                    <UncontrolledTooltip placement="bottom" target="error">
                        {this.state.error && this.state.error.toString()}
                    </UncontrolledTooltip>
                </div>
            );
        }
        return this.props.children;
    }
}

ErrorBoundary.defaultProps = {
    displayAsCard: false,
    info: 'Something went wrong.',
};

ErrorBoundary.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]).isRequired,
    displayAsCard: PropTypes.bool,
    info: PropTypes.string,
};

export default ErrorBoundary;
