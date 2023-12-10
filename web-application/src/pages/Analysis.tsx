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

const Analysis = () => {
    const [selected, setSelected] = useState<string>("all-db");
    const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
    const [groups, setGroups] = useState<GroupProps[]>([]);
    const auth = useAuthUser();
    const baseURL = "http://51.20.128.164/api"; // Replace with your actual base URL
    const [fetchUrl, setFetchUrl] = useState<string>(`${baseURL}/all_song_ratings`);
    const data = useMemoizedFetch(fetchUrl);

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
        switch (selected) {
            case "all-db":
                setFetchUrl(`${baseURL}/all_song_ratings`);
                break;
            case "friends":
                setFetchUrl(`${baseURL}/follower_song_ratings/${auth()?.username}`);
                break;
            case "user":
                setFetchUrl(`${baseURL}/user_song_ratings/${auth()?.username}`);
                break;
            case "friend_groups":
                if (selectedGroup) {
                    setFetchUrl(`${baseURL}/group_song_ratings/${auth()?.username}/${selectedGroup}`);
                }
                break;
            default:
                setFetchUrl(`${baseURL}/all_song_ratings`);
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
            <ChartModule/>
        </main>
    );
};

export default Analysis;