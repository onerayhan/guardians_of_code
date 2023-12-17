import React, { useState, useEffect, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { VStack, Flex, Select } from '@chakra-ui/react';
import { useAuthUser } from 'react-auth-kit';
import axios from 'axios';

interface SongRating {
    album: string;
    artist: string;
    external_service_id: number | null;
    genre: string | null;
    rating_timestamp: string;
    song: string;
    song_id: number;
    song_rating: number;
}

interface ProcessedData {
    [key: string]: {
        x: string[];
        y: number[];
        name: string;
    };
}

const MainChart: React.FC = () => {
    const [selectedChart, setSelectedChart] = useState<string>('');
    const [selectedSubOption, setSelectedSubOption] = useState<string>('');
    const [selectedTimeFrame, setSelectedTimeFrame] = useState<string>('');
    const [songData, setSongData] = useState<SongRating[]>([]);
    const auth = useAuthUser();

    useEffect(() => {
        const getTemporalData = async () => {
            try {
                const apiUrl = `http://51.20.128.164/api/user_song_ratings/${auth()?.username}`;
                const response = await axios.get(apiUrl);
                if (response.data && Array.isArray(response.data.homelander_song_ratings)) {
                    setSongData(response.data.homelander_song_ratings);
                } else {
                    setSongData([]);
                }
            } catch (e) {
                console.error('Error fetching song data:', e);
                setSongData([]);
            }
        };

        getTemporalData();
    }, [auth]);

    const processedData = useMemo(() => {
        let filteredData = songData;

        if (selectedTimeFrame) {
            const endDate = new Date();
            let startDate = new Date();

            switch (selectedTimeFrame) {
                case '1month':
                    startDate.setMonth(endDate.getMonth() - 1);
                    break;
                case '6months':
                    startDate.setMonth(endDate.getMonth() - 6);
                    break;
                case '1year':
                    startDate.setFullYear(endDate.getFullYear() - 1);
                    break;
                default:
                    break;
            }

            filteredData = filteredData.filter(({ rating_timestamp }) => {
                const ratingDate = new Date(rating_timestamp);
                return ratingDate >= startDate && ratingDate <= endDate;
            });
        }

        return filteredData.reduce<ProcessedData>((acc, { song, rating_timestamp, song_rating }) => {
            if (!acc[song]) {
                acc[song] = { x: [], y: [], name: song };
            }
            acc[song].x.push(new Date(rating_timestamp).toISOString().split('T')[0]);
            acc[song].y.push(song_rating);
            return acc;
        }, {});
    }, [songData, selectedTimeFrame]);

    const handleChartChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedChart(e.target.value);
        setSelectedSubOption('');
        setSelectedTimeFrame('');
    };

    const handleSubOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSubOption(e.target.value);
    };

    const handleTimeFrameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTimeFrame(e.target.value);
    };

    const plotData = useMemo(() => {
        return Object.values(processedData).map((item, index) => ({
            x: item.x,
            y: item.y,
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: `hsl(${index * 360 / Object.values(processedData).length}, 100%, 50%)` },
            name: item.name
        }));
    }, [processedData]);

    return (
        <>
            <VStack>
                <h1 className="text-5xl font-lalezar">Your Charts</h1>
                <h1 className="text-2xl font-lalezar">Please select the data that you want to analyze.</h1>
                <Flex direction="row" align="center" justify="center">
                    <Select onChange={handleChartChange} width="auto" mr={2}>
                        <option value="">Select Category</option>
                        <option value="temporal" className="text-black">Temporal Analysis</option>
                        {/* Add other options as necessary */}
                    </Select>

                    {selectedChart === 'temporal' && (
                        <Select onChange={handleSubOptionChange} width="auto" mr={2}>
                            <option value="">Select Sub-Category</option>
                            <option value="albums" className="text-black">Your Favorite Albums</option>
                            <option value="performers" className="text-black">Your Favorite Performers</option>
                            <option value="songs" className="text-black">Your Favorite Songs</option>
                        </Select>
                    )}

                    {selectedSubOption && selectedChart === 'temporal' && (
                        <Select onChange={handleTimeFrameChange} width="auto">
                            <option value="">Select Time Frame</option>
                            <option value="1month" className="text-black">In 1 Month</option>
                            <option value="6months" className="text-black">In 6 Months</option>
                            <option value="1year" className="text-black">In 1 Year</option>
                        </Select>
                    )}
                </Flex>
            </VStack>

            <Plot
                className="chart-container"
                data={plotData}
                layout={{
                    width: 800,
                    height: 400,
                    showlegend: true,
                    xaxis: { title: 'Date' },
                    yaxis: { title: 'Rating' }
                }}
            />
        </>
    );
};

export default MainChart;
