import React, { Component } from 'react';
import {
    BarChart,
    ResponsiveContainer,
    Bar,
    Tooltip,
    YAxis,
    XAxis,
    Brush,
    Cell,
} from 'recharts';
import {
    Card,
    CardBody,
    CardHeader,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Button,
    ButtonGroup,
} from 'reactstrap';
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
            automaticGapSwitch: true,
            dropdownOpen: false,
        };
        this.startIndex = 0;
        this.endIndex = 0;

        this.handleClick = this.handleClick.bind(this);
        this.onChangeBrush = this.onChangeBrush.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
    }

    componentWillReceiveProps() {
        if (this.props.hasData && this.props.dates.months.length > 0 && this.state.endIndex === 0) {
            this.setEndIndex(this.props.dates.months.length - 1);
        }
    }

    onChangeBrush(data) {
        this.startIndex = data.startIndex;
        this.endIndex = data.endIndex;
        if (this.state.automaticGapSwitch) {
            if (data.endIndex - data.startIndex < 5) {
                if (this.state.activeDateGap === 'months') {
                    this.switchActiveGap('months', 'weeks');
                } else if (this.state.activeDateGap === 'weeks') {
                    this.switchActiveGap('weeks', 'days');
                }
            }
            if (data.endIndex - data.startIndex > (5 * 7) &&
                this.state.activeDateGap === 'days') {
                this.switchActiveGap('days', 'weeks');
            } else if (data.endIndex - data.startIndex > (Math.floor(5 * 4.35)) &&
                this.state.activeDateGap === 'weeks') {
                this.switchActiveGap('weeks', 'months');
            }
        }
    }

    setEndIndex(index) {
        this.setState({ endIndex: Math.ceil(index) });
    }

    setStartIndex(index) {
        this.setState({ startIndex: Math.floor(index) });
    }

    switchActiveGap(currentGap, newGap) {
        if (currentGap === 'months' && newGap === 'weeks') {
            this.startIndex = this.startIndex * 4.35;
            this.endIndex = this.endIndex * 4.35;
        } else if (currentGap === 'weeks' && newGap === 'months') {
            this.startIndex = this.startIndex / 4.35;
            this.endIndex = this.endIndex / 4.35;
        } else if (currentGap === 'weeks' && newGap === 'days') {
            this.startIndex = this.startIndex * 7;
            this.endIndex = this.endIndex * 7;
        } else if (currentGap === 'days' && newGap === 'weeks') {
            this.startIndex = this.startIndex / 7;
            this.endIndex = this.endIndex / 7;
        } else if (currentGap === 'months' && newGap === 'days') {
            this.startIndex = this.startIndex * 4.35 * 7;
            this.endIndex = this.endIndex * 4.35 * 7;
        } else if (currentGap === 'days' && newGap === 'months') {
            this.startIndex = (this.startIndex / 4.35) / 7;
            this.endIndex = (this.endIndex / 4.35) / 7;
        }
        this.setStartIndex(this.startIndex);
        this.setEndIndex(this.endIndex);
        this.setState({ activeDateGap: newGap });
    }

    toggleDropdown() {
        this.setState({ dropdownOpen: !this.state.dropdownOpen });
    }

    handleClick(data, index) {
        if (index !== this.state.activeIndex) {
            this.setState({
                activeIndex: index,
            });
        }
    }

    render() {
        let histogram = 'No Email dates found.';
        if (this.props.isFetching) {
            histogram = <Spinner />;
        } else if (this.props.hasData && this.props.dates.months.length > 0) {
            histogram = (
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

        return (
            <Card className={this.props.className}>
                <CardHeader tag="h4">
                    Timeline
                    {!this.props.hasRequestError && this.props.hasData &&
                        <div className="pull-right">
                            <span className="mr-2">Grouping:</span>
                            <ButtonGroup size="sm">
                                <Button
                                    onClick={() => this.setState({ automaticGapSwitch: true })}
                                    active={this.state.automaticGapSwitch}
                                >
                                    Auto
                                </Button>
                                <Button
                                    onClick={() => this.setState({ automaticGapSwitch: false })}
                                    active={!this.state.automaticGapSwitch}
                                >
                                    Manual
                                </Button>
                            </ButtonGroup>
                            <Dropdown
                                isOpen={this.state.dropdownOpen}
                                toggle={this.toggleDropdown}
                                size="sm"
                                className="d-inline-block ml-2"
                            >
                                <DropdownToggle
                                    className="histogram-grouping-toggle"
                                    caret
                                    disabled={this.state.automaticGapSwitch}
                                >
                                    {this.state.activeDateGap.charAt(0).toUpperCase() +
                                        this.state.activeDateGap.slice(1)
                                    }
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem header>Group by</DropdownItem>
                                    <DropdownItem
                                        onClick={() => this.switchActiveGap(this.state.activeDateGap, 'months')}
                                    >
                                        Months
                                    </DropdownItem>
                                    <DropdownItem
                                        onClick={() => this.switchActiveGap(this.state.activeDateGap, 'weeks')}
                                    >
                                        Weeks
                                    </DropdownItem>
                                    <DropdownItem
                                        onClick={() => this.switchActiveGap(this.state.activeDateGap, 'days')}
                                    >
                                        Days
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    }
                </CardHeader>
                {this.props.hasRequestError ?
                    <CardBody className="text-danger">
                        An error occurred while requesting the Email dates.
                    </CardBody>
                    :
                    <CardBody>
                        { histogram }
                    </CardBody>
                }
            </Card>
        );
    }
}

EmailListHistogram.propTypes = {
    className: PropTypes.string.isRequired,
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
    hasRequestError: PropTypes.bool.isRequired,
};

export default EmailListHistogram;
