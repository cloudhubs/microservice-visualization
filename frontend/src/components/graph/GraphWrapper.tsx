import React, {useEffect, useState} from "react";
import { ForceGraphProps as SharedProps } from "react-force-graph-2d";

import Graph3D from "./Graph3D";
import Graph2D from "./Graph2D";

type Props = {
    width: number;
    height: number;
    search: string;
    threshold: number;
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
    const [hideNodes, setHideNodes] = useState<any>(new Set());
    const Shared2D3DProps: SharedProps = {
        linkDirectionalArrowRelPos: 1,
        graphData: graphData,
    };

    const GraphProps = {
        sharedProps: Shared2D3DProps,
    };

    const createSmallNode = (link: any) => {
        const smallNode = {
            nodeName: `SmallNode_${link.name}`,
            nodeRelSize: .5,
            // You can customize the properties of the small node here
        };

        return smallNode;
    };

    const generateSmallNodes = (graphData: any) => {
        const updatedNodes = [...graphData.nodes];
        const updatedLinks: { source: any; target: any; name: string; linkDistance?: number; }[] = [];

        graphData.links.forEach((link: any) => {
            const smallNode = createSmallNode(link);
            //hideNodes.add(smallNode);


            // Connect the small node to the main node
            updatedLinks.push({
                source: link.source,
                target: smallNode.nodeName,
                name: `Link_${link.name}`,
                linkDistance: 1
                // You can customize the properties of the link here
            });

            // Connect the small node to the target node
            updatedLinks.push({
                source: smallNode.nodeName,
                target: link.target,
                name: `Link_${link.name}`,
                // You can customize the properties of the link here
            });

            updatedNodes.push(smallNode);
        });

        return { nodes: updatedNodes, links: updatedLinks };
    };

    useEffect(() => {
        // Generate small nodes and update the graph data
        const updatedGraphData = generateSmallNodes(graphData);
        setGraphData(updatedGraphData);

    }, []);

    return (
        <div>
            { !is3d ? (
                <Graph2D
                    width={width}
                    height={height}
                    {...GraphProps}
                    search={search}
                    threshold={threshold}
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
            ) : (
            <Graph3D
                width={width}
                height={height}
                {...GraphProps}
                search={search}
                threshold={threshold}
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
                hideNodes={hideNodes}
                setHideNodes={setHideNodes}
                focusNode={focusNode}
            />)
            }

        </div>
    );
};

export default VisualizationOptions;
