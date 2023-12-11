import Header from "../components/Header";
import TweetButton from "../APIClasses/TweetButton";
import ExportCSV from "../components/Share/ExportCSV";

const SharePage = () => {

    return (
        <body className="bg-[#081730] overflow-y-auto">
        <Header/>
        <div className="flex justify-center mt-20">
            <h1 className="text-5xl text-white font-lalezar">Share your Results On Twitter</h1>
        </div>
        <div className="flex justify-center mt-5">

        </div>
        <div className="flex justify-center items-center bg-[#081730]">
            {/* Left Column */}
            <div className="flex flex-col items-center justify-center pl-5">
                <h2 className="text-2xl text-white font-lalezar">Share your Top 5 Albums</h2>
                <TweetButton shareType="albums"/>
            </div>
            {/* Middle Column */}
            <div className="flex flex-col items-center justify-center h-full pl-5">
                <h2 className="text-2xl text-white font-lalezar">Share your Top 5 Performers</h2>
                <TweetButton shareType="performers"/>
            </div>
            {/* Right Column */}
            <div className="flex flex-col items-center justify-center h-full pl-5">
                <h2 className="text-2xl text-white font-lalezar">Share your Top 5 Songs</h2>
                <TweetButton shareType="songs"/>
            </div>
        </div>
        <div className="py-5 bg-[#081730]"></div>
        <div className="flex justify-center mt-20">
            <h1 className="text-5xl text-white font-lalezar">Export your Rating Data</h1>
        </div>
        <ExportCSV/>
        </body>
    );
};

export default SharePage;