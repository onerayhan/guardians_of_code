import Header from "../components/Header";
import RecommendationsPage from "../components/Recommendations/RecommendationsPage.tsx"

const Recommendations = () =>
{
    return (
        <body className="bg-[#081730] overflow-y-auto">
            <Header />
            <RecommendationsPage/>
        </body>
    );
};

export default Recommendations;