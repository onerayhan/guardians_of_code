import React, { useEffect, useState } from "react";
import { Flex, Select, VStack } from "@chakra-ui/react";
import Header from "../components/Header";
import useMemoizedFetch from "../contexts/useMemoizedFetch";
import TableModule from "../components/Analysis/TableModule";
import ChartModule from "../components/Analysis/ChartModule";
import axios from "axios";
import { useAuthUser } from "react-auth-kit";

interface GroupProps {
    groupName: string;
    groupMembers: string[];
    groupID: number;
}

interface Song {
    username: string;
    song_id: string;
    genre: string;
    artist: string;
    album: string;
    song: string;
    song_rating: string;
    rating_timestamp: string;
}

interface RatedArray {
    genre: string;
    artist: string;
    album: string;
    song: string;
    song_rating: number; // Assuming rating is a numerical value
    rating_timestamp: string; // Assuming timestamp is a string, can be Date as well
}

const Analysis = () => {
    const [selected, setSelected] = useState<string>("all-db");
    const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
    const [groups, setGroups] = useState<GroupProps[]>([]);
    const auth = useAuthUser();
    const baseURL = "http://51.20.128.164/api"; // Replace with your actual base URL
    const [data, setData] = useState<RatedArray[]>([]);
    const [userSongs, setUserSongs] = useState<RatedArray[]>([]);
    const [friendsSongs, setFriendsSongs] = useState<RatedArray[]>([]);
    const [allSongs, setAllSongs] = useState<RatedArray[]>([]);
    const [friendGroupsSongs, setFriendGroupsSongs] = useState<RatedArray[]>([]);

    useEffect(() => {
        if (selected === "friend_groups") {
            const apiUrl = `http://51.20.128.164/api/display_user_group/${auth()?.username}`;
            axios.get(apiUrl).then(response => {
                const fetchedGroups = response.data.map((group: any) => ({
                    groupName: group.group_name,
                    groupMembers: group.group_members,
                    groupID: group.group_id
                }));
                setGroups(fetchedGroups);
            }).catch(error => console.log(error));
        }
    }, [selected, auth]);

    useEffect(() => {

        const fetchFriendGroupsSongs = async () => {
            try {
                const response = await axios.get(`${baseURL}/group_song_ratings/${auth()?.username}/${selectedGroup}`);
                // Assuming the array is under 'ratings_data' in the response
                setFriendGroupsSongs(response.data.ratings_data);
            } catch (error) {
                console.error('Error fetching friend groups songs', error);
            }
        };

        const fetchUserSongs = async () => {
            const apiUrl = `http://51.20.128.164/api/user_song_ratings/${auth()?.username}`;
            try {
                const response = await axios.get(apiUrl);
                const data = response.data;
                const songObjects = data[`${auth()?.username}_song_ratings`];
                if (Array.isArray(songObjects)) {
                    setUserSongs(songObjects);
                } else {
                    console.log("No song ratings found for the user, or the data is not in the expected format:", songObjects);
                }
            } catch (error) {
                console.error("Error fetching ratings:", error);
            }
        };

        const fetchFriendsSongs = async () => {
            try {
                const response = await axios.get(`${baseURL}/follower_song_ratings/${auth()?.username}`);
                // Assuming the array is under 'ratings_data' in the response
                setFriendsSongs(response.data.ratings_data);
            } catch (error) {
                console.error('Error fetching friends songs', error);
            }
        };

        const fetchAllSongs = async () => {
            try {
                const response = await axios.get(`${baseURL}/all_song_ratings`);
                // Adjust this based on the actual response structure
                setAllSongs(response.data.flatMap(user => user.ratings_data));
            } catch (error) {
                console.error('Error fetching all songs', error);
            }
        };

        fetchFriendGroupsSongs();
        fetchAllSongs();
        fetchFriendsSongs();
        fetchUserSongs();

        switch (selected) {
            case "all-db":
                setData(allSongs);
                break;
            case "friends":
                setData(friendsSongs);
                break;
            case "user":
                setData(userSongs);
                break;
            case "friend_groups":
                setData(friendGroupsSongs);
                break;
            default:
                break;
        }

    }, [selected, selectedGroup]);

    const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedGroup(Number(e.target.value));
    };

    return (
        <main className="bg-[#081730] overflow-y-auto text-white">
            <Header />
            <div className="flex justify-center mt-20">
                <VStack>
                    <h1 className="text-5xl font-lalezar">Your Analysis</h1>
                    <h1 className="text-2xl font-lalezar">Please select the data that you want to analyze.</h1>
                    <Flex direction="row" align="center" justify="center">
                        <Select onChange={(e) => setSelected(e.target.value)} width="auto" mr={2}>
                            <option value="all-db" className="text-black">All of the Database</option>
                            <option value="friends" className="text-black">Friends' Analysis</option>
                            <option value="user" className="text-black">User's Analysis</option>
                            <option value="friend_groups" className="text-black">Friend Group Analysis</option>
                        </Select>
                        {selected === "friend_groups" && (
                            <Select onChange={handleGroupChange} width="auto">
                                {groups.map(group => (
                                    <option key={group.groupID} value={group.groupID} className="text-black">
                                        {group.groupName}
                                    </option>
                                ))}
                            </Select>
                        )}
                    </Flex>
                </VStack>
            </div>
            <TableModule data={data || []}/>
        </main>
    );
};

export default Analysis;