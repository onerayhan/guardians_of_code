import Header from "../components/Header";
import Hero from "../components/Landing/Hero";
import Download from "../components/Landing/Download";
import Experience from "../components/Landing/Experience";
import Search from "../components/Landing/Search";

const Landing = () => 
{
    return (
      <div className="bg-[#081730]">
        <Header />
        <Hero />
        <Experience />
        <Search />
        <Download />
      </div>
    );
};
  
export default Landing;