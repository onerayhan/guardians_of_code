import {useNavigate} from "react-router-dom";
import {useAuthUser} from "react-auth-kit";
import {useIsAuthenticated} from "react-auth-kit";
import {useSignOut} from "react-auth-kit";
import axios from "axios";
import {AxiosError} from "axios";
import React from "react";
import { Button } from '@chakra-ui/react'


const DeleteUserButton: React.FC = () => {
    const [error, setError] = React.useState("");
    const navigate = useNavigate();
    const isAuthenticated = useIsAuthenticated();
    const signOut = useSignOut();
    const auth = useAuthUser();

    const handleSignOut = () => {
        if (isAuthenticated()) {
            navigate("/");
            signOut();
        }
    };
    const handleClick = async (values: any) => {
        console.log("Values: ", values);
        setError("");

        try {
            await axios.post(
                "http://13.51.167.155/api/user_delete",
                {username: auth()?.username}
            );
            handleSignOut();

        } catch(err) {
            if (err && err instanceof AxiosError)
                setError(err.response?.data.message);
            else if (err && err instanceof Error) setError(err.message);

            console.log("Error: ", err);
        }}

    return (
        <div className="flex flex-col items-center justify-center w-full bg-[#081730] text-white p-2.5">
            <Button colorScheme="red" onClick={handleClick}>Delete User</Button>
            <p className="text-red-500 font">{error}</p>
        </div>
    );
};

export default DeleteUserButton;