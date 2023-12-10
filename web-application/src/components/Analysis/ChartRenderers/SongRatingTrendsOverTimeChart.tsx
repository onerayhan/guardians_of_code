import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface SongRating {
    song_id: string;
    rating: number;
    rating_timestamp: string; // This should be in ISO format or similar for ease of parsing
}

interface SongRatingTrendsOverTimeChartProps {
    data: SongRating[];
}

const SongRatingTrendsOverTimeChart: React.FC<SongRatingTrendsOverTimeChartProps> = ({ data }) => {
    const chartRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!data || data.length === 0 || !chartRef.current) {
            return;
        }

        const svg = d3.select(chartRef.current);
        svg.selectAll("*").remove(); // Clear any existing content

        const margin = { top: 20, right: 20, bottom: 30, left: 50 };
        const width = 960 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        // Parse the date / time
        const parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");

        // Set the ranges
        const x = d3.scaleTime().range([0, width]);
        const y = d3.scaleLinear().range([height, 0]);


        const valueline = d3.line<SongRating>()
            // Define the line
            // @ts-ignore
            .x(d => x(parseTime(d.rating_timestamp)))
            .y(d => y(d.rating));

        // Append the svg object to the body of the page
        const chartSvg = svg.append("g")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Scale the range of the data

        // @ts-ignore
        x.domain(d3.extent(data, d => parseTime(d.rating_timestamp)));

        // @ts-ignore
        y.domain([0, d3.max(data, d => d.rating)]);

        // Add the valueline path.
        chartSvg.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline);

        // Add the X Axis
        chartSvg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        // Add the Y Axis
        chartSvg.append("g")
            .call(d3.axisLeft(y));

    }, [data]);

    return <svg ref={chartRef} width="960" height="500"></svg>;
};

export default SongRatingTrendsOverTimeChart;