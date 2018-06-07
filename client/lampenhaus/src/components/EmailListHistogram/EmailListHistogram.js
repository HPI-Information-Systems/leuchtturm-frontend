import React, { Component } from 'react';
import { BarChart, ResponsiveContainer, Tooltip, YAxis, XAxis, Brush, Bar } from 'recharts';
import PropTypes from 'prop-types';
import './EmailListHistogram.css';
import Spinner from '../Spinner/Spinner';

class EmailListHistogram extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: -1,
            activeDateGap: 'month',
            startIndex: 0,
            endIndex: 0,
        };

        this.handleClick = this.handleClick.bind(this);
        this.onChangeBrush = this.onChangeBrush.bind(this);
    }

    componentWillReceiveProps() {
        if (this.props.hasData && this.props.dates.month.length > 0 && this.state.endIndex === 0) {
            this.setEndIndex(this.props.dates.month.length - 1);
        }
    }

    onChangeBrush(data) {
        if (data.endIndex - data.startIndex < 5) {
            if (this.state.activeDateGap === 'month') {
                this.setState({ activeDateGap: 'week' });
                this.setStartIndex(data.startIndex * 4.5);
                this.setEndIndex(data.endIndex * 4.5);
            } else if (this.state.activeDateGap === 'week') {
                this.setState({ activeDateGap: 'day' });
                this.setStartIndex(data.startIndex * 7);
                this.setEndIndex(data.endIndex * 7);
            }
        }
        if (data.endIndex - data.startIndex > 50) {
            if (this.state.activeDateGap === 'day') {
                this.setState({ activeDateGap: 'week' });
                this.setStartIndex(data.startIndex / 7);
                this.setEndIndex(data.endIndex / 7);
            } else if (this.state.activeDateGap === 'week') {
                this.setState({ activeDateGap: 'month' });
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
        } else if (this.props.hasData && this.props.dates.month.length > 0) {
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
                        <Tooltip itemSorter={(a, b) => {
                            if (a.dataKey < b.dataKey) return 1;
                            if (a.dataKey > b.dataKey) return -1;
                            return 0;
                        }}
                        />
                        <Brush
                            dataKey="date"
                            height={20}
                            stroke="#007bff"
                            onChange={this.onChangeBrush}
                            startIndex={this.state.startIndex}
                            endIndex={this.state.endIndex}
                        />
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
                        />
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
        month: PropTypes.arrayOf(PropTypes.shape({
            date: PropTypes.string.isRequired,
            business: PropTypes.number.isRequired,
            personal: PropTypes.number.isRequired,
            spam: PropTypes.number.isRequired,
        })),
        week: PropTypes.arrayOf(PropTypes.shape({
            date: PropTypes.string.isRequired,
            business: PropTypes.number.isRequired,
            personal: PropTypes.number.isRequired,
            spam: PropTypes.number.isRequired,
        })),
        day: PropTypes.arrayOf(PropTypes.shape({
            date: PropTypes.string.isRequired,
            business: PropTypes.number.isRequired,
            personal: PropTypes.number.isRequired,
            spam: PropTypes.number.isRequired,
        })),
    }).isRequired,
};

export default EmailListHistogram;
