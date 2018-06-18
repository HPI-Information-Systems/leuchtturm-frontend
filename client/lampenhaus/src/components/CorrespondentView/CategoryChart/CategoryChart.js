import React, { Component } from 'react';
import { CardBody } from 'reactstrap';
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Radar,
} from 'recharts';
import PropTypes from 'prop-types';
import Spinner from '../../Spinner/Spinner';
import './CategoryChart.css';

// eslint-disable-next-line react/prefer-stateless-function
class CategoryChart extends Component {
    render() {
        let categoryElements;

        if (this.props.categories.length === 0) {
            categoryElements = 'No categories with selected filters';
        } else {
            categoryElements = (
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                        data={this.props.categories}
                    >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="key" />
                        <PolarRadiusAxis scale="log" domain={['auto', 'auto']} />
                        <Radar name="categories" dataKey="share" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    </RadarChart>
                </ResponsiveContainer>
            );
        }

        return this.props.isFetching ? <Spinner /> : <CardBody> { categoryElements } </CardBody>;
    }
}

CategoryChart.propTypes = {
    categories: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        num: PropTypes.number.isRequired,
        share: PropTypes.number.isRequired,
    })).isRequired,
    isFetching: PropTypes.bool.isRequired,
};

export default CategoryChart;
