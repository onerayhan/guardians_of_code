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