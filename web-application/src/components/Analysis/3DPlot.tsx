import React, { useEffect } from 'react';
import Plotly from 'plotly.js/dist/plotly.min.js';

interface Row {
    username: string;
    group: string;
    name: string;
    rating: number;
}

interface ThreeDPlotProps {
    data: Row[];
}

const ThreeDPlot: React.FC<ThreeDPlotProps> = ({ data }) => {
    useEffect(() => {
        const unpack = (rows: Row[], key: keyof Row) => {
            return rows.map(row => row[key]);
        };

        const groupBy = (data, key) => {
            return data.reduce((acc, row) => {
                (acc[row[key]] = acc[row[key]] || []).push(row);
                return acc;
            }, {});
        };

        const getRandomColor = () => {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        };

        const groupedData = groupBy(data, 'group');

        const plotData = Object.keys(groupedData).map(group => {
            const groupData = groupedData[group];
            return {
                x: unpack(groupData, 'username'),
                y: unpack(groupData, 'name'),
                z: unpack(groupData, 'rating'),
                mode: 'markers',
                marker: {
                    size: 12,
                    color: getRandomColor(),
                    line: {
                        color: 'rgba(217, 217, 217, 0.14)',
                        width: 0.5
                    },
                    opacity: 0.8
                },
                type: 'scatter3d',
                name: group
            };
        });

        const layout = {
            margin: {
                l: 0,
                r: 0,
                b: 0,
                t: 0
            },
            xaxis: { title: 'Username' },
            yaxis: { title: 'Name' },
            zaxis: { title: 'Rating' }
        };

        Plotly.newPlot('myDiv', plotData, layout);
    }, [data]);

    return <div id="myDiv" className="rounded-xl"/>;
};

export default ThreeDPlot;
