import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface GenrePreference {
    genre: string;
    count: number;
}

interface UserGenrePreferencesChartProps {
    data: GenrePreference[];
}

const UserGenrePreferencesChart: React.FC<UserGenrePreferencesChartProps> = ({ data }) => {
    const chartRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const svg = d3.select(chartRef.current);
        svg.selectAll("*").remove(); // Clear existing content

        const width = 960;
        const height = 500;
        const radius = Math.min(width, height) / 2;

        const chartSvg = svg.append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const pie = d3.pie<GenrePreference>()
            .value(d => d.count);

        const path = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(0);

        const label = d3.arc()
            .outerRadius(radius - 40)
            .innerRadius(radius - 40);

        const arcs = chartSvg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

        arcs.append("path")
            // @ts-ignore
            .attr("d", path)
            .attr("fill", d => color(d.data.genre));

        arcs.append("text")
            // @ts-ignore
            .attr("transform", d => `translate(${label.centroid(d)})`)
            .text(d => d.data.genre)
            .style("text-anchor", "middle");

    }, [data]);

    return <svg ref={chartRef} width="960" height="500"></svg>;
};

export default UserGenrePreferencesChart;