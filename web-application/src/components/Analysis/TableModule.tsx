import React from 'react';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import TableRenderers from 'react-pivottable/TableRenderers';
import Plot from 'react-plotly.js';
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';

// Create Plotly renderers
const PlotlyRenderers = createPlotlyRenderers(Plot);

interface TableModuleProps {
    data: any[]; // Replace 'any' with your specific data type
}

interface TableModuleState {
    pivotState: any; // State structure depends on your specific needs
}

class TableModule extends React.Component<TableModuleProps, TableModuleState> {
    constructor(props: TableModuleProps) {
        super(props);
        this.state = {
            pivotState: {
                data: props.data,
                rendererName: "Table",
                plotlyOptions: { width: 900, height: 500 },
                plotlyConfig: {},
            },
        };
    }

    handlePivotStateChange = (pivotState: any) => {
        this.setState({ pivotState });
    };

    render() {
        return (
            <div className="py-20 text-center">
                <h1 className="text-6xl font-bold">Create Your Own Tables!</h1>
                <div className="py-2"></div>
                <p className="text-xl font-bold">Drag and drop the attributes you want to see in your table.</p>
                <p className="text-xl font-bold">You can also change the table to a graph by clicking on the graph button.</p>
                <p className="text-xl font-bold">You can also change the graph type by clicking on the graph type button.</p>
                <div className="py-8"></div>

                <div className="flex justify-center">
                    <PivotTableUI
                    {...this.state.pivotState}
                    onChange={this.handlePivotStateChange}
                    renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
                /></div>

            </div>
        );
    }
}

export default TableModule;