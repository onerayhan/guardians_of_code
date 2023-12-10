import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface AlbumRating {
    album_id: string;
    rating: number;
}

interface AlbumRatingDistributionChartProps {
    data: AlbumRating[];
}

const AlbumRatingDistributionChart: React.FC<AlbumRatingDistributionChartProps> = ({ data }) => {
    const chartRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const svg = d3.select(chartRef.current);
        svg.selectAll("*").remove(); // Clear existing content

        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = 960 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const x = d3.scaleBand().range([0, width]).padding(0.1);
        const y = d3.scaleLinear().range([height, 0]);

        const chartSvg = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        x.domain(data.map(d => d.album_id));
        // @ts-ignore
        y.domain([0, d3.max(data, d => d.rating)]);

        chartSvg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")

            // @ts-ignore
            .attr("x", d => x(d.album_id))
            .attr("width", x.bandwidth())
            .attr("y", d => y(d.rating))
            .attr("height", d => height - y(d.rating));

        chartSvg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        chartSvg.append("g")
            .call(d3.axisLeft(y));
    }, [data]);

    return <svg ref={chartRef} width="960" height="500"></svg>;
};

export default AlbumRatingDistributionChart;