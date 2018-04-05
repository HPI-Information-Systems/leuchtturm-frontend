import React, { Component } from 'react';
import { BarChart, ResponsiveContainer, Bar, CartesianGrid, Tooltip, YAxis, XAxis, Brush, Cell } from 'recharts';
import PropTypes from 'prop-types';
import './TermHistogram.css';
import Spinner from '../Spinner/Spinner';

class TermHistogram extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: -1,
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(data, index) {
        if (index !== this.state.activeIndex) {
            this.setState({
                activeIndex: index,
            });
        }
    }

    render() {
        if (this.props.isFetching) {
            return (<Spinner />);
        }
        const chart = (
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={this.props.dates}
                    margin={
                        {
                            top: 0,
                            right: 65,
                            left: 0,
                            bottom: 0,
                        }
                    }
                >
                    <XAxis dataKey="date" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Brush dataKey="date" height={20} stroke="#8884d8" />
                    <Bar dataKey="count" onClick={this.handleClick}>
                        {
                            this.props.dates.map((entry, index) => (
                                <Cell
                                    cursor="pointer"
                                    fill={index === this.state.activeIndex ? '#82ca9d' : '#8884d8'}
                                    key={`cell-${entry}`}
                                />
                            ))
                        }
                    </Bar>
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
};

export default TermHistogram;
