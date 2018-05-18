import React, { Component } from 'react';
import { BarChart, ResponsiveContainer, Bar, Tooltip, YAxis, XAxis, Brush, Cell } from 'recharts';
import PropTypes from 'prop-types';
import './EmailListHistogram.css';
import Spinner from '../Spinner/Spinner';

class EmailListHistogram extends Component {
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
            return <Spinner />;
        }
        return (
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
                    <Tooltip />
                    <Brush dataKey="date" height={20} stroke="#007bff" />
                    <Bar dataKey="count" onClick={this.handleClick}>
                        {
                            this.props.dates.map((entry, index) => (
                                <Cell
                                    cursor="pointer"
                                    fill={index === this.state.activeIndex ? '#444448' : '#007bff'}
                                    key={`cell-${entry}`}
                                />
                            ))
                        }
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        );
    }
}

EmailListHistogram.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    dates: PropTypes.arrayOf(PropTypes.shape({
        date: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
    })).isRequired,
};

export default EmailListHistogram;
