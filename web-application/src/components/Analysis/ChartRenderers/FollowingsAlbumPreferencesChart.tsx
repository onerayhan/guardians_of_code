import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface AlbumPreference {
    user: string;
    albums: { [album: string]: number };
}

interface FollowingsAlbumPreferencesChartProps {
    data: AlbumPreference[];
}

const FollowingsAlbumPreferencesChart: React.FC<FollowingsAlbumPreferencesChartProps> = ({ data }) => {
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

        const albums = new Set(data.flatMap(d => Object.keys(d.albums)));
        const x0 = d3.scaleBand().rangeRound([0, width]).paddingInner(0.1).domain(data.map(d => d.user));
        const x1 = d3.scaleBand().padding(0.05).domain(Array.from(albums)).rangeRound([0, x0.bandwidth()]);
        // @ts-ignore
        const y = d3.scaleLinear().rangeRound([height, 0]).domain([0, d3.max(data, d => d3.max(Object.values(d.albums)))]);

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        chartSvg.append("g")
            .selectAll("g")
            .data(data)
            .enter().append("g")
            .attr("transform", d => `translate(${x0(d.user)},0)`)
            .selectAll("rect")
            .data(d => Array.from(albums).map(key => ({ key, value: d.albums[key] })))
            .enter().append("rect")
            // @ts-ignore
            .attr("x", d => x1(d.key))
            .attr("y", d => y(d.value))
            .attr("width", x1.bandwidth())
            .attr("height", d => height - y(d.value))
            .attr("fill", d => color(d.key));

        chartSvg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x0));

        chartSvg.append("g")
            .call(d3.axisLeft(y));
    }, [data]);

    return <svg ref={chartRef} width="960" height="500"></svg>;
};

export default FollowingsAlbumPreferencesChart;