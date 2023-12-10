import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface GenrePreference {
    user: string;
    genres: { [genre: string]: number };
}

interface FollowingsGenrePreferencesChartProps {
    data: GenrePreference[];
}

const FollowingsGenrePreferencesChart: React.FC<FollowingsGenrePreferencesChartProps> = ({ data }) => {
    const chartRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!data || data.length === 0) {
            return;
        }

        const svg = d3.select(chartRef.current);
        svg.selectAll("*").remove();

        const margin = { top: 20, right: 20, bottom: 30, left: 50 };
        const width = 960 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const chartSvg = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const genres = new Set(data.flatMap(d => Object.keys(d.genres)));
        const stack = d3.stack().keys(Array.from(genres))(data.map(d => d.genres));
        const x = d3.scaleBand().rangeRound([0, width]).paddingInner(0.1).domain(data.map(d => d.user));
        // @ts-ignore
        const y = d3.scaleLinear().rangeRound([height, 0]).domain([0, d3.max(stack, layer => d3.max(layer, d => d[1]))]);
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        chartSvg.selectAll(".serie")
            .data(stack)
            .enter().append("g")
            .attr("class", "serie")
            .attr("fill", d => color(d.key))
            .selectAll("rect")
            .data(d => d)
            .enter().append("rect")
            // @ts-ignore
            .attr("x", d => x(d.data.user))
            .attr("y", d => y(d[1]))
            .attr("height", d => y(d[0]) - y(d[1]))
            .attr("width", x.bandwidth());

        chartSvg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        chartSvg.append("g")
            .call(d3.axisLeft(y));
    }, [data]);

    return <svg ref={chartRef} width="960" height="500"></svg>;
};

export default FollowingsGenrePreferencesChart;