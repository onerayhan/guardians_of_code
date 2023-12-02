import Header from "../components/Header";
import SpotifySearch from "../components/Search/SpotifySearch";

const Search = () =>
{
    return (
        <body className="bg-[#081730] overflow-y-auto">
            <Header />
            <div className="flex flex-col items-center justify-center">
                <SpotifySearch />
            </div>
        </body>
    );
};

export default Search;