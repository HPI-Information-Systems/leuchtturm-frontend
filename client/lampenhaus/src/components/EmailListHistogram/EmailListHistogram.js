import React, { Component } from 'react';
import {
    BarChart,
    ResponsiveContainer,
    Bar,
    Tooltip,
    YAxis,
    XAxis,
    Brush,
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
            activeDateGap: 'month',
            startIndex: 0,
            endIndex: 0,
            automaticGapSwitch: true,
            dropdownOpen: false,
        };
        this.startIndex = 0;
        this.endIndex = 0;

        this.onChangeBrush = this.onChangeBrush.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.hasData && nextProps.hasData && nextProps.dates.month) {
            this.endIndex = nextProps.dates.month.length - 1;
            this.setEndIndex(nextProps.dates.month.length - 1);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevState.automaticGapSwitch && this.state.automaticGapSwitch) {
            this.decideGapSwitch();
        }
    }

    onChangeBrush(data) {
        this.startIndex = data.startIndex;
        this.endIndex = data.endIndex;
        if (this.state.automaticGapSwitch) {
            this.decideGapSwitch();
        }
    }

    setEndIndex(index) {
        this.setState({ endIndex: Math.floor(index) });
    }

    setStartIndex(index) {
        this.setState({ startIndex: Math.ceil(index) });
    }

    setAutomaticGapSwitch(value) {
        this.setState({ automaticGapSwitch: value });
        if (value) {
            this.decideGapSwitch();
        }
    }

    decideGapSwitch() {
        if ((this.endIndex - this.startIndex) < 5) {
            if (this.state.activeDateGap === 'month') {
                this.switchActiveGap('month', 'week');
            } else if (this.state.activeDateGap === 'week') {
                this.switchActiveGap('week', 'day');
            }
        } else if ((this.endIndex - this.startIndex) > 30 &&
            this.state.activeDateGap === 'day') {
            this.switchActiveGap('day', 'week');
        } else if ((this.endIndex - this.startIndex) > 22 &&
            this.state.activeDateGap === 'week') {
            this.switchActiveGap('week', 'month');
        }
    }

    toggleDropdown() {
        this.setState({ dropdownOpen: !this.state.dropdownOpen });
    }

    switchActiveGap(currentGap, newGap) {
        if (currentGap === 'month' && newGap === 'week') {
            this.startIndex = this.startIndex * 4.35;
            this.endIndex = this.endIndex * 4.35;
        } else if (currentGap === 'week' && newGap === 'month') {
            this.startIndex = this.startIndex / 4.35;
            this.endIndex = this.endIndex / 4.35;
        } else if (currentGap === 'week' && newGap === 'day') {
            this.startIndex = this.startIndex * 7;
            this.endIndex = this.endIndex * 7;
        } else if (currentGap === 'day' && newGap === 'week') {
            this.startIndex = this.startIndex / 7;
            this.endIndex = this.endIndex / 7;
        } else if (currentGap === 'month' && newGap === 'day') {
            this.startIndex = this.startIndex * 4.35 * 7;
            this.endIndex = this.endIndex * 4.35 * 7;
        } else if (currentGap === 'day' && newGap === 'month') {
            this.startIndex = (this.startIndex / 4.35) / 7;
            this.endIndex = (this.endIndex / 4.35) / 7;
        }

        this.setState({ activeDateGap: newGap });
        this.setStartIndex(this.startIndex);
        this.setEndIndex(this.endIndex);
    }

    render() {
        let histogram = 'No Email dates found.';
        if (this.props.isFetching) {
            histogram = <Spinner />;
        } else if (this.props.hasData && this.props.dates.month.length > 0) {
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

        return (
            <Card className={this.props.className}>
                <CardHeader tag="h4">
                    Timeline
                    {!this.props.hasRequestError && this.props.hasData &&
                        <div className="pull-right">
                            <span className="mr-2">Grouping:</span>
                            <ButtonGroup size="sm">
                                <Button
                                    onClick={() => this.setAutomaticGapSwitch(true)}
                                    active={this.state.automaticGapSwitch}
                                >
                                    Auto
                                </Button>
                                <Button
                                    onClick={() => this.setAutomaticGapSwitch(false)}
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
                                        onClick={() => this.switchActiveGap(this.state.activeDateGap, 'month')}
                                    >
                                        Month
                                    </DropdownItem>
                                    <DropdownItem
                                        onClick={() => this.switchActiveGap(this.state.activeDateGap, 'week')}
                                    >
                                        Week
                                    </DropdownItem>
                                    <DropdownItem
                                        onClick={() => this.switchActiveGap(this.state.activeDateGap, 'day')}
                                    >
                                        Day
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
    hasRequestError: PropTypes.bool.isRequired,
};

export default EmailListHistogram;
