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
};

const Graph: React.FC<Props> = ({
    width,
    height,
    sharedProps,
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
})  => {
     const [highlightNodes, setHighlightNodes] = useState<any>(new Set());
     const [highlightLinks, setHighlightLinks] = useState<any>(new Set());
     const [hoverNode, setHoverNode] = useState(null);
     const [selectedLink, setSelectedLink] = useState(null);
     const [defNodeColor, setDefNodeColor] = useState(false);
     const [hideNodes, setHideNodes] = useState<any>(new Set());

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
             return -120;
         });
         graphRef.current.d3Force("link").distance((link: any) => {
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
             linkDirectionalArrowLength={20}
             linkDirectionalArrowRelPos={sharedProps.linkDirectionalArrowRelPos}
             linkDirectionalArrowColor={(link) =>
                 getLinkColor(link, search, hoverNode, antiPattern, false, null, null)
             }
             linkDirectionalParticles={(link) =>
                 highlightLinks.has(link) ? 2 : 0
             }
             linkDirectionalParticleWidth={(link) => getLinkWidth(link, search, highlightLinks, false, "")}
             onNodeClick={handleNodeClick}
             onNodeHover={handleNodeHover}
             onLinkHover={handleLinkHover}
             nodeVisibility={(node) => getVisibility(node, hideNodes)}
             nodeId={"nodeName"}
             nodeLabel={"nodeName"}
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
             }}
             linkColor={(link) =>
                 getLinkColor(link, search, hoverNode, antiPattern, false, null, null)
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
         /*<ForceGraph2D
             ref={graphRef}
             graphData={sharedProps.graphData}
             nodeId={"nodeName"}
             width={width}
             height={height}
             nodeColor={(node: any) =>
                 "rgba(200,25,25,1)"
             }
             nodeVisibility={(node) => getVisibility(node, hideNodes)}
             onNodeRightClick={(node: any) => {
                 const event = new CustomEvent("nodecontextmenu", {
                     detail: {
                         node: node,
                         coords: graphRef.current.graph2ScreenCoords(
                             node.x,
                             node.y,
                             node.z
                         ),
                         graphData: sharedProps.graphData,
                         setHideNodes: setHideNodes,
                         setGraphData: setGraphData,
                     },
                 });
                 document.dispatchEvent(event);
             }}
             nodeCanvasObject={(node: any, ctx: any) => {
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
             }}
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
             linkDirectionalArrowLength={10}
             linkDirectionalArrowRelPos={sharedProps.linkDirectionalArrowRelPos}
             linkDirectionalArrowColor={(link) =>
                 getLinkColor(
                     link,
                     search,
                     hoverNode,
                     antiPattern,
                     true,
                     selectedAntiPattern,
                     focusNode
                 )
             }
             linkDirectionalParticles={(link: any) => {
                 return highlightLinks.has(link.name) ? 4 : 0;
             }}
             linkDirectionalParticleWidth={(link) =>
                 getLinkWidth(
                     link,
                     search,
                     highlightLinks,
                     antiPattern,
                     selectedAntiPattern
                 )
             }
             linkColor={(link) =>
                 getLinkColor(
                     link,
                     search,
                     hoverNode,
                     antiPattern,
                     true,
                     selectedAntiPattern,
                     focusNode
                 )
             }
             onNodeDragEnd={(node) => {
                 if (node.x && node.y) {
                     node.fx = node.x;
                     node.fy = node.y;
                 }
             }}
             backgroundColor={"rgba(0,0,0,0)"}
             nodeRelSize={8}
             onNodeClick={handleNodeClick}
             onNodeHover={handleNodeHover}
             onLinkHover={handleLinkHover}
             linkWidth={(link) =>
                 getLinkWidth(
                     link,
                     search,
                     highlightLinks,
                     antiPattern,
                     selectedAntiPattern
                 )
             }
         />*/
     );
};

export default Graph;
