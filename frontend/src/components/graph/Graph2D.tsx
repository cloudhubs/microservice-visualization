import React, { useCallback, useEffect, useState } from "react";
import ForceGraph2D, {ForceGraphProps as SharedProps, ForceGraphProps} from "react-force-graph-2d";
import {
    getColor,
    getLinkColor,
    getLinkOpacity,
    getLinkWidth,
    getNodeOpacity,
    getVisibility,
    getNeighbors,
    showNeighbors
} from "../../utils/GraphFunctions";
import * as THREE from "three";
import SpriteText from "three-spritetext";
import ForceGraph3D from "react-force-graph-3d";

type Props = {
    width: number;
    height: number;
    search: string;
    threshold: number;
    sharedProps: SharedProps;
    selectNodes: boolean;
    selectedNodes: any;
    setSelectedNodes: any;
    graphRef: any;
    setInitCoords: any;
    setInitRotation: any;
    antiPattern: any;
    colorMode: any;
    defNodeColor: any;
    setDefNodeColor: any;
    setGraphData: any;
    isDarkMode: any;
    selectedAntiPattern: any;
    trackNodes: any;
    focusNode: any;
    hideNodes: any;
    setHideNodes: any;
};

const Graph: React.FC<Props> = ({
    width,
    height,
    sharedProps,
    selectNodes,
    selectedNodes,
    setSelectedNodes,
    search,
    threshold,
    graphRef,
    setInitCoords,
    setInitRotation,
    antiPattern,
    colorMode,
    setGraphData,
    selectedAntiPattern,
    trackNodes,
    focusNode,
    hideNodes,
    setHideNodes,
})  => {
     const [highlightNodes, setHighlightNodes] = useState<any>(new Set());
     const [highlightLinks, setHighlightLinks] = useState<any>(new Set());
     const [hoverNode, setHoverNode] = useState(null);
     const [selectedLink, setSelectedLink] = useState(null);
     const [defNodeColor, setDefNodeColor] = useState(false);

     const handleNodeHover = (node: any) => {
         highlightNodes.clear();
         highlightLinks.clear();

         if (node) {
             highlightNodes.add(node);
         }
         updateHighlight();
     };

     const handleLinkHover = (link: any) => {
         highlightNodes.clear();
         highlightLinks.clear();

         if (link) {
             highlightLinks.add(link);
             highlightNodes.add(link.source);
             highlightNodes.add(link.target);
         }

         updateHighlight();
     };
     const updateHighlight = () => {
         setHighlightNodes(highlightNodes);
         setHighlightLinks(highlightLinks);
     };


     const handleNodeClick = useCallback(
         (node: any) => {
             if (node != null) {
                 if (graphRef.current) {
                     graphRef.current.zoomToFit(400, 150, (node2: any) => {
                         return node.nodeName === node2.nodeName;
                     });
                 }

                 const event = new CustomEvent("nodeClick", {
                     detail: { node: node },
                 });
                 document.dispatchEvent(event);
                 
                
                //setHideNodes(showNeighbors(node, graphRef.current, setHideNodes));
                //const updatedHideNodes = showNeighbors(node, graphRef.current, setHideNodes);
                //setHideNodes(updatedHideNodes);
             }
         },
         [graphRef]
     );

     useEffect(() => {
         graphRef.current.d3Force("charge").strength((node: any) => {
             if(node.nodeName.startsWith("SmallNode")){
                 return 0;
             }
             return -120;
         });
         graphRef.current.d3Force("link").distance((link: any) => {
             if(link.target.nodeName.startsWith("SmallNode")){
                 return 0;
             }
             return 100;
         });
     }, [graphRef]);

     return (
         <ForceGraph2D
             {...sharedProps}
             ref={graphRef}
             width={width}
             height={height}
             warmupTicks={100}
             onNodeDragEnd={(node) => {
                 if (node.x && node.y) {
                     node.fx = node.x;
                     node.fy = node.y;
                 }
             }}
             linkWidth={(link) => getLinkWidth(link, search, highlightLinks, false, "")}
             linkDirectionalArrowLength={(link: any) => {
                 if(link.target.nodeName != null){
                     if(link.target.nodeName.startsWith("SmallNode_")){
                         return 0;
                     }
                 }
                 return 20;
             }}
             linkDirectionalArrowRelPos={sharedProps.linkDirectionalArrowRelPos}
             linkDirectionalArrowColor={(link) =>
                 getLinkColor(link, search, hoverNode, antiPattern, false, null, null, selectNodes, selectedNodes)
             }
             linkDirectionalParticles={(link) =>
                 highlightLinks.has(link) ? 2 : 0
             }
             linkDirectionalParticleWidth={(link) => getLinkWidth(link, search, highlightLinks, false, "")}
             onNodeClick={handleNodeClick}
             onNodeHover={handleNodeHover}
             onLinkHover={handleLinkHover}
             nodeVisibility={(node) => getVisibility(node, hideNodes, selectNodes, selectedNodes)}
             nodeId={"nodeName"}
             nodeCanvasObjectMode={() => "after"}
             nodeRelSize={8}
             onNodeRightClick={(node: any) => {
                 const event = new CustomEvent("nodecontextmenu", {
                     detail: {
                         node: node,
                         coords: graphRef.current.graph2ScreenCoords(
                             node.x,
                             node.y
                         ),
                         graphData: sharedProps.graphData,
                         setHideNodes: setHideNodes,
                     },
                 });
                 document.dispatchEvent(event);
             }}
             nodeColor={(node: any) =>
                 getColor(
                     node,
                     sharedProps.graphData,
                     threshold,
                     highlightNodes,
                     hoverNode,
                     selectedNodes,
                     defNodeColor,
                     setDefNodeColor,
                     antiPattern,
                     colorMode,
                     null,
                     trackNodes, null
                 )
                     .replace(`)`, `, ${getNodeOpacity(node, search, highlightNodes, null)})`)
                     .replace("rgb", "rgba")
             }
             nodeCanvasObject={(node: any, ctx: any) => {
                 if(node.nodeName.startsWith("SmallNode_")){
                     node.val = 0.1;
                 } else {
                     let fontSize = 10;
                     ctx.font = `${fontSize}px "Orbitron,sans-serif"`;
                     const textWidth = ctx.measureText(node.nodeName).width;
                     let bckgDimensions = [textWidth, fontSize].map(
                         (n) => n + fontSize * 0.2
                     );
                     ctx.textAlign = "center";
                     ctx.textBaseline = "middle";
                     ctx.fillStyle = node.nodeColor;
                     ctx.fillText(node.nodeName, node.x, node.y - 10);
                     node.__bckgDimensions = bckgDimensions;
                 }
             }}
             linkColor={(link) =>
                 getLinkColor(link, search, hoverNode, antiPattern, false, null, null, selectNodes, selectedNodes)
             }
             linkCurvature={(link) => {
                 let test = false;
                 sharedProps.graphData?.links.forEach((link2: any) => {
                     if (
                         link2.target === link.source &&
                         link2.source === link.target
                     ) {
                         test = true;
                     }
                 });
                 if (test) {
                     return 0.4;
                 } else {
                     return 0;
                 }
             }}
         />
     );
};

export default Graph;
