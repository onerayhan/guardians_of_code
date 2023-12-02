import Header from "../components/Header";
import {useParams} from "react-router-dom";
const AlbumPage = () =>
{
    const { album } = useParams();
    return (
        <div className="bg-[#081730]">
            <Header />
            <h1>
                {album}
            </h1>
        </div>
    );
};

export default AlbumPage;