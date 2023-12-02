import React, {useState} from 'react';
import {Card, CardBody, Button, Text, CardFooter, HStack, Box, useToast} from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import { FaDatabase } from "react-icons/fa";
import axios, {AxiosError} from "axios";
import {useAuthUser} from "react-auth-kit";
import {StarIcon} from "@chakra-ui/icons";
import {AiTwotoneLike} from "react-icons/ai";

interface SongSearchProps {
    isInDb: boolean;
    isFound: boolean;
    songInfo: Song;
}

interface Song {
    song_id: number;
    song_name: string;
    artist_name: string;
    album_name: string | null;
    length: number | null
    tempo: number | null
    recording_type: string | null;
    listens: number | null;
    release_year: number | null;
    added_timestamp: string | null;
}

interface RatingStarsProps {
    song: Song; // Use the Song interface here
    totalStars?: number;
}

const getCurrentTimestamp = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const SongSearch: React.FC<SongSearchProps> = ({ isInDb, isFound, songInfo }) => {
    const navigate = useNavigate();
    const auth = useAuthUser();
    const [error, setError] = React.useState("");
    const toast = useToast();

    const RatingStars: React.FC<RatingStarsProps> = ({ song, totalStars = 5 }) => {
        const [rating, setRating] = useState(0);
        const apiURL = "http://13.51.167.155/api/rate_song";

        const handleRating = async (i: number) => {
            try {
                await axios.post(apiURL, {
                    song_id: song.song_id,
                    username: auth()?.username,
                    rating: i
                });

                toast({
                    title: "Rating submitted",
                    description: `Successfully rated song ${song.song_name}`, // Template literal for dynamic song name
                    status: "success",
                    duration: 5000,
                    isClosable: true
                });

                setRating(i); // Set the rating after successful submission
            } catch (error) {
                console.error("Error submitting rating:", error);
                toast({
                    title: "Error submitting rating!",
                    status: "error",
                    duration: 5000,
                    isClosable: true
                });
            }
        };

        const handleLike = async () => {
            try {

                const apiURL = "http://13.51.167.155/api/like_song";

                await axios.post(apiURL, {
                    song_id: song.song_id,
                    username: auth()?.username,
                });

                toast({
                    title: "Like submitted",
                    description: `Successfully liked song ${song.song_name}`, // Template literal for dynamic song name
                    status: "success",
                    duration: 5000,
                    isClosable: true
                });
            }

            catch (error) {
                console.error("Error submitting like:", error);
                toast({
                    title: "Error submitting like!",
                    status: "error",
                    duration: 5000,
                    isClosable: true
                });
            }
        }

        return (
            <div className="flex">
                <Box display="flex" className="pr-12">
                    {[...Array(totalStars)].map((_, i) => (
                        <StarIcon
                            key={i}
                            onClick={() => handleRating(i + 1)}
                            color={i < rating ? "yellow.400" : "gray.300"}
                            cursor="pointer"
                        />
                    ))}
                    <Button onClick={() => handleLike()} leftIcon={<AiTwotoneLike />} className="ml-16">
                    </Button>
                </Box>
            </div>
        );
    };

    const handleAddSong = async (song: Song) => {
        const addedTimestamp = getCurrentTimestamp();

        try {
            await axios.post(
                "http://13.51.167.155/api/add_song",
                { username: `${auth()?.username}`, song_name: song.song_name, length: song.length, tempo: song.tempo, listens: song.listens, recording_type: song.recording_type, release_year: song.release_year, added_timestamp: addedTimestamp },
            );

        } catch(err) {
            if (err && err instanceof AxiosError)
                setError(err.response?.data.message);
            else if (err && err instanceof Error) setError(err.message);

            console.log("Error: ", err);
        }}

    const navigateArtist = (performer: string) => {
        navigate(`/artist/${performer}`);
    }

    if (!isFound) {
        return <div>Song not found</div>;
    }

    return (
        <Card className="w-[700px]" overflow='hidden' variant='outline'>
            <div className="flex items-center">
                {/* Display user info */}
                <HStack spacing={4} className="flex-grow">
                    <CardBody>
                        <Text py='2' className="font-lalezar">Followers: {songInfo.song_name}</Text>
                        <Button onClick={() => navigateArtist(songInfo.artist_name)}>{songInfo.artist_name}</Button>
                        <Text py='2' className="font-lalezar">Album: {songInfo.album_name}</Text>
                    </CardBody>

                    <CardFooter>
                        {isInDb ? (
                            <RatingStars key={songInfo.song_name} song={songInfo} />
                        ) : (
                            <Button
                                variant='solid'
                                colorScheme='orange'
                                onClick={() => {handleAddSong(songInfo)}}
                            >
                                <FaDatabase />
                                <div className="px-1"></div>
                                Add Song to the Database
                            </Button>
                        )}
                    </CardFooter>
                </HStack>
            </div>
        </Card>
    );
};

export default SongSearch;
