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
            activeDateGap: 'months',
            startIndex: 0,
            endIndex: 0,
        };

        this.handleClick = this.handleClick.bind(this);
        this.onChangeBrush = this.onChangeBrush.bind(this);
    }

    componentWillReceiveProps() {
        if (this.props.hasData && this.props.dates.months.length > 0 && this.state.endIndex === 0) {
            this.setEndIndex(this.props.dates.months.length - 1);
        }
    }

    onChangeBrush(data) {
        if (data.endIndex - data.startIndex < 5) {
            if (this.state.activeDateGap === 'months') {
                this.setState({ activeDateGap: 'weeks' });
                this.setStartIndex(data.startIndex * 4.5);
                this.setEndIndex(data.endIndex * 4.5);
            } else if (this.state.activeDateGap === 'weeks') {
                this.setState({ activeDateGap: 'days' });
                this.setStartIndex(data.startIndex * 7);
                this.setEndIndex(data.endIndex * 7);
            }
        }
        if (data.endIndex - data.startIndex > 50) {
            if (this.state.activeDateGap === 'days') {
                this.setState({ activeDateGap: 'weeks' });
                this.setStartIndex(data.startIndex / 7);
                this.setEndIndex(data.endIndex / 7);
            } else if (this.state.activeDateGap === 'weeks') {
                this.setState({ activeDateGap: 'months' });
                this.setStartIndex(data.startIndex / 4.5);
                this.setEndIndex(data.endIndex / 4.5);
            }
        }
    }

    setEndIndex(index) {
        this.setState({ endIndex: Math.ceil(index) });
    }

    setStartIndex(index) {
        this.setState({ startIndex: Math.floor(index) });
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
        } else if (this.props.hasData && this.props.dates.months.length > 0) {
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={this.props.dates[this.state.activeDateGap]}
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
                        <Brush
                            dataKey="date"
                            height={20}
                            stroke="#007bff"
                            onChange={this.onChangeBrush}
                            startIndex={this.state.startIndex}
                            endIndex={this.state.endIndex}
                        />
                        <Bar dataKey="count" onClick={this.handleClick}>
                            {
                                this.props.dates.days.map((entry, index) => (
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
        return 'No Email dates found.';
    }
}

EmailListHistogram.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    hasData: PropTypes.bool.isRequired,
    dates: PropTypes.shape({
        months: PropTypes.arrayOf(PropTypes.shape({
            date: PropTypes.string.isRequired,
            count: PropTypes.number.isRequired,
        })),
        weeks: PropTypes.arrayOf(PropTypes.shape({
            date: PropTypes.string.isRequired,
            count: PropTypes.number.isRequired,
        })),
        days: PropTypes.arrayOf(PropTypes.shape({
            date: PropTypes.string.isRequired,
            count: PropTypes.number.isRequired,
        })),
    }).isRequired,
};

export default EmailListHistogram;
