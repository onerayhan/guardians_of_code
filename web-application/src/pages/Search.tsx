import Header from "../components/Header";
import SpotifySearch from "../components/Search/SpotifySearch";

const Search = () =>
{
    return (
        <body className="bg-[#081730] overflow-y-auto">
        <div className="bg-[#081730]">
            <Header />
            <div className="flex flex-col items-center justify-center">
                <SpotifySearch />
            </div>
        </div>
        </body>
    );
};

export default Search;