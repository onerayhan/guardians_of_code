import React, { useEffect, useState } from "react";
import { Flex, Select, VStack } from "@chakra-ui/react";
import Header from "../components/Header";
import MainChart from "../components/Analysis/MainChart";
import MainTable from "../components/Analysis/MainTable";
import axios from "axios";
import { useAuthUser } from "react-auth-kit";

interface GroupProps {
    groupName: string;
    groupMembers: string[];
    groupID: number;
}

interface RatedArray {
    artist: string;
    album: string;
    song: string;
    song_rating: number;
    rating_timestamp: string;
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

    const [selectedChart, setSelectedChart] = useState('');
    const [selectedSubOption, setSelectedSubOption] = useState('');
    const [selectedTimeFrame, setSelectedTimeFrame] = useState('');

    const handleChartChange = (e) => {
        setSelectedChart(e.target.value);
        setSelectedSubOption('');
        setSelectedTimeFrame('');
    };

    const handleSubOptionChange = (e) => {
        setSelectedSubOption(e.target.value);
        setSelectedTimeFrame('');
    };

    const handleTimeFrameChange = (e) => {
        setSelectedTimeFrame(e.target.value);
    };

    const handleGroupChange = (e) => {
        setSelectedGroup(Number(e.target.value));
    };

    useEffect(() => {
        if (selected === "friend_groups") {
            const apiUrl = `${baseURL}/display_user_group/${auth()?.username}`;
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
        const fetchSongs = async (url: string, setter: React.Dispatch<React.SetStateAction<RatedArray[]>>) => {
            try {
                const response = await axios.get(url);
                setter(response.data.ratings_data);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        if (selected === "all-db") {
            fetchSongs(`${baseURL}/all_song_ratings`, setAllSongs);
        } else if (selected === "friends") {
            fetchSongs(`${baseURL}/follower_song_ratings/${auth()?.username}`, setFriendsSongs);
        } else if (selected === "user") {
            fetchSongs(`${baseURL}/user_song_ratings/${auth()?.username}`, setUserSongs);
        } else if (selected === "friend_groups" && selectedGroup) {
            fetchSongs(`${baseURL}/group_song_ratings/${auth()?.username}/${selectedGroup}`, setFriendGroupsSongs);
        }

    }, [selected, selectedGroup, auth]);

    useEffect(() => {
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
    }, [allSongs, friendsSongs, userSongs, friendGroupsSongs, selected]);

    return (
        <body className="bg-[#081730] overflow-y-auto text-white">
        <Header />
        <MainTable ratedArray={data} />
        <hr className="w-1/2 mx-auto border-t border-white"/>
        <div className="relative flex flex-col items-center">
            <MainChart/>
        </div>
        <div className="py-5">

        </div>
        </body>
    );
};

export default Analysis;
