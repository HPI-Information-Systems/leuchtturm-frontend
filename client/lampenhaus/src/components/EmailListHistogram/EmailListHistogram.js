import React, { Component } from 'react';
import { BarChart, ResponsiveContainer, Tooltip, YAxis, XAxis, Brush, Bar, CartesianGrid } from 'recharts';
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
        } else if (this.props.dates.length === 0) {
            return 'No Email dates found.';
        }
        return (
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={this.props.dates}
                    margin={{
                        top: 0,
                        right: 65,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Brush dataKey="date" height={20} stroke="#007bff" />
                    <Bar
                        dataKey="business"
                        stackId="stacked"
                        fill="#007bff"
                    />
                    <Bar
                        dataKey="personal"
                        stackId="stacked"
                        fill="#60adff"
                    />
                    <Bar
                        dataKey="spam"
                        stackId="stacked"
                        fill="#a5d0ff"
                        onClick=""
                    />
                    {/* <Bar dataKey="count" onClick={this.handleClick}>
                        {
                            this.props.dates.map((entry, index) => (
                                <Cell
                                    cursor="pointer"
                                    fill={index === this.state.activeIndex ? '#444448' : '#007bff'}
                                    key={`cell-${entry}`}
                                />
                            ))
                        }
                    </Bar> */}
                </BarChart>
            </ResponsiveContainer>
        );
    }
}

EmailListHistogram.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    dates: PropTypes.arrayOf(PropTypes.shape({
        date: PropTypes.string.isRequired,
        business: PropTypes.number.isRequired,
        personal: PropTypes.number.isRequired,
        spam: PropTypes.number.isRequired,
    })).isRequired,
};

export default EmailListHistogram;
