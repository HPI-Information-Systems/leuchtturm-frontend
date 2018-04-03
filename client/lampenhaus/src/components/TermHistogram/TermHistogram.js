import React, { Component } from 'react';
import { BarChart, Bar, CartesianGrid, Tooltip, YAxis, XAxis, Legend } from 'recharts';
import PropTypes from 'prop-types';
// import 'recharts';
import './TermHistogram.css';
// import Spinner from '../Spinner/Spinner';

// eslint-disable-next-line react/prefer-stateless-function


class TermHistogram extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    /* updateTerm(pTerm) {
        this.setState({ term: pTerm });
    } */

    render() {
        /*  const dataa = [
            {
                name: 'Page A', uv: 4000, pv: 2400, amt: 2400,
            },
            {
                name: 'Page D', uv: 2780, pv: 3908, amt: 2000,
            },
            {
                name: 'Page E', uv: 1890, pv: 4800, amt: 2181,
            },
            {
                name: 'Page C', uv: 2000, pv: 9800, amt: 2290,
            },
            {
                name: 'Page B', uv: 3000, pv: 1398, amt: 2210,
            },
            {
                name: 'Page F', uv: 2390, pv: 3800, amt: 2500,
            },
            {
                name: 'Page G', uv: 3490, pv: 4300, amt: 2100,
            },
            {
                name: this.state.term, uv: 2300, pv: 7344, amt: 2300,
            },
            {
                name: this.props.term, uv: 2300, pv: 7344, amt: 2300,
            },
        ]; */

        const data = this.props.dates;

        const chart = (
            <BarChart
                width={600}
                height={300}
                data={data}
                margin={
                    {
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }
                }
            >
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Bar dataKey="date" fill="#007bff" />
            </BarChart>
        );
        return (chart);
    }
}
TermHistogram.propTypes = {
    dates: PropTypes.arrayOf(PropTypes.shape({
        date: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
    })).isRequired,
    // isFetching: PropTypes.bool,
};

export default TermHistogram;
