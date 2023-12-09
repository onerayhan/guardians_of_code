import {Avatar} from "flowbite-react";
import {useAuthUser} from "react-auth-kit";
import PPDropModal from "./PPDropModal.tsx";
import {useEffect, useState} from "react";
import axios from "axios";

const SettingsPP = () =>
{
    const auth = useAuthUser();
    const [profilePhoto, setProfilePhoto] = useState<string | undefined>(undefined);

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
        }

        fetch_photo();
        return () => {
            if (profilePhoto) {
                URL.revokeObjectURL(profilePhoto);
            }
        };
    }, [profilePhoto]);
    return (
        <div className="flex flex-col items-center justify-center w-full bg-[#081730] text-white p-2.5">
            <Avatar img={profilePhoto} size="xl" rounded bordered color="gray" />
            <h2 className='mt-5'>{auth()?.username}</h2><div className="py-2"></div>
            <PPDropModal/>
        </div>
    );
};

export default SettingsPP;