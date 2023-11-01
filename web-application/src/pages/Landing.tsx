import Header from "../components/Landing/Header";
import Hero from "../components/Landing/Body/Hero";
import Download from "../components/Landing/Body/Download";
import Experience from "../components/Landing/Body/Experience";
import Search from "../components/Landing/Body/Search";

const Landing = () => 
{
    return (
      <div>
        <Header />
        <Hero />
        <Experience />
        <Search />
        <Download />
      </div>
    );
};
  
export default Landing;