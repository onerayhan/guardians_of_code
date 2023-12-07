import Header from "../components/Header";
import RatingPage from "../components/Rating/RatingPage.tsx";
import RefreshButton from "../components/Rating/RefreshButton.tsx"
import {BsGraphUpArrow} from "react-icons/bs";
import {useState} from "react";
import {Button, VStack} from "@chakra-ui/react";
import RateFileUpload from "../components/Rating/BatchRateInput.tsx";

const Rating = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCloseModal = () => setIsModalOpen(true);
    const handleOpenModal = () => setIsModalOpen(false);

    return (
        <body className="bg-[#081730] overflow-y-auto">
        <Header/>
        <RatingPage/>
        <div className="flex items-center justify-center bg-[#081730]">
            {/* Left Column */}
            <div className="w-1/2 text-center flex flex-col items-center justify-center pr-32">
                <RefreshButton/>
            </div>
            {/* Right Column */}
            <div className="flex flex-col items-center justify-center h-full pl-14 pl-5">
                <div className="bg-[#081730] relative w-full flex flex-col items-center top-12 py-12">
                    <h1 className="text-3xl font-lalezar text-white">Import Rate Information in the Form of a File.</h1>
                    <Button
                        onClick={handleOpenModal}
                        colorScheme='yellow'
                        size='lg'
                        className="flex items-center"
                    >
                        <BsGraphUpArrow size={20}/>
                        <span className="pl-5">Import Ratings from File</span>
                    </Button>

                    {isModalOpen && <RateFileUpload isOpen={isModalOpen} onClose={handleCloseModal}/>}
                </div>
            </div>
        </div>
        </body>
    );
};

export default Rating;