import {useNavigate, useParams} from 'react-router-dom';
import {Avatar, Modal} from "flowbite-react";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    Box,
    Button,
    Stack,
    Tab, Table,
    TableContainer,
    TabList,
    TabPanel,
    TabPanels,
    Tabs, Tbody,
    Td, Th, Thead,
    Tr, useToast,
} from "@chakra-ui/react";
import {AiOutlineUsergroupDelete} from "react-icons/ai";
import {FaUserGroup} from "react-icons/fa6";
import Header from "../components/Header";
import {useAuthUser} from "react-auth-kit";
import Timestamp from "react-timestamp";
import {GoThumbsup} from "react-icons/go";
import {MdOutlineDataset} from "react-icons/md";
import {RiUserFollowFill} from "react-icons/ri";

interface SongsArray {
    song_id: number;
    song_name: string;
    length: string;
    tempo: string;
    recording_type: string;
    listens: number;
    release_year: number;
    added_timestamp: string;
}


const UserProfile = () => {
    const { userId } = useParams();
    const [profilePhoto, setProfilePhoto] = useState<string | undefined>(undefined);
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [mainUserFollows, setMainUserFollows] = useState<string[]>([]);
    const [isFollow, setFollow] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);
    const [showGroupsModal, setShowGroupsModal] = useState(false);
    const [followers, setFollowers] = useState<string[]>([]);
    const [following, setFollowing] = useState<string[]>([]);
    const [groups, setGroups] = useState<string[]>([]);
    const [Posted, setPosted] = useState<SongsArray[]>([]);
    const navigate = useNavigate();
    const toast = useToast();
    const auth = useAuthUser();

    useEffect(() => {
        const fetch_photo = async () => {
            const apiUrl = "http://51.20.128.164/api/profile_picture";
            try {
                const response = await axios.post(apiUrl, { username: `${userId}` }, { responseType: 'blob' });
                const data = response.data;
                const url = URL.createObjectURL(data);
                setProfilePhoto(url);
            }
            catch (error) {
                console.log(error);
            }
        };

        const fetchMainUserFollows = async () => {
            const apiUrl = "http://51.20.128.164/api/user_followings";
            try {
                const response = await axios.post(apiUrl, { username: `${auth()?.username}` });
                const data = response.data;
                const followingUsernames = data[`${auth()?.username} follows`] || [];
                setMainUserFollows(followingUsernames);
            }

            catch {
                console.log("Error");
            }
        }

        const isFollowed = () => {
            if (mainUserFollows.includes(`${userId}`)) {
                setFollow(true);
            }
            else {
                setFollow(false);
            }
        }

        const fetchUsers = async () => {
            const apiUrl = "http://51.20.128.164/api/user_followings";
            try {
                const response = await axios.post(apiUrl, { username: `${userId}` });
                const data = response.data;
                const followerUsernames = data[`Followers of ${userId}`] || [];
                const followingUsernames = data[`${userId} follows`] || [];

                setFollowers(followerUsernames);
                setFollowing(followingUsernames);
            } catch (error) {
                console.log(error);
            }
        };

        const fetchGroups = async () => {
            const apiUrl = "http://51.20.128.164/api/user_groups";
            try {
                const response = await axios.post(apiUrl, {username: `${userId}`});
                const data = response.data;
                const groupNames = data[`Groups of ${userId}`] || [];

                setGroups(groupNames);
            } catch (error) {
                console.log(error);
            }
        };

        const getSongs = async () => {
            const apiUrl = "http://51.20.128.164/api/user_songs";
            try {
                const response = await axios.post(apiUrl, { username: `${userId}` });
                const data = response.data;
                setPosted(data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchMainUserFollows();
        isFollowed();
        getSongs();
        fetchGroups();
        fetchUsers();
        fetch_photo();

        return () => {
            if (profilePhoto) {
                URL.revokeObjectURL(profilePhoto);
            }
        };
    }, [userId]);

    const FollowUser = async (user: string, followerUsername: string) => {
        try {
            await axios.post(
                "http://51.20.128.164/api/follow",
                { follower_username: followerUsername, followed_username: user}
            );

            toast({
                description: "User followed successfully.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });

        } catch (err) {
            console.log("Error: ", err);

            let errorMessage = "An error occurred while trying to follow the user.";
            if (axios.isAxiosError(err) && err.response?.status === 400) {
                errorMessage = "User is already followed.";
            }

            toast({
                description: errorMessage,
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const SongDisplay = ({ song }: { song: SongsArray }) => {
        return (
            <Tr>
                <Td>{song.song_name}</Td>
                <Td>{song.length}</Td>
                <Td>{song.tempo}</Td>
                <Td>{song.recording_type}</Td>
                <Td isNumeric>{song.listens}</Td>
                <Td isNumeric>{song.release_year}</Td>
                <Td><Timestamp date={song.added_timestamp} /></Td>
            </Tr>
        );
    };

    const UserList: React.FC = () => {

        const UserDisplay = ({ user }: { user: string }) => {
            const navigate = useNavigate();
            const [profPhoto, setProfPhoto] = useState<string | undefined>(undefined);

            useEffect(() => {
                const fetch_photo = async () => {
                    const username = user;
                    const apiUrl = "http://51.20.128.164/api/profile_picture";
                    try {
                        const response = await axios.post(apiUrl, { username: `${username}` }, { responseType: 'blob' });
                        const data = response.data;
                        const url = URL.createObjectURL(data);
                        setProfPhoto(url);
                    }
                    catch (error) {
                        console.log(error);
                    }
                };

                fetch_photo();
            }, []);

            const handleNavigate = (user: string) => {
                let og_user = auth()?.username;
                setShowFollowersModal(false);
                {og_user === user ? navigate(`/${og_user}`) : navigate(`/user/${user}`)}
            }

            return (
                <Box p={4} display="flex" alignItems="center" justifyContent="space-between" bg="gray.100" borderRadius="md">
                    <Avatar img={profPhoto} size="md" />
                    <Button onClick={() => handleNavigate(user)}>{user}</Button>
                </Box>
            );
        };

        const FollowingDisplay = ({ user }: { user: string }) => {
            const [profPhoto, setProfPhoto] = useState<string | undefined>(undefined);

            useEffect(() => {
                const fetch_photo = async () => {
                    const username = user;
                    const apiUrl = "http://51.20.128.164/api/profile_picture";
                    try {
                        const response = await axios.post(apiUrl, { username: `${username}` }, { responseType: 'blob' });
                        const data = response.data;
                        const url = URL.createObjectURL(data);
                        setProfPhoto(url);
                    }
                    catch (error) {
                        console.log(error);
                    }
                };

                fetch_photo();
            }, []);

            const handleNavigate = (user: string) => {
                let og_user = auth()?.username;
                setShowFollowingModal(false);
                {og_user === user ? navigate(`/${user}`) : navigate(`/user/${user}`)}
            }

            return (
                <Box p={4} display="flex" alignItems="center" justifyContent="space-between" bg="gray.100" borderRadius="md">
                    <Avatar img={profPhoto} size="md" />
                    <Button onClick={() => handleNavigate(user)}>{user}</Button>
                </Box>
            );
        };

        const GroupsDisplay = ({ group }: { group: string }) => {

            return(
                <Box p={4} display="flex" alignItems="center" justifyContent="space-between" bg="gray.100" borderRadius="md">
                    <span>{group}</span>
                    <Button colorScheme="red" onClick={() => navigate(`/group/${group}`)}><AiOutlineUsergroupDelete />Leave Group</Button>
                </Box>
            );
        }

        return (
            <>
                <Button onClick={() => setShowFollowersModal(true)}>
                    Followers: {followers.length}
                </Button>
                <div className="px-2"></div>
                <Button onClick={() => setShowFollowingModal(true)}>
                    Following: {following.length}
                </Button>
                <div className="px-2"></div>
                <Button colorScheme="cyan" onClick={() => setShowGroupsModal(true)}>
                    <FaUserGroup size={20}/>
                    <div className="px-1"></div>
                    Show Groups
                </Button>
                <div className="px-2"></div>
                <Button
                    variant='solid'
                    textColor="black"
                    colorScheme='whatsapp'
                    onClick={() => FollowUser(`${userId}`,`${auth()?.username}`)}
                    disabled={isFollow}
                >
                    <RiUserFollowFill />
                    <div className="px-1"></div>
                    Follow User
                </Button>

                <Modal show={showFollowersModal} size="xl" onClose={() => setShowFollowersModal(false)}>
                    <Modal.Header>Followers</Modal.Header>
                    <Modal.Body>
                        <Stack spacing={4}>
                            {followers.map(follower => (
                                <UserDisplay key={follower} user={follower} />
                            ))}
                        </Stack>
                    </Modal.Body>
                </Modal>

                <Modal show={showFollowingModal} size="xl" onClose={() => setShowFollowingModal(false)}>
                    <Modal.Header>Following</Modal.Header>
                    <Modal.Body>
                        <Stack spacing={4}>
                            {following.map(following => (
                                <FollowingDisplay key={following} user={following} />
                            ))}
                        </Stack>
                    </Modal.Body>
                </Modal>

                <Modal show={showGroupsModal} size="xl" onClose={() => setShowGroupsModal(false)}>
                    <Modal.Header>Groups</Modal.Header>
                    <Modal.Body>
                        <Stack spacing={4}>
                            {groups.map(groups => (
                                <GroupsDisplay key={groups} group={groups} />
                            ))}
                        </Stack>
                    </Modal.Body>
                </Modal>
            </>
        );
    }

    return (
        <body className="bg-[#081730] overflow-y-auto">
        <Header />
        <div className="flex flex-col items-center text-center bg-[#081730] ">
            <div className="flex flex-col items-center justify-center w-full bg-[#081730] text-white p-2.5">
                <Avatar img={profilePhoto} size="xl" rounded bordered color="gray" />
                <h2 className='mt-5'>{userId}</h2><div className="py-2"></div>
                <div className="flex justify-center items-center mx-0 my-2.5">
                    <UserList />
                </div>
            </div>
            <div className="py-5">
            </div>
        </div>

        <div className="pl-[150px] pr-[150px] pb-5 overflow-y-auto w-auto">
            <Tabs isFitted variant='enclosed'>
                <TabList>
                    <Tab backgroundColor={"white"}><GoThumbsup size={20}/>Liked Songs</Tab>
                    <Tab backgroundColor={"white"}><MdOutlineDataset size={20}/>Posted Songs</Tab>
                </TabList>
                <TabPanels backgroundColor={"white"}>
                    <TabPanel>
                        <TableContainer>
                            <Table variant="simple" colorScheme='purple' size="lg">
                                <Thead>
                                    <Tr>
                                        <Th>Song Name</Th>
                                        <Th>Length</Th>
                                        <Th>Tempo</Th>
                                        <Th>Recording Type</Th>
                                        <Th>Listens</Th>
                                        <Th isNumeric>Release Year</Th>
                                        <Th isNumeric>Post Date</Th>
                                        <Th></Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {Posted.map(song => <SongDisplay key={song.song_id} song={song} />)}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </TabPanel>
                    <TabPanel>
                        <TableContainer>
                            <Table variant="simple" colorScheme='purple' size="lg">
                                <Thead>
                                    <Tr>
                                        <Th>Song Name</Th>
                                        <Th>Length</Th>
                                        <Th>Tempo</Th>
                                        <Th>Recording Type</Th>
                                        <Th>Listens</Th>
                                        <Th isNumeric>Release Year</Th>
                                        <Th isNumeric>Post Date</Th>
                                        <Th></Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {Posted.map(song => <SongDisplay key={song.song_id} song={song} />)}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
        <div className="bg-[#081730] py-10 overflow-y-auto">

        </div>
        </body>
    );
}
export default UserProfile;
