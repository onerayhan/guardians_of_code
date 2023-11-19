import {Avatar, Modal} from 'flowbite-react';
import {useAuthUser} from 'react-auth-kit';
import {MdBuild} from "react-icons/md";
import {Box, Button, Stack} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';
import {FaSpotify} from "react-icons/fa";
import React, {useEffect, useState} from "react";
import axios from "axios";

function Profile() {
    const [profilePhoto, setProfilePhoto] = useState<string | undefined>(undefined);
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);
    const [followers, setFollowers] = useState<string[]>([]);
    const [following, setFollowing] = useState<string[]>([]);
    const auth = useAuthUser();
    const username = auth()?.username;
    const navigate = useNavigate();

    useEffect(() => {
        const fetch_photo = async () => {
            const username = auth()?.username;
            const apiUrl = "http://13.51.167.155/api/profile_picture";
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
            const apiUrl = "http://13.51.167.155/api/user_followings";
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
        navigate(`/${username}/settings`);
    };

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

            const handleNavigate = () => {
                navigate(`/${user}`);
            }

            return (
                <Box p={4} display="flex" alignItems="center" justifyContent="space-between" bg="gray.100" borderRadius="md">
                    <Avatar img={profPhoto} size="md" />
                    <Button onClick={handleNavigate}>{user}</Button>
                </Box>
            );
        };

        return (
            <>
                <Button onClick={() => setShowFollowersModal(true)}>
                    Followers: {followers.length}
                </Button>
                <div className="px-2"></div>
                <Button onClick={() => setShowFollowingModal(true)}>
                    Following: {following.length}
                </Button>

                <Modal show={showFollowersModal} size="sm" onClose={() => setShowFollowersModal(false)}>
                    <Modal.Header>Followers</Modal.Header>
                    <Modal.Body>
                        <Stack spacing={4}>
                            {followers.map(follower => (
                                <UserDisplay key={follower} user={follower} />
                            ))}
                        </Stack>
                    </Modal.Body>
                </Modal>

                <Modal show={showFollowingModal} size="sm" onClose={() => setShowFollowingModal(false)}>
                    <Modal.Header>Following</Modal.Header>
                    <Modal.Body>
                        <Stack spacing={4}>
                            {following.map(following => (
                                <UserDisplay key={following} user={following} />
                            ))}
                        </Stack>
                    </Modal.Body>
                </Modal>
            </>
        );
    }

  return (
    <div className="flex flex-col items-center text-center bg-[#081730] ">
      <div className="flex flex-col items-center justify-center w-full bg-[#081730] text-white p-2.5">
        <Avatar img={profilePhoto} size="xl" rounded bordered color="gray" />
        <h2 className='mt-5'>{auth()?.username}</h2><div className="py-2"></div>
          <div className="flex justify-center items-center mx-0 my-2.5">
              <UserList />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Button onClick={handleClick} leftIcon={<MdBuild />} colorScheme='orange' variant='solid'>
                  Settings
              </Button>
              {false ?
                  <Button isDisabled={true}>Spotify Connected</Button> :
                  <Button onClick={handleSpotifyIntegration} textColor="black" leftIcon={<FaSpotify />} colorScheme='green' variant='solid'>
                      Connect to Spotify
                  </Button>
              }
          </div>
      </div>
      <div className="py-5">
      </div>
    </div>
  );
}

export default Profile;