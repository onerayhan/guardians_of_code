import Header from "../components/Header";
import RatingPage from "../components/Rating/RatingPage.tsx";
import RefreshButton from "../components/Rating/RefreshButton.tsx"

const Rating = () =>
{
    return (
      <body className="bg-[#081730] overflow-y-auto">
        <Header />
          <RatingPage />
          <RefreshButton />
      </body>
    );
};
  
export default Rating;