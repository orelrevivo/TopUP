'use client';

import React, { useEffect, useState, useMemo } from 'react';
import classNames from 'classnames';
import { Markdown } from '~/components/chat/messages/Markdown';
import { ReactFlow, Controls, Background, MiniMap, useNodesState, useEdgesState, Panel, useReactFlow, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useStore } from '@nanostores/react';
import { canvasStore } from '~/lib/stores/canvasStore';

function CanvasInner({ workspaceId }: { workspaceId: string }) {
  const [loading, setLoading] = useState(true);
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/canvas/data?workspaceId=${workspaceId}`);
      if (!res.ok) throw new Error('Failed to fetch canvas data');
      const json = await res.json();
      
      const newNodes: any[] = [];
      let yOffset = 50;

      // Map Foundation
      if (json.intelligence) {
        newNodes.push({
          id: 'node-intelligence',
          type: 'default',
          position: { x: 250, y: yOffset },
          data: { 
            label: (
              <div className="p-2 w-80 text-left">
                <h3 className="font-bold flex items-center gap-2 mb-2"><i className="i-ph:brain-duotone text-purple-500" /> Workspace Knowledge</h3>
                <div className="text-xs mb-1 font-semibold text-gray-500">Target Audience</div>
                <div className="text-sm mb-2">{json.intelligence.targetAudience}</div>
                <div className="text-xs mb-1 font-semibold text-gray-500">Positioning</div>
                <div className="text-sm">{json.intelligence.positioning}</div>
              </div>
            ) 
          },
          style: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }
        });
        yOffset += 250;
      }

      // Map Competitors
      if (json.competitors && json.competitors.length > 0) {
        json.competitors.forEach((c: any, index: number) => {
          newNodes.push({
            id: `node-comp-${c.id}`,
            type: 'default',
            position: { x: index * 350 + 50, y: yOffset },
            data: { 
              label: (
                <div className="p-2 w-72 text-left">
                  <h4 className="font-bold flex items-center gap-2"><i className="i-ph:users-three-duotone text-blue-500" /> {c.name}</h4>
                  <div className="text-xs mt-2 text-green-600 font-semibold">Strengths</div>
                  <div className="text-xs mt-1">{c.strengths}</div>
                  <div className="text-xs mt-2 text-red-600 font-semibold">Weaknesses</div>
                  <div className="text-xs mt-1">{c.weaknesses}</div>
                </div>
              ) 
            },
            style: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }
          });
        });
        yOffset += 250;
      }

      // Map Ideas
      if (json.ideas && json.ideas.length > 0) {
        json.ideas.forEach((idea: any, index: number) => {
          newNodes.push({
            id: `node-idea-${idea.id}`,
            type: 'default',
            position: { x: index * 350 + 50, y: yOffset },
            data: { 
              label: (
                <div className="p-2 w-72 text-left">
                  <h4 className="font-bold flex items-center gap-2 mb-2"><i className="i-ph:sparkle-duotone text-yellow-500" /> {idea.title}</h4>
                  <div className="text-xs mb-2 text-gray-600">{idea.description}</div>
                  <div className="bg-gray-50 p-2 rounded text-xs text-gray-500 border border-gray-100">
                    <span className="font-semibold block mb-1">AI Reasoning</span>
                    {idea.reasoning}
                  </div>
                </div>
              ) 
            },
            style: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }
          });
        });
        yOffset += 300;
      }

      // Map Cards
      if (json.canvasCards && json.canvasCards.length > 0) {
        json.canvasCards.forEach((card: any, index: number) => {
          newNodes.push({
            id: `node-card-${card.id}`,
            type: 'default',
            position: { x: (index % 3) * 400 + 50, y: yOffset + Math.floor(index / 3) * 300 },
            data: { 
              label: (
                <div className="p-3 w-80 text-left">
                  <h4 className="font-bold flex items-center gap-2 mb-2"><i className="i-ph:cards-duotone text-purple-500" /> {card.title}</h4>
                  <div className="text-xs text-gray-700 max-h-40 overflow-y-auto custom-scrollbar prose prose-sm">
                    <Markdown>{card.content}</Markdown>
                  </div>
                </div>
              ) 
            },
            style: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }
          });
        });
      }

      // If no nodes, add a placeholder node
      if (newNodes.length === 0) {
        newNodes.push({
          id: 'placeholder-node',
          type: 'default',
          position: { x: 400, y: 300 },
          data: { 
            label: (
              <div className="p-4 text-center">
                <i className="i-ph:magic-wand text-4xl text-blue-500 mb-2" />
                <h3 className="font-bold text-lg mb-1">Infinite AI Canvas</h3>
                <p className="text-sm text-gray-500">The agent will map its findings, sketches, and reasoning here 24/7.</p>
              </div>
            ) 
          },
          style: { background: '#fff', border: '2px dashed #cbd5e1', borderRadius: '16px' }
        });
      }

      setNodes(newNodes);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Poll occasionally to see if AI updated the canvas
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [workspaceId]);

  const liveCanvas = useStore(canvasStore);
  const { setCenter, fitView } = useReactFlow();

  useEffect(() => {
    if (liveCanvas.focusTrigger) {
      setCenter(liveCanvas.focusTrigger.x, liveCanvas.focusTrigger.y, { duration: 800, zoom: 1 });
    }
  }, [liveCanvas.focusTrigger, setCenter]);

  // Force fitView when new live nodes arrive so the user never loses them!
  useEffect(() => {
    console.log('[CANVAS-DEBUG] Live canvas nodes updated!', liveCanvas.nodes);
    if (liveCanvas.nodes.length > 0) {
      setTimeout(() => fitView({ padding: 0.2, duration: 800 }), 100);
    }
  }, [liveCanvas.nodes.length, fitView, liveCanvas.nodes]);

  const allNodes = useMemo(() => {
    const liveNodes = liveCanvas.nodes.map(n => ({
      id: n.id,
      type: 'default',
      position: { x: n.x, y: n.y },
      data: {
        label: n.type === 'generating' ? (
          <div className="p-4 w-64 text-center">
            <span className="w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-[length:200%_100%] animate-[pulse_2s_ease-in-out_infinite,gradient_2s_linear_infinite] block rounded mb-2" />
            <span className="text-sm font-semibold text-blue-500 animate-pulse">AI is generating...</span>
          </div>
        ) : (
          <div className="p-3 w-[400px] text-left">
            {n.label && <h4 className="font-bold flex items-center gap-2 mb-2 text-blue-600 border-b border-blue-100 pb-2"><i className="i-ph:sparkle-duotone" /> {n.label}</h4>}
            <div className="text-sm text-gray-700 max-h-96 overflow-y-auto custom-scrollbar prose prose-sm break-words">
              <Markdown>{n.content || ''}</Markdown>
            </div>
          </div>
        )
      },
      style: { background: '#fff', border: n.type === 'generating' ? '2px solid #3b82f6' : '1px solid #3b82f6', borderRadius: '12px', boxShadow: '0 4px 20px -2px rgb(59 130 246 / 0.4)', zIndex: 1000 }
    }));
    return [...nodes, ...liveNodes];
  }, [nodes, liveCanvas.nodes]);

  if (loading && nodes.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-falbor-elements-background">
        <span className="i-ph:circle-notch w-10 h-10 animate-spin mb-4" />
        <p>AI is assembling your canvas...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col bg-[#FAFAFA] dark:bg-[#111114]">
      <div className="w-full h-full">
        <ReactFlow
          nodes={allNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          minZoom={0.1}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
          className="bg-dot-pattern"
        >
          <Background color="#9CA3AF" gap={20} size={1} />
          <Controls className="!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700 !shadow-sm" />
          <Panel position="top-left" className="bg-white/80 dark:bg-black/50 backdrop-blur px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-800 shadow-sm text-sm font-medium">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live Workspace Canvas
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}

export function WorkspaceCanvasView({ workspaceId }: { workspaceId: string }) {
  return (
    <ReactFlowProvider>
      <CanvasInner workspaceId={workspaceId} />
    </ReactFlowProvider>
  );
}
