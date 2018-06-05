import React, { Component } from 'react';
import { AreaChart, ResponsiveContainer, Tooltip, YAxis, XAxis, Brush, Area } from 'recharts';
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
                <AreaChart
                    data={this.props.dates}
                    margin={{
                        top: 0,
                        right: 65,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorBusiness" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorPersonal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorSpam" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#87ca9d" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#87ca9d" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Brush dataKey="date" height={20} stroke="#007bff" />
                    <Area
                        type="monotone"
                        dataKey="business"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#colorBusiness)"
                    />
                    <Area
                        type="monotone"
                        dataKey="personal"
                        stroke="#82ca9d"
                        fillOpacity={1}
                        fill="url(#colorPersonal)"
                    />
                    <Area
                        type="monotone"
                        dataKey="spam"
                        stroke="#82ca9d"
                        fillOpacity={1}
                        fill="url(#colorPersonal)"
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
                </AreaChart>
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
