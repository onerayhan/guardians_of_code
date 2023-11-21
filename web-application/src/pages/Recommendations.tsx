import Header from "../components/Header";
import RecommendationsPage from "../components/Recommendations/RecommendationsPage.tsx"

const Recommendations = () =>
{
    return (
        <div className="bg-[#081730]">
            <Header />
            <RecommendationsPage/>
        </div>
    );
};

export default Recommendations;