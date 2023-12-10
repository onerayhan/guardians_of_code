import {Avatar, Modal} from 'flowbite-react';
import {useAuthUser} from 'react-auth-kit';
import {MdBuild} from "react-icons/md";
import {Box, Button, Stack} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';
import {FaSpotify} from "react-icons/fa";
import React, {useEffect, useState} from "react";
import { FaUserGroup } from "react-icons/fa6";
import { AiOutlineUsergroupDelete } from "react-icons/ai";
import axios from "axios";
import { IoPersonRemove } from "react-icons/io5";
import { MdOutlineBlock } from "react-icons/md";
import {useSpotify} from "../../contexts/SpotifyContext.tsx";
import TweetButton from "../../APIClasses/TweetButton.tsx";

interface groupProps {
    groupName: string;
    group_members: string[];
    groupID: number;
}

function Profile() {
    const [profilePhoto, setProfilePhoto] = useState<string | undefined>(undefined);
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);
    const [showGroupsModal, setShowGroupsModal] = useState(false);
    const [followers, setFollowers] = useState<string[]>([]);
    const [following, setFollowing] = useState<string[]>([]);
    const [groups, setGroups] = useState<groupProps[]>([]);
    const [spoti_auth, setSpotiAuth] = useState(false);
    const auth = useAuthUser();
    const username = auth()?.username;
    const navigate = useNavigate();
    const { isAuthenticated, updateAccessToken } = useSpotify();

    useEffect(() => {
        const fetch_photo = async () => {
            const username = auth()?.username;
            const apiUrl = "http://51.20.128.164/api/profile_picture";
            try {
                const response = await axios.post(apiUrl, { username: `${username}` }, { responseType: 'blob' });
                const data = response.data;
                const url = URL.createObjectURL(data);
                setProfilePhoto(url);
            }
            catch (error) {
                console.log(error);
            }
        };

        const fetchUsers = async () => {
            const apiUrl = "http://51.20.128.164/api/user_followings";
            try {
                const response = await axios.post(apiUrl, { username: `${auth()?.username}` });
                const data = response.data;
                const followerUsernames = data[`Followers of ${auth()?.username}`] || [];
                const followingUsernames = data[`${auth()?.username} follows`] || [];

                setFollowers(followerUsernames);
                setFollowing(followingUsernames);
            } catch (error) {
                console.log(error);
            }
        };

        const fetchGroups = async () => {
            const apiUrl = `http://51.20.128.164/api/display_user_group/${auth()?.username}`;
            try {
                const response = await axios.get(apiUrl);
                const data = response.data;

                const groups: groupProps[] = data.map((group: any) => ({
                    groupName: group.group_name,
                    groupMembers: group.group_members,
                    groupID: group.group_id
                }));

                setGroups(groups);
            } catch (error) {
                console.log(error);
            }
        };

        const fetch_spoti_status = async () => {
            const apiUrl = `http://51.20.128.164/api/check_spoti_connection/${username}`;
            try {
                const response = await axios.get(apiUrl);
                const data = response.data.check;
                setSpotiAuth(data);
            } catch (error) {
                console.log(error);
            }
        }

        fetch_spoti_status();
        fetchGroups();
        fetchUsers();
        fetch_photo();

        return () => {
            if (profilePhoto) {
                URL.revokeObjectURL(profilePhoto);
            }
        };
    }, []);
    const handleClick = () => {
        navigate(`/${username}/settings`);
    };

    const handleSpotifyIntegration = () => {
        const apiUrl = `http://51.20.128.164/spoti_login/${auth()?.username}`;
        const windowFeatures = "width=500,height=800,resizable=yes,scrollbars=yes,status=yes";
        const popupWindow = window.open(apiUrl, "SpotifyLogin", windowFeatures);

        const checkPopupClosed = setInterval(() => {
            if (popupWindow && popupWindow.closed) {
                clearInterval(checkPopupClosed);
                console.log("Popup window closed. Handling post-login actions.");
                window.location.reload();
            }
        }, 100);
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
                setShowFollowingModal(false);
                navigate(`/user/${user}`);
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
                setShowFollowingModal(false);
                navigate(`/user/${user}`);
            }

            const handleUnfollow = async () => {
                const apiUrl = "http://51.20.128.164/api/unfollow";
                try {
                    const response = await axios.post(apiUrl, { follower_username: `${auth()?.username}`, followed_username: `${user}` });
                    const data = response.data;
                    console.log(data);
                }
                catch (error) {
                    console.log(error);
                }
            }

            const handleBlock = async () => {
                const apiUrl = "http://51.20.128.164/api/block_user";
                try {
                    const response = await axios.post(apiUrl, { follower_username: `${auth()?.username}`, followed_username: `${user}` });
                    const data = response.data;
                    console.log(data);
                }
                catch (error) {
                    console.log(error);
                }

            }

            return (
                <Box p={4} display="flex" alignItems="center" justifyContent="space-between" bg="gray.100" borderRadius="md">
                    <Avatar img={profPhoto} size="md" />
                    <Button onClick={() => handleNavigate(user)}>{user}</Button>
                    <Button onClick={handleUnfollow} colorScheme={"red"}><IoPersonRemove />Unfollow</Button>
                    <Button onClick={handleBlock} colorScheme={"orange"}><MdOutlineBlock />Block</Button>
                </Box>
            );
        };

        const GroupsDisplay = ({ group }: { group: groupProps }) => {

            const apiUrl = "http://51.20.128.164/remove_user_from_group";
            const handleLeaveGroup = async () => {
                try {
                    const response = await axios.post(apiUrl, { username: `${auth()?.username}`, group_id: `${group.groupID}` });
                    const data = response.data;
                    console.log(data);
                }
                catch (error) {
                    console.log(error);
                }
            }
            return(
                <Box p={4} display="flex" alignItems="center" justifyContent="space-between" bg="gray.100" borderRadius="md">
                    <Button onClick={() => navigate(`/group/${group.groupName}`, { state: { groupMembers: group.group_members } })}>
                        {group.groupName}
                    </Button>
                    <Button colorScheme="red" onClick={handleLeaveGroup}><AiOutlineUsergroupDelete />Leave Group</Button>
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
                                <GroupsDisplay key={groups.groupID} group={groups} />
                            ))}
                        </Stack>
                    </Modal.Body>
                </Modal>
            </>
        );
    }

  return (
    <div className="flex flex-col items-center text-center bg-[#081730] overflow-y-auto">
      <div className="flex flex-col items-center justify-center w-full bg-[#081730] text-white p-2.5">
        <Avatar img={profilePhoto} size="xl" rounded bordered color="gray" />
        <h2 className='mt-5'>{auth()?.username}</h2><div className="py-2"></div>
          <div className="flex justify-center items-center mx-0 my-2.5">
              <UserList />
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              <Button onClick={handleClick} leftIcon={<MdBuild/>} colorScheme='orange' variant='solid'>
                  Settings
              </Button>
              {spoti_auth ?
                  <Button isDisabled={true}>Spotify Connected</Button> :
                  <Button onClick={handleSpotifyIntegration} textColor="black" leftIcon={<FaSpotify/>}
                          colorScheme='green' variant='solid'>
                      Connect to Spotify
                  </Button>
              }
              <TweetButton shareType=""/>
          </div>
      </div>
        <div className="py-5">
        </div>
    </div>
  );
}

export default Profile;