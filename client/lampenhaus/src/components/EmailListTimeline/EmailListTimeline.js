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
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Button,
} from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import './EmailListTimeline.css';
import Spinner from '../Spinner/Spinner';

class EmailListTimeline extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeDateGap: props.defaultDateGap,
            startIndex: 0,
            endIndex: 0,
            automaticGapSwitch: true,
            dateFilterButtonEnabled: false,
        };
        this.currentStartIndex = 0;
        this.currentEndIndex = 0;

        this.onChangeBrush = this.onChangeBrush.bind(this);
        this.filterByBrushRange = this.filterByBrushRange.bind(this);
        this.switchActiveGap = this.switchActiveGap.bind(this);
        this.decideGapSwitch = this.decideGapSwitch.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.static &&
            !this.props.hasData && nextProps.hasData && nextProps.dates[this.state.activeDateGap]) {
            this.currentEndIndex = nextProps.dates[this.state.activeDateGap].length - 1;
            this.setState({ endIndex: Math.floor(this.currentEndIndex) });
        }
    }

    componentDidUpdate(lastProps, lastState) {
        if (!this.props.static &&
            this.state.automaticGapSwitch && this.props.hasData
            && (this.props.dates !== lastProps.dates
            || (!lastState.automaticGapSwitch && this.state.automaticGapSwitch)
            || this.state.activeDateGap !== lastState.activeDateGap)) {
            this.decideGapSwitch();
        }
    }

    onChangeBrush(data) {
        const fullRangeSelected = this.currentEndIndex === this.props.dates[this.state.activeDateGap].length - 1
                                    && this.currentStartIndex === 0;
        if (!this.state.dateFilterButtonEnabled && !fullRangeSelected) {
            this.setState({ dateFilterButtonEnabled: true });
        } else if (this.state.dateFilterButtonEnabled && fullRangeSelected) {
            this.setState({ dateFilterButtonEnabled: false });
        }
        this.currentStartIndex = data.startIndex;
        this.currentEndIndex = data.endIndex;
        if (this.state.automaticGapSwitch) {
            this.decideGapSwitch();
        }
    }

    onGroupingDropDownItemClick(newGap) {
        this.setState({ automaticGapSwitch: false });
        this.switchActiveGap(this.state.activeDateGap, newGap);
    }

    decideGapSwitch() {
        if ((this.currentEndIndex - this.currentStartIndex) < 5) {
            if (this.state.activeDateGap === 'month') {
                this.switchActiveGap('month', 'week');
            } else if (this.state.activeDateGap === 'week') {
                this.switchActiveGap('week', 'day');
            }
        } else if ((this.currentEndIndex - this.currentStartIndex) > 35 &&
            this.state.activeDateGap === 'day') {
            this.switchActiveGap('day', 'week');
        } else if ((this.currentEndIndex - this.currentStartIndex) > 22 &&
            this.state.activeDateGap === 'week') {
            this.switchActiveGap('week', 'month');
        }
    }

    switchActiveGap(currentGap, newGap) {
        let newStartIndex;
        let newEndIndex;
        if (currentGap === 'month' && newGap === 'week') {
            newStartIndex = this.currentStartIndex * 4.35;
            newEndIndex = this.currentEndIndex * 4.35;
        } else if (currentGap === 'week' && newGap === 'month') {
            newStartIndex = this.currentStartIndex / 4.35;
            newEndIndex = this.currentEndIndex / 4.35;
        } else if (currentGap === 'week' && newGap === 'day') {
            newStartIndex = this.currentStartIndex * 7;
            newEndIndex = this.currentEndIndex * 7;
        } else if (currentGap === 'day' && newGap === 'week') {
            newStartIndex = this.currentStartIndex / 7;
            newEndIndex = this.currentEndIndex / 7;
        } else if (currentGap === 'month' && newGap === 'day') {
            newStartIndex = this.currentStartIndex * 4.35 * 7;
            newEndIndex = this.currentEndIndex * 4.35 * 7;
        } else if (currentGap === 'day' && newGap === 'month') {
            newStartIndex = (this.currentStartIndex / 4.35) / 7;
            newEndIndex = (this.currentEndIndex / 4.35) / 7;
        }

        this.currentStartIndex = Math.floor(newStartIndex);
        if (this.currentStartIndex < 0) {
            this.currentStartIndex = 0;
        }
        this.currentEndIndex = Math.ceil(newEndIndex);
        if (this.currentEndIndex > this.props.dates[newGap].length - 1) {
            this.currentEndIndex = this.props.dates[newGap].length - 1;
        }
        this.setState({ activeDateGap: newGap });
        this.setState({ startIndex: this.currentStartIndex });
        this.setState({ endIndex: this.currentEndIndex });
    }

    filterByBrushRange() {
        const splittedStartDate = this.props.dates[this.state.activeDateGap][Math.floor(this.currentStartIndex)].date
            .split(' - ')[0]
            .split('/')
            .reverse();
        const splittedEndDate = this.props.dates[this.state.activeDateGap][Math.ceil(this.currentEndIndex)].date
            .split(' - ').reverse()[0]
            .split('/')
            .reverse();
        const lastDayOfMonth = String(new Date(Number(splittedEndDate[0]), Number(splittedEndDate[1]), 0).getDate());

        const { globalFilter } = this.props;
        globalFilter.startDate = `${splittedStartDate[0]}-${splittedStartDate[1]}-` +
            `${splittedStartDate[2] ? splittedStartDate[2] : '01'}`;
        globalFilter.endDate = `${splittedEndDate[0]}-${splittedEndDate[1]}-` +
            `${splittedEndDate[2] ? splittedEndDate[2] : lastDayOfMonth}`;

        this.setState({ dateFilterButtonEnabled: false });
        this.setState({ startIndex: 0 });
        this.setState({ endIndex: 0 });
        this.props.setShouldFetchData(true);
        this.props.handleGlobalFilterChange(globalFilter);
    }

    render() {
        let timeline = 'No Email dates found.';
        if (this.props.isFetching) {
            timeline = <Spinner />;
        } else if (this.props.hasData && this.props.dates[this.state.activeDateGap].length > 0) {
            timeline = (
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
                        <Tooltip
                            itemSorter={(a, b) => {
                                if (a.dataKey < b.dataKey) return 1;
                                if (a.dataKey > b.dataKey) return -1;
                                return 0;
                            }}
                            itemStyle={{ textTransform: 'capitalize' }}
                        />
                        {!this.props.static &&
                            <Brush
                                dataKey="date"
                                height={20}
                                stroke="#007bff"
                                onChange={this.onChangeBrush}
                                startIndex={this.state.startIndex}
                                endIndex={this.state.endIndex}
                                travellerWidth={20}
                            />
                        }
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
                    {!this.props.static && !this.props.hasRequestError && this.props.hasData &&
                        <UncontrolledDropdown
                            size="sm"
                            className="pull-right card-header-dropdown d-inline-block ml-2"
                        >
                            <DropdownToggle
                                className="timeline-grouping-toggle"
                                caret
                            >
                                {this.state.automaticGapSwitch && 'Auto - '}
                                {this.state.activeDateGap}
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem header>Group by</DropdownItem>
                                <DropdownItem
                                    onClick={() => this.setState({ automaticGapSwitch: true })}
                                >
                                    Auto
                                </DropdownItem>
                                <DropdownItem
                                    onClick={() => this.onGroupingDropDownItemClick('month')}
                                >
                                    Month
                                </DropdownItem>
                                <DropdownItem
                                    onClick={() => this.onGroupingDropDownItemClick('week')}
                                >
                                    Week
                                </DropdownItem>
                                <DropdownItem
                                    onClick={() => this.onGroupingDropDownItemClick('day')}
                                >
                                    Day
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    }
                    {!this.props.static && this.state.dateFilterButtonEnabled &&
                        <Button
                            color="primary"
                            className="pull-right card-header-button mr-2"
                            size="sm"
                            onClick={this.filterByBrushRange}
                        >
                            <FontAwesome name="filter" className="mr-2" />
                            Filter Date Range
                        </Button>
                    }
                </CardHeader>
                {this.props.hasRequestError ?
                    <CardBody className="text-danger">
                        An error occurred while requesting the Email dates.
                    </CardBody>
                    :
                    <CardBody>
                        { timeline }
                    </CardBody>
                }
            </Card>
        );
    }
}

EmailListTimeline.defaultProps = {
    defaultDateGap: 'month',
    static: false,
};

EmailListTimeline.propTypes = {
    defaultDateGap: PropTypes.string,
    static: PropTypes.bool,
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
    globalFilter: PropTypes.shape({
        searchTerm: PropTypes.string.isRequired,
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired,
        sender: PropTypes.string.isRequired,
        recipient: PropTypes.string.isRequired,
        selectedTopics: PropTypes.array.isRequired,
        topicThreshold: PropTypes.number.isRequired,
        selectedEmailClasses: PropTypes.array.isRequired,
    }).isRequired,
    handleGlobalFilterChange: PropTypes.func.isRequired,
    setShouldFetchData: PropTypes.func.isRequired,
};

export default EmailListTimeline;
