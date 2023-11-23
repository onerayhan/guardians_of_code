import {Button} from "@chakra-ui/react";
import { IoRefreshCircleSharp } from "react-icons/io5";

const RefreshButton = () =>
{
    const refreshPage = () => {
        window.location.reload();
    };

    return (
        <div className="bg-[#081730] relative w-full flex flex-col items-center top-12 py-12">
            <h1 className="text-3xl font-lalezar text-white">Run out of Songs to Rate? Refresh The Page.</h1>
            <Button
                colorScheme='yellow'
                size='lg'
                onClick={refreshPage}
                className="flex items-center"
                leftIcon={<IoRefreshCircleSharp size={30}/>}
            >
                <span className="pl-5">Refresh Songs to be Rated</span>
            </Button>
        </div>
    );

};

export default RefreshButton;

