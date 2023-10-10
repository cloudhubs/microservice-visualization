import React from "react";
import { ForceGraphProps as SharedProps } from "react-force-graph-2d";

import Graph3D from "./Graph3D";

type Props = {
    width: number;
    height: number;
    search: string;
    threshold: number;
    selectNodes: boolean;
    selectedNodes: any;
    setSelectedNodes: any;
    graphRef: any;
    graphData: any;
    setInitCoords: any;
    setInitRotation: any;
    is3d: any;
    antiPattern: any;
    colorMode: any;
    defNodeColor: any;
    setDefNodeColor: any;
    setGraphData: any;
    isDarkMode: any;
    selectedAntiPattern: any;
    trackNodes: any;
    focusNode: any;
};

const VisualizationOptions: React.FC<Props> = ({
    width,
    height,
    search,
    threshold,
    selectNodes,
    selectedNodes,
    setSelectedNodes,
    graphRef,
    graphData,
    setInitCoords,
    setInitRotation,
    is3d,
    antiPattern,
    colorMode,
    defNodeColor,
    setDefNodeColor,
    setGraphData,
    isDarkMode,
    selectedAntiPattern,
    trackNodes,
    focusNode,
}) => {
    const Shared2D3DProps: SharedProps = {
        linkDirectionalArrowRelPos: 1,
        graphData: graphData,
    };

    const GraphProps = {
        sharedProps: Shared2D3DProps,
    };

    return (
        <div>
            {/* {!is3d ? (
                <Graph2D
                    width={width}
                    height={height}
                    {...GraphProps}
                    search={search}
                    graphRef={graphRef}
                    threshold={threshold}
                    setInitCoords={setInitCoords}
                    setInitRotation={setInitRotation}
                    antiPattern={antiPattern}
                    colorMode={colorMode}
                />
            ) : ( */}
            <Graph3D
                width={width}
                height={height}
                {...GraphProps}
                search={search}
                threshold={threshold}
                selectNodes={selectNodes}
                selectedNodes = {selectedNodes}
                setSelectedNodes={setSelectedNodes}
                graphRef={graphRef}
                setInitCoords={setInitCoords}
                setInitRotation={setInitRotation}
                antiPattern={antiPattern}
                colorMode={colorMode}
                defNodeColor={defNodeColor}
                setDefNodeColor={setDefNodeColor}
                setGraphData={setGraphData}
                isDarkMode={isDarkMode}
                selectedAntiPattern={selectedAntiPattern}
                trackNodes={trackNodes}
                focusNode={focusNode}
            />
        </div>
    );
};

export default VisualizationOptions;
