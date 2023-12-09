import React, {useEffect, useState} from 'react';
import { useAuthUser } from "react-auth-kit";
import {
    TableContainer, Table, Thead, Tr, Th, Tbody, Td,
    Select, Button, Stack, Tag, TagLabel, TagCloseButton,
    Box, Flex, Heading
} from '@chakra-ui/react';
import {MemoizationModule} from "../../contexts/chartMemo.tsx";

interface SongRating {
    song_id: string;
    rating: number;
    rating_timestamp: string;
}

interface AlbumRating {
    album_id: string;
    rating: number;
    rating_timestamp: string;
}

interface PerformerRating {
    performer_id: string;
    rating: number;
    rating_timestamp: string;
}

interface GenrePreference {
    genre: string;
    count: number;
}

interface AlbumPreference {
    album: string;
    count: number;
}

interface PerformerPreference {
    performer: string;
    count: number;
}

const ChartModule = () => {
    const [chartType, setChartType] = useState<string>('1');
    const [songRatings, setSongRatings] = useState<SongRating[]>([]);
    const [albumRatings, setAlbumRatings] = useState<AlbumRating[]>([]);
    const [performerRatings, setPerformerRatings] = useState<PerformerRating[]>([]);
    const [genrePreferences, setGenrePreferences] = useState<GenrePreference[]>([]);
    const [albumPreferences, setAlbumPreferences] = useState<AlbumPreference[]>([]);
    const [performerPreferences, setPerformerPreferences] = useState<PerformerPreference[]>([]);
    const [followingsGenrePreferences, setFollowingsGenrePreferences] = useState<GenrePreference[]>([]);
    const [followingsAlbumPreferences, setFollowingsAlbumPreferences] = useState<AlbumPreference[]>([]);
    const [followingsPerformerPreferences, setFollowingsPerformerPreferences] = useState<PerformerPreference[]>([]);

    const memoModule = new MemoizationModule();

    async function getUserSongRatings(username: string): Promise<SongRating[]> {
        const endpoint = '/api/user_song_ratings';
        return await memoModule.fetchData(endpoint, username) as SongRating[];
    }

// Function to get user album ratings
    async function getUserAlbumRatings(username: string): Promise<AlbumRating[]> {
        const endpoint = '/api/user_album_ratings';
        return await memoModule.fetchData(endpoint, username) as AlbumRating[];
    }

// Function to get user performer ratings
    async function getUserPerformerRatings(username: string): Promise<PerformerRating[]> {
        const endpoint = '/api/user_performer_ratings';
        return await memoModule.fetchData(endpoint, username) as PerformerRating[];
    }

// Function to get user genre preferences
    async function getUserGenrePreferences(username: string): Promise<GenrePreference[]> {
        const endpoint = '/api/user_genre_preference';
        return await memoModule.fetchData(endpoint, username) as GenrePreference[];
    }

// Function to get user album preferences
    async function getUserAlbumPreferences(username: string): Promise<AlbumPreference[]> {
        const endpoint = '/api/user_album_preference';
        return await memoModule.fetchData(endpoint, username) as AlbumPreference[];
    }

// Function to get user performer preferences
    async function getUserPerformerPreferences(username: string): Promise<PerformerPreference[]> {
        const endpoint = '/api/user_performer_preference';
        return await memoModule.fetchData(endpoint, username) as PerformerPreference[];
    }

// Function to get user followings' genre preferences
    async function getUserFollowingsGenrePreference(username: string): Promise<GenrePreference[]> {
        const endpoint = '/api/user_followings_genre_preference';
        return await memoModule.fetchData(endpoint, username) as GenrePreference[];
    }

// Function to get user followings' album preferences
    async function getUserFollowingsAlbumPreference(username: string): Promise<AlbumPreference[]> {
        const endpoint = '/api/user_followings_album_preference';
        return await memoModule.fetchData(endpoint, username) as AlbumPreference[];
    }

// Function to get user followings' performer preferences
    async function getUserFollowingsPerformerPreference(username: string): Promise<PerformerPreference[]> {
        const endpoint = '/api/user_followings_performer_preference';
        return await memoModule.fetchData(endpoint, username) as PerformerPreference[];
    }

    const handleChartChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setChartType(event.target.value);
    };

    useEffect(() => {
        const fetchData = async () => {
            const username = "exampleUser"; // Replace with actual username

            try {
                switch (chartType) {
                    case "1": // Song Rating Trends Over Time
                        const songRatingsData = await getUserSongRatings(username);
                        setSongRatings(songRatingsData);
                        break;
                    case "2": // Album Rating Distribution
                        const albumRatingsData = await getUserAlbumRatings(username);
                        setAlbumRatings(albumRatingsData);
                        break;
                    case "3": // Performer Rating Comparison
                        const performerRatingsData = await getUserPerformerRatings(username);
                        setPerformerRatings(performerRatingsData);
                        break;
                    case "4": // User Genre Preferences
                        const genrePreferencesData = await getUserGenrePreferences(username);
                        setGenrePreferences(genrePreferencesData);
                        break;
                    case "5": // User Album Preferences
                        const albumPreferencesData = await getUserAlbumPreferences(username);
                        setAlbumPreferences(albumPreferencesData);
                        break;
                    case "6": // User Performer Preferences
                        const performerPreferencesData = await getUserPerformerPreferences(username);
                        setPerformerPreferences(performerPreferencesData);
                        break;
                    case "7": // Followings' Genre Preferences
                        const followingsGenrePrefData = await getUserFollowingsGenrePreference(username);
                        setFollowingsGenrePreferences(followingsGenrePrefData);
                        break;
                    case "8": // Followings' Album Preferences
                        const followingsAlbumPrefData = await getUserFollowingsAlbumPreference(username);
                        setFollowingsAlbumPreferences(followingsAlbumPrefData);
                        break;
                    case "9": // Followings' Performer Preferences
                        const followingsPerformerPrefData = await getUserFollowingsPerformerPreference(username);
                        setFollowingsPerformerPreferences(followingsPerformerPrefData);
                        break;
                    default:
                        break;
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                // Handle or report error
            }
        };

        fetchData();
    }, [chartType]); // Include additional dependencies as necessary

    const renderChart = () => {
        switch (chartType) {
            case "1":
                return <SongRatingTrendsOverTimeChart data={songRatings} />;
            case "2":
                return <AlbumRatingDistributionChart data={albumRatings} />;
            case "3":
                return <PerformerRatingComparisonChart data={performerRatings} />;
            case "4":
                return <UserGenrePreferencesChart data={genrePreferences} />;
            case "5":
                return <UserAlbumPreferencesChart data={albumPreferences} />;
            case "6":
                return <UserPerformerPreferencesChart data={performerPreferences} />;
            case "7":
                return <FollowingsGenrePreferencesChart data={followingsGenrePreferences} />;
            case "8":
                return <FollowingsAlbumPreferencesChart data={followingsAlbumPreferences} />;
            case "9":
                return <FollowingsPerformerPreferencesChart data={followingsPerformerPreferences} />;
            default:
                return <p>Select a chart type to view data.</p>;
        }
    };

    return (
        <div className="py-20 text-center">
            <h1 className="text-6xl font-bold">Get Charts About Your Activity!</h1>
            <div className="py-2"></div>
            <p className="text-xl font-bold">Select the chart type you want to see.</p>
            <p className="text-xl font-bold">Simply refer to the dropdown menu right below.</p>
            <div className="py-8"></div>
            <Flex align="center" justify="center">
                <Heading as="h3" size="lg" mr={4}>Select The Chart Type:</Heading>
                <Select value={chartType} onChange={handleChartChange} size="sm" mr={2} w="300px">
                    <option value="1" className="text-black">Song Rating Trends Over Time</option>
                    <option value="2" className="text-black">Album Rating Distribution</option>
                    <option value="3" className="text-black">Performer Rating Comparison</option>
                    <option value="4" className="text-black">User Genre Preferences</option>
                    <option value="5" className="text-black">User Album Preferences</option>
                    <option value="6" className="text-black">User Performer Preferences</option>
                    <option value="7" className="text-black">Followings' Genre Preferences</option>
                    <option value="8" className="text-black">Followings' Album Preferences</option>
                    <option value="9" className="text-black">Followings' Performer Preferences</option>
                </Select>
            </Flex>
            <Box mt={10}>
                {renderChart()}
            </Box>
        </div>
    );
}

export default ChartModule;