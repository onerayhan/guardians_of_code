import Header from "../components/Header";
import {useParams} from "react-router-dom";
const SongPage = () =>
{

    const { song } = useParams();
    return (
        <div className="bg-[#081730]">
            <Header />
            <h1>
                {song}
            </h1>
        </div>
    );
};

export default SongPage;