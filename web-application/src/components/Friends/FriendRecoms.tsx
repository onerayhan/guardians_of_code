import React, {useEffect, useState} from 'react';
import {Thead, Th, Td, Button, Skeleton, SkeletonCircle} from '@chakra-ui/react';
import { useAuthUser } from "react-auth-kit";
import axios from "axios";
import {
    Table,
    Tbody,
    Tr,
    TableContainer,
} from '@chakra-ui/react'
import {useNavigate} from "react-router-dom";
import {Avatar} from "flowbite-react";

interface RecomsArray {
    username: string;
    follower_count: string;
    followed_count: string;
    profile_picture?: string | undefined;
}

interface UserOccurence {
    username: string;
    occurence: number;
}

interface UserFollowData {
    followers: string[];
    following: string[];
}

interface RecomDisplayUserProps {
    user?: RecomsArray; // user is now optional
}

const FriendRecoms:React.FC = () => {
    const [RecomUsers, setRecomUsers] = useState<RecomsArray[]>([]);
    const auth = useAuthUser();
    const navigate = useNavigate();

    const navigateUser = (user: string) => {
        let og_user = auth()?.username?.toLowerCase();
        let input_user = user.toLowerCase();

        if (og_user === input_user) {
            navigate(`/${og_user}`);
        } else {
            navigate(`/user/${user}`);
        }
    }

        useEffect(() => {
            const fetchAndProcessData = async () => {
                const apiUrl = `http://51.20.128.164/api/recommendations/${auth()?.username}`;

                const selected = ["genre"];
                const selection = "all";

                try {
                    const response = await axios.post(apiUrl, { criteria_list: selected, target_audience: selection });
                    const authUsername = auth()?.username?.toLowerCase();
                    const filteredSongs = response.data.filter(song => song.username.toLowerCase() !== authUsername);

                    // Count occurrences
                    const occurrenceMap = {};
                    filteredSongs.forEach(song => {
                        const lowerCaseUsername = song.username.toLowerCase();
                        if (!occurrenceMap[lowerCaseUsername]) {
                            occurrenceMap[lowerCaseUsername] = { count: 0, username: song.username };
                        }
                        occurrenceMap[lowerCaseUsername].count += 1;
                    });

                    // Sort and take top 4
                    // @ts-ignore
                    const sortedUsers: UserOccurence[] = Object.values(occurrenceMap).sort((a, b) => b.count - a.count).slice(0, 4);

                    // Fetch additional details
                    const userDetails: RecomsArray[] = await Promise.all(sortedUsers.map(async user => {
                        // @ts-ignore
                        const profilePicture: string | undefined = await fetchProfilePicture(user.username);
                        // @ts-ignore
                        const userFollowData: UserFollowData = await fetchUserFollowData(user.username);

                        return {
                            username: user.username,
                            follower_count: userFollowData.followers.length.toString(),
                            followed_count: userFollowData.following.length.toString(),
                            profile_picture: profilePicture
                        };
                    }));


                    setRecomUsers(userDetails);
                } catch (error) {
                    console.error("Error in fetchAndProcessData:", error);
                }
            };

            fetchAndProcessData().then(() => {
                console.log("RecomUsers after fetch:", RecomUsers);
            });
        }, []);

    const fetchProfilePicture = async (username) => {
        const apiUrl = "http://51.20.128.164/api/profile_picture";
        try {
            const response = await axios.post(apiUrl, { username: `${username}` }, { responseType: 'blob' });
            const data = response.data;
            const url = URL.createObjectURL(data);
            return url;
        } catch (error) {
            // First, check if the error is an instance of an Axios error
            if (axios.isAxiosError(error)) {
                // Now it's safe to access error.response
                if (error.response && error.response.status === 404) {
                    // If the error code is 404, set the profile picture to undefined
                    return undefined;
                }
            }
            // Log the error if it's not an Axios error or if the status is not 404
            console.error('Error fetching profile picture:', error);
        }
    };


        const fetchUserFollowData = async (username) => {
            const apiUrl = "http://51.20.128.164/api/user_followings";
            try {
                const response = await axios.post(apiUrl, { username: `${username}` });
                const data = response.data;
                const followerUsernames = data[`Followers of ${username}`] || [];
                const followingUsernames = data[`${username} follows`] || [];

                return {
                    followers: followerUsernames,
                    following: followingUsernames
                };

            } catch (error) {
                console.log(error);
            }
        };


    const RecomDisplayUser = ({ user }: RecomDisplayUserProps) => {
        return (
            <Tr>
                <Td>
                    {user ? (
                        <Avatar img={user.profile_picture} size="lg" />
                    ) : (
                        <SkeletonCircle size="20" />
                    )}
                </Td>
                <Td>
                    {user ? (
                        <Button onClick={() => navigateUser(user.username)}>
                            {user.username}
                        </Button>
                    ) : (
                        <Skeleton height="20px" width="75%" />
                    )}
                </Td>
                <Td>
                    {user ? user.follower_count : <Skeleton height="20px" width="50%" />}
                </Td>
                <Td>
                    {user ? user.followed_count : <Skeleton height="20px" width="50%" />}
                </Td>
            </Tr>
        );
    };

    return (
        <div className="relative w-full flex flex-col items-center top-20 pb-8">
            <h1 className="text-4xl font-lalezar text-white">Friend Recommendations</h1>
                <div className="rounded-xl bg-white">
                        <TableContainer>
                            <Table variant="simple" colorScheme='purple' size="lg">
                                <Thead>
                                    <Tr>
                                        <Th>Profile Picture</Th>
                                        <Th>User Name</Th>
                                        <Th>Follower Count</Th>
                                        <Th>Following Count</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {
                                        RecomUsers.length === 4
                                            ? RecomUsers.map(user => <RecomDisplayUser key={user.username} user={user} />)
                                            : Array.from({ length: 4 }).map((_, index) => <RecomDisplayUser key={index} />)
                                    }
                                </Tbody>
                            </Table>
                        </TableContainer>
                </div>
                </div>
    );
};

export default FriendRecoms;