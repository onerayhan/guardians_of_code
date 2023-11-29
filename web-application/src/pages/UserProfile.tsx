import {useNavigate, useParams} from 'react-router-dom';
import {Avatar, Modal} from "flowbite-react";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {Box, Button, Stack} from "@chakra-ui/react";
import {AiOutlineUsergroupDelete} from "react-icons/ai";
import {FaUserGroup} from "react-icons/fa6";
import Header from "../components/Header";
import {useAuthUser} from "react-auth-kit";

const UserProfile = () => {
    let { userId } = useParams();
    const [profilePhoto, setProfilePhoto] = useState<string | undefined>(undefined);
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);
    const [showGroupsModal, setShowGroupsModal] = useState(false);
    const [followers, setFollowers] = useState<string[]>([]);
    const [following, setFollowing] = useState<string[]>([]);
    const [groups, setGroups] = useState<string[]>([]);
    const navigate = useNavigate();
    const auth = useAuthUser();

    useEffect(() => {
        const fetch_photo = async () => {
            const apiUrl = "http://13.51.167.155/api/profile_picture";
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

        const fetchUsers = async () => {
            const apiUrl = "http://13.51.167.155/api/user_followings";
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
            const apiUrl = "http://13.51.167.155/api/user_groups";
            try {
                const response = await axios.post(apiUrl, {username: `${userId}`});
                const data = response.data;
                const groupNames = data[`Groups of ${userId}`] || [];

                setGroups(groupNames);
            } catch (error) {
                console.log(error);
            }
        };


        fetchGroups();
        fetchUsers();
        fetch_photo();

        return () => {
            if (profilePhoto) {
                URL.revokeObjectURL(profilePhoto);
            }
        };
    }, [userId]);

    const UserList: React.FC = () => {

        const UserDisplay = ({ user }: { user: string }) => {
            const navigate = useNavigate();
            const [profPhoto, setProfPhoto] = useState<string | undefined>(undefined);

            useEffect(() => {
                const fetch_photo = async () => {
                    const username = user;
                    const apiUrl = "http://13.51.167.155/api/profile_picture";
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
                {og_user === userId ? navigate(`/${user}`) : navigate(`/user/${user}`)}
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
                    const apiUrl = "http://13.51.167.155/api/profile_picture";
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
                {og_user === userId ? navigate(`/${user}`) : navigate(`/user/${user}`)}
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
        </body>
    );
}

export default UserProfile;