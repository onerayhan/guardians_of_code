import Header from "../components/Header";
import  useMemoizedFetch from "../contexts/useMemoizedFetch";
import TableModule from "../components/Analysis/TableModule";
import ChartModule from "../components/Analysis/ChartModule";

interface TopLevelModuleProps {
    url: string;
    chartType: string;
}

const Analysis: React.FC<TopLevelModuleProps> = ({ url, chartType }) => {
    //const data = useMemoizedFetch(url);

    const data = [
        ['Genre', 'Performer', "Friend Group"],
        ['value1', 'value2']
    ];

    return (
        <body className="bg-[#081730] overflow-y-auto text-white">
            <Header />
            <TableModule data={data || []} />
            <ChartModule type={chartType} data={data || []} />
        </body>
    );
};

export default Analysis;