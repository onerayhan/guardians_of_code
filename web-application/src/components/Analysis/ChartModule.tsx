import React, {useEffect, useState} from 'react';
import { useAuthUser } from "react-auth-kit";
import {
    TableContainer, Table, Thead, Tr, Th, Tbody, Td,
    Select, Button, Stack, Tag, TagLabel, TagCloseButton,
    Box, Flex, Heading
} from '@chakra-ui/react';

interface ChartModuleProps {
    data: any[]; // Replace 'any' with your specific data type
}

const ChartModule: React.FC<ChartModuleProps> = () => {
    const [chart, setChart] = useState<string>('');
    const [chartType, setChartType] = useState<string>('');

    const handleChartChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setChart(event.target.value);
    };

    const handleChartTChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setChartType(event.target.value);
    };

    // Every time chart type changes, I re-render the chart
    useEffect(() => {
        switch (chart) {
            case "Top 10 Songs":
                // Logic for Top 10 Songs
                break;
            case "Top 10 Artists":
                // Logic for Top 10 Artists
                break;
            case "Top 10 Albums":
                // Logic for Top 10 Albums
                break;
            case "Top 10 Genres":
                // Logic for Top 10 Genres
                break;
            case "Top 10 Decades":
                // Logic for Top 10 Decades
                break;
            default:
            // Default case logic (if needed)
        }

        switch (chartType) {
            case "bar-chart":
                // Render bar chart
                break;
            case "line-chart":
                // Render line chart
                break;
            case "pie-chart":
                // Render pie chart
                break;
            default:

        }
    }, [chart, chartType]);


    return (
        <div className="py-20 text-center">
            <h1 className="text-6xl font-bold">Get Charts About Your Activity!</h1>
            <div className="py-2"></div>
            <p className="text-xl font-bold">Select the chart type you want to see.</p>
            <p className="text-xl font-bold">Simply refer to the dropdown menu right below.</p>
            <div className="py-8"></div>
            <Flex align="center" justify="center">
                <Heading as="h3" size="lg" mr={4}>Select The Chart Type:</Heading>
                <Select value={chart} onChange={handleChartChange} size="sm" mr={2} w="300px">
                    <option value="Top 10 Songs" className="text-black">Top 10 Songs</option>
                    <option value="Top 10 Artists" className="text-black">Top 10 Artists</option>
                    <option value="Top 10 Albums" className="text-black">Top 10 Albums</option>
                    <option value="Top 10 Genres" className="text-black">Top 10 Genres</option>
                    <option value="Top 10 Decades" className="text-black">Top 10 Decades</option>
                </Select>
                <Select value={chart} onChange={handleChartTChange} size="sm" mr={2} w="300px">
                    <option value="bar-chart" className="text-black">Bar Chart</option>
                    <option value="line-chart" className="text-black">Line Chart</option>
                    <option value="pie-chart" className="text-black">Pie Chart</option>
                </Select>
            </Flex>
            <Box mt={10}>
                {/* Placeholder for chart rendering */}
                <p>Chart will be rendered here.</p>
                {/* Implement your chart component or logic here */}
            </Box>
        </div>
    );
}

export default ChartModule;