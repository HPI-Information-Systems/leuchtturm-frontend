import React, { Component } from 'react';
import { BarChart, ResponsiveContainer, Bar, CartesianGrid, Tooltip, YAxis, XAxis } from 'recharts';
import PropTypes from 'prop-types';
import './TermHistogram.css';
import Spinner from '../Spinner/Spinner';

class TermHistogram extends Component {
    /* updateTerm(pTerm) {
        this.setState({ term: pTerm });
    } */

    render() {
        if (this.props.isFetching) {
            return (<Spinner />);
        }
        const chart = (
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    width={600}
                    height={300}
                    data={this.props.dates}
                    margin={
                        {
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }
                    }
                >
                    <XAxis dataKey="date" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#007bff" />
                </BarChart>
            </ResponsiveContainer>
        );
        return (chart);
    }
}

TermHistogram.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    dates: PropTypes.arrayOf(PropTypes.shape({
        date: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
    })).isRequired,
    // isFetching: PropTypes.bool,
};

export default TermHistogram;
