import React, { useState} from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import {Card, CardBody, Heading, Text, CardFooter, Button, HStack} from '@chakra-ui/react';
import axios, { AxiosError } from "axios";
import { RiUserFollowFill } from "react-icons/ri";
import {Avatar} from "flowbite-react";
import {useAuthUser} from "react-auth-kit";
import { useToast } from '@chakra-ui/react'
import { FaSearch } from "react-icons/fa";
import {useNavigate} from "react-router-dom";

// Define your validation schema using Yup
const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
});

// Define the type for your form values
interface FormValues {
    username: string;
}

// Define the type for the user info
interface UserInfo {
    username: string;
    follower_count: number;
    followed_count: number;
    profile_picture?: string;
}

const UsernameSubmit: React.FC = () => {
    const [error, setError] = useState("");
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [followedUsers, setFollowedUsers] = useState<string[]>([]);
    const [isFollowed, setFollowed] = useState(false);
    const auth = useAuthUser();
    const toast = useToast();
    const navigate = useNavigate();

    const FollowUser = async (user: UserInfo, followerUsername: string) => {
        try {
            await axios.post(
                "http://51.20.128.164/api/follow",
                { follower_username: followerUsername, followed_username: user.username }
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

    const navigateUser = (user: string) => {
        navigate(`/user/${user}`);
    }

    const onSubmitRequest = async (user: string) => {
        setError("");
        setUserInfo(null);
        setFollowed(false);

        try {
            const userInfoResponse = await axios.post(
                "http://51.20.128.164/api/user_info",
                { username: user }
            );
            setUserInfo(userInfoResponse.data);

            const ProfilePictureResponse = await axios.post("http://51.20.128.164/api/profile_picture", { username: user }, { responseType: 'blob' });
            const data = ProfilePictureResponse.data;
            const url = URL.createObjectURL(data);
            setUserInfo({ ...userInfoResponse.data, profile_picture: url });

            const followedInfo = await axios.post("http://51.20.128.164/api/user_followings", { username: `${auth()?.username}` });
            const follow = followedInfo.data[`${auth()?.username} follows`] || [];
            setFollowedUsers(follow);

            setFollowed(followedUsers.includes(user));

        } catch (err) {
            if (err && err instanceof AxiosError)
                setError(err.response?.data.message || "An error occurred");
            else if (err instanceof Error) setError(err.message);
            console.log("Error: ", err);
        }
    };

    return (
        <div className="relative w-full flex flex-col items-center top-12">
            <h1 className="text-4xl font-lalezar text-white">Search for Friends</h1>
            <Formik
                initialValues={{ username: "" }}
                validationSchema={validationSchema}
                onSubmit={(values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
                    onSubmitRequest(values.username);
                    setSubmitting(false);
                }}
            >
                {({ isSubmitting }) => (
                    <Form className="flex items-center w-[700px] relative py-5"> {/* Adjusted width to 1/2 */}
                        <Field
                            name="username"
                            className="w-full h-12 pl-4 pr-10 text-black text-opacity-80 rounded-xl"
                            placeholder="Search for friends..."
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white font-bold py-2 px-4 rounded-3xl"
                            disabled={isSubmitting}
                        >
                            <FaSearch size={25}/>
                        </button>
                    </Form>
                )}
            </Formik>

            {/* UserCard rendered here */}
            {userInfo && (
                <Card
                    className="w-[700px]"
                    overflow='hidden'
                    variant='outline'
                >
                    <div className="flex items-center"> {/* Added flex layout */}
                        <Avatar img={userInfo.profile_picture} size="xl" />

                        <HStack spacing={4} className="flex-grow">
                            <CardBody>
                                <Button onClick = {() => navigateUser(userInfo.username)}>{userInfo.username}</Button>
                                <Text py='2' className="font-lalezar">Followers: {userInfo.follower_count}</Text>
                                <Text py='2' className="font-lalezar">Following: {userInfo.followed_count}</Text>
                            </CardBody>

                            <CardFooter>
                                <Button
                                    variant='solid'
                                    colorScheme='whatsapp'
                                    onClick={() => FollowUser(userInfo,`${auth()?.username}`)}
                                    disabled={isFollowed}
                                >
                                    <RiUserFollowFill />
                                    <div className="px-1"></div>
                                    Follow User
                                </Button>
                                <div className="px-2"></div>
                            </CardFooter>
                        </HStack>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default UsernameSubmit;
