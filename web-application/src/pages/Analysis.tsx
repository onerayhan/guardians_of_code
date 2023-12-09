import Header from "../components/Header";
import  useMemoizedFetch from "../contexts/useMemoizedFetch";
import TableModule from "../components/Analysis/TableModule";
import ChartModule from "../components/Analysis/ChartModule";

interface TopLevelModuleProps {
    url: string;
}

const Analysis: React.FC<TopLevelModuleProps> = ({ url}) => {
    const data = useMemoizedFetch(url);

    return (
        <body className="bg-[#081730] overflow-y-auto text-white">
            <Header />
            <TableModule data={data || []} />
            <ChartModule  />
        </body>
    );
};

export default Analysis;
