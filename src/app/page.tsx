"use client";

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Eye, Target, Zap, Users, Mail, Globe, ArrowRight } from 'lucide-react';
import articlesData from '../data/articles.json';

interface Article {
  id: number;
  title: string;
  category: "導入事例" | "技術解説" | "お知らせ";
  date: string;
  slug: string;
}

// Types for Transformer/Attention-based Neural Field
interface AttentionNodeType {
  id: number;
  x: number;
  y: number;
  z: number;
  baseSize: number;
  importance: number;
  activationLevel: number;
  attentionScore: number;
  pulsePhase: number;
  bloomIntensity: number;
  bloomDecay: number;
  lastActivation: number;
  neighbors: number[];
  semanticType: 'query' | 'key' | 'value' | 'output';
  headId: number;
}

interface AttentionFlowType {
  sourceId: number;
  targetId: number;
  weight: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
  speed: number;
  trail: { x: number; y: number; alpha: number; weight: number; timestamp: number }[];
  hue: number;
  intensity: number;
  lifespan: number;
}

// Transformer Attention Field Animation Component
const TransformerAttentionField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number | null>(null);
  const nodesRef = useRef<AttentionNodeType[]>([]);
  const attentionFlowsRef = useRef<AttentionFlowType[]>([]);
  
  // Performance optimization refs
  const lastFrameTime = useRef<number>(0);
  const isVisible = useRef<boolean>(true);
  const neighborCache = useRef<Map<number, number[]>>(new Map());
  const isInitialized = useRef<boolean>(false);
  const animationStartTime = useRef<number>(Date.now());
  const pausedTime = useRef<number>(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Sharp rendering settings for crisp laser-like lines
    ctx.imageSmoothingEnabled = false;
    
    let width: number, height: number;
    
    // Performance monitoring - define early
    let isMobileDevice = false;
    const updateMobileStatus = () => {
      isMobileDevice = width < 768;
    };
    const isMobile = () => isMobileDevice;
    const getTargetFPS = () => isMobile() ? 30 : 60;
    const getFrameInterval = () => 1000 / getTargetFPS();
    
    // Visibility API for performance
    const handleVisibilityChange = () => {
      const wasVisible = isVisible.current;
      isVisible.current = !document.hidden;
      
      if (!isVisible.current && animationIdRef.current) {
        // Pausing - save current progress
        pausedTime.current += Date.now() - animationStartTime.current;
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      } else if (isVisible.current && !animationIdRef.current && wasVisible !== isVisible.current) {
        // Resuming - reset start time but keep accumulated time
        animationStartTime.current = Date.now();
        animate();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Progressive initialization
    const initAttentionField = async () => {
      nodesRef.current = [];
      attentionFlowsRef.current = [];
      neighborCache.current.clear();
      isInitialized.current = false;
      // Reset animation timing
      animationStartTime.current = Date.now();
      pausedTime.current = 0;
      
      const screenArea = width * height;
      const pcArea = 1920 * 1080; // Reference PC screen
      const sizeRatio = screenArea / pcArea;
      
      // Dynamic node density based on screen size
      let optimalDensity: number;
      let minNodes: number;
      let maxNodes: number;
      
      if (sizeRatio >= 1) {
        // PC full size
        optimalDensity = 0.000035;
        minNodes = 400;
        maxNodes = 1200;
      } else if (sizeRatio >= 0.5) {
        // Tablet
        optimalDensity = 0.00003;
        minNodes = 300;
        maxNodes = 900;
      } else if (sizeRatio >= 0.25) {
        // Large phone
        optimalDensity = 0.000025;
        minNodes = 200;
        maxNodes = 600;
      } else {
        // Small phone
        optimalDensity = 0.00002;
        minNodes = 150;
        maxNodes = 400;
      }
      
      const totalNodes = Math.floor(screenArea * optimalDensity);
      const nodeCount = Math.max(minNodes, Math.min(maxNodes, totalNodes));
      
      if (isMobile()) {
        // Mobile: Create all nodes at once for simplicity and consistency
        await createInitialNodes(nodeCount);
      } else {
        // Desktop: Progressive loading
        // Stage 1: Create minimal initial nodes for immediate display
        const initialNodes = Math.min(35, Math.floor(nodeCount * 0.08));
        await createInitialNodes(initialNodes);
        
        // Stage 2: Progressive node addition
        await progressivelyAddNodes(nodeCount - initialNodes);
      }
      
      isInitialized.current = true;
    };
    
    const createInitialNodes = async (count: number) => {
      const types: AttentionNodeType['semanticType'][] = ['query', 'key', 'value', 'output'];
      const margin = 50;
      
      for (let i = 0; i < count; i++) {
        let x, y;
        
        if (isMobile()) {
          // Mobile: Deterministic placement that looks random
          x = margin + getRandom(i * 12345) * (width - 2 * margin);
          y = margin + getRandom(i * 67890) * (height - 2 * margin);
        } else {
          // Desktop: True random with collision detection
          if (i === 0) {
            x = Math.random() * width;
            y = Math.random() * height;
          } else {
            const minDistance = Math.sqrt((width * height) / count) * 0.8;
            let placed = false;
            let attempts = 0;
            
            while (!placed && attempts < 15) {
              x = Math.random() * width;
              y = Math.random() * height;
              
              let validPosition = true;
              for (const node of nodesRef.current) {
                if ((x - node.x) ** 2 + (y - node.y) ** 2 < minDistance ** 2) {
                  validPosition = false;
                  break;
                }
              }
              
              if (validPosition) placed = true;
              attempts++;
            }
            
            if (!placed) {
              x = Math.random() * width;
              y = Math.random() * height;
            }
          }
        }
        
        nodesRef.current.push(createAttentionNode(i, x, y, types));
      }
      
      buildOptimizedNeighborhoods();
    };
    
    const progressivelyAddNodes = async (remainingCount: number) => {
      if (isMobile()) {
        // Mobile: Skip progressive addition, all nodes were created in initial batch
        return;
      }
      
      const batchSize = 15; // Gradual node addition in small batches
      const types: AttentionNodeType['semanticType'][] = ['query', 'key', 'value', 'output'];
      
      for (let batch = 0; batch < Math.ceil(remainingCount / batchSize); batch++) {
        const nodesToAdd = Math.min(batchSize, remainingCount - batch * batchSize);
        
        await new Promise(resolve => {
          requestIdleCallback(() => {
            const startId = nodesRef.current.length;
            
            for (let i = 0; i < nodesToAdd; i++) {
              const x = Math.random() * width;
              const y = Math.random() * height;
              nodesRef.current.push(createAttentionNode(startId + i, x, y, types));
            }
            
            // Rebuild neighborhoods incrementally
            buildOptimizedNeighborhoods();
            resolve(void 0);
          });
        });
      }
    };
    
    
    // Unified random function - uses Math.random for desktop, deterministic for mobile
    const getRandom = (seed?: number) => {
      if (isMobile() && seed !== undefined) {
        return ((seed * 9301 + 49297) % 233280) / 233280.0;
      }
      return Math.random();
    };
    
    const createAttentionNode = (id: number, x: number, y: number, types: AttentionNodeType['semanticType'][]): AttentionNodeType => {
      const seed = isMobile() ? id * 7919 : undefined;
      
      const semanticType = types[Math.floor(getRandom(seed) * types.length)];
      const importance = 0.3 + getRandom(seed ? seed + 1 : undefined) * 0.7;
      const headId = Math.floor(getRandom(seed ? seed + 2 : undefined) * 8);
      
      return {
        id,
        x,
        y,
        z: 50 + getRandom(seed ? seed + 3 : undefined) * 50,
        baseSize: (1.0 + importance * 1.5 + getRandom(seed ? seed + 4 : undefined) * 0.5) * 1.5,
        importance,
        activationLevel: 0.1 + getRandom(seed ? seed + 1 : undefined) * 0.3,
        attentionScore: 0,
        pulsePhase: getRandom(seed ? seed + 2 : undefined) * Math.PI * 2,
        bloomIntensity: 0,
        bloomDecay: 0,
        lastActivation: 0,
        neighbors: [],
        semanticType,
        headId
      };
    };
    
    const buildOptimizedNeighborhoods = () => {
      const maxNeighborDistance = Math.min(width, height) * 0.35;
      const maxNeighborDistanceSq = maxNeighborDistance * maxNeighborDistance; // Avoid sqrt
      
      nodesRef.current.forEach((node, index) => {
        // Check cache first
        if (neighborCache.current.has(node.id)) {
          node.neighbors = neighborCache.current.get(node.id) || [];
          return;
        }
        
        node.neighbors = [];
        
        nodesRef.current.forEach((otherNode, otherIndex) => {
          if (index !== otherIndex) {
            const distanceSq = (node.x - otherNode.x) ** 2 + (node.y - otherNode.y) ** 2; // No sqrt
            
            if (distanceSq < maxNeighborDistanceSq) {
              node.neighbors.push(otherIndex);
            }
          }
        });
        
        // Maximum neighbors for performance - optimized sorting
        if (node.neighbors.length > 35) {
          node.neighbors = node.neighbors
            .sort((a, b) => {
              const distASq = (node.x - nodesRef.current[a].x) ** 2 + (node.y - nodesRef.current[a].y) ** 2;
              const distBSq = (node.x - nodesRef.current[b].x) ** 2 + (node.y - nodesRef.current[b].y) ** 2;
              return distASq - distBSq; // Compare squared distances
            })
            .slice(0, 35);
        }
        
        // Cache the result
        neighborCache.current.set(node.id, [...node.neighbors]);
      });
    };
    
    const createAlgorithmicFlow = () => {
      // Skip if not fully initialized
      if (!isInitialized.current) return;
      
      // Dynamic flow count based on screen size: PC=32, smaller screens get 2^n values
      const screenArea = width * height;
      const pcArea = 1920 * 1080; // Reference PC screen
      const sizeRatio = screenArea / pcArea;
      
      let maxFlows: number;
      if (sizeRatio >= 1) maxFlows = 32;        // PC full size: 32
      else if (sizeRatio >= 0.5) maxFlows = 16; // Tablet: 16
      else if (sizeRatio >= 0.25) maxFlows = 8; // Large phone: 8
      else maxFlows = 4;                        // Small phone: 4
      
      if (nodesRef.current.length < 2 || attentionFlowsRef.current.length > maxFlows) return;
      
      const sourceNode = selectNodeByImportance();
      if (!sourceNode) return;
      
      const candidates = sourceNode.neighbors.map(id => nodesRef.current[id]).filter(Boolean);
      if (candidates.length === 0) return;
      
      const targetNode = candidates[Math.floor(Math.random() * candidates.length)];
      
      const flow: AttentionFlowType = {
        sourceId: sourceNode.id,
        targetId: targetNode.id,
        weight: 0.5 + Math.random() * 0.5,
        x: sourceNode.x,
        y: sourceNode.y,
        targetX: targetNode.x,
        targetY: targetNode.y,
        progress: 0,
        speed: 0.002 + Math.random() * 0.003, // Slower, more elegant flows
        trail: [],
        hue: getAlgorithmicFlowColor(sourceNode, targetNode),
        intensity: 0.6 + Math.random() * 0.25, // More subtle intensity
        lifespan: 200 + Math.random() * 100 // Longer, more graceful flows
      };
      
      attentionFlowsRef.current.push(flow);
      
      sourceNode.lastActivation = Date.now();
      targetNode.attentionScore += flow.weight * 0.5;
    };
    
    
    
    
    const selectNodeByImportance = (): AttentionNodeType | null => {
      if (nodesRef.current.length === 0) return null;
      
      const totalImportance = nodesRef.current.reduce((sum, node) => sum + node.importance, 0);
      let random = Math.random() * totalImportance;
      
      for (const node of nodesRef.current) {
        random -= node.importance;
        if (random <= 0) return node;
      }
      
      return nodesRef.current[0];
    };
    
    
    
    const getSemanticColor = (sourceType: string, targetType: string): number => {
      const colorMap: Record<string, number> = {
        query: 200,
        key: 210,
        value: 190,
        output: 180
      };
      
      const sourceHue = colorMap[sourceType] || 200;
      const targetHue = colorMap[targetType] || 200;
      
      return (sourceHue + targetHue) / 2 + (Math.random() - 0.5) * 10;
    };
    
    const getMultiHeadColor = (headId: number): number => {
      // 8 distinct hues for 8 attention heads, distributed around color wheel
      const headColors = [200, 220, 240, 180, 160, 280, 300, 320];
      return headColors[headId % 8];
    };
    
    
    
    
    const drawNetworkConnections = () => {
      const screenArea = width * height;
      const pcArea = 1920 * 1080;
      const sizeRatio = screenArea / pcArea;
      
      // Dynamic connection density and count based on screen size
      let connectionMultiplier: number;
      let maxConnectionsPerNode: number;
      let opacityFactor: number;
      
      if (sizeRatio >= 1) {
        // PC full size
        connectionMultiplier = 1.2;
        maxConnectionsPerNode = 18;
        opacityFactor = 1;
      } else if (sizeRatio >= 0.5) {
        // Tablet
        connectionMultiplier = 1.0;
        maxConnectionsPerNode = 14;
        opacityFactor = 0.8;
      } else if (sizeRatio >= 0.25) {
        // Large phone
        connectionMultiplier = 0.8;
        maxConnectionsPerNode = 10;
        opacityFactor = 0.6;
      } else {
        // Small phone
        connectionMultiplier = 0.6;
        maxConnectionsPerNode = 6;
        opacityFactor = 0.5;
      }
      
      const connectionDensity = Math.min(nodesRef.current.length * connectionMultiplier, 1000);
      
      for (let i = 0; i < connectionDensity; i++) {
        const node = nodesRef.current[i];
        if (!node) continue;
        
        // Screen size responsive connections per node
        const connectionsToShow = Math.min(node.neighbors.length, maxConnectionsPerNode);
        
        for (let j = 0; j < connectionsToShow; j++) {
          const neighborId = node.neighbors[j];
          const neighbor = nodesRef.current[neighborId];
          if (!neighbor) continue;
          
          const distance = Math.sqrt((node.x - neighbor.x) ** 2 + (node.y - neighbor.y) ** 2);
          const maxDist = Math.min(width, height) * 0.35;
          const strength = Math.max(0, 1 - distance / maxDist) * 0.12 * opacityFactor; // 0.08 → 0.12
          
          const distanceRatio = distance / maxDist;
          const adjustedStrength = strength * (1.1 - distanceRatio * 0.7);
          
          if (adjustedStrength > 0.012 * opacityFactor) { // 0.008 → 0.012
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${adjustedStrength})`;
            ctx.lineWidth = 0.2; // Sharp laser-like lines
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(neighbor.x, neighbor.y);
            ctx.stroke();
          }
        }
      }
    };
    
    
    // Animation loop for elegant Transformer field
    const animate = () => {
      // Frame rate control
      const now = performance.now();
      const frameInterval = getFrameInterval();
      
      if (now - lastFrameTime.current < frameInterval) {
        animationIdRef.current = requestAnimationFrame(animate);
        return;
      }
      
      lastFrameTime.current = now;
      
      // Skip rendering if not visible, but keep animation loop running
      if (!isVisible.current) {
        animationIdRef.current = requestAnimationFrame(animate);
        return;
      }
      
      // Ensure complete black background coverage
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Use continuous time that survives interruptions
      const currentTime = Date.now();
      const time = (currentTime - animationStartTime.current + pausedTime.current) * 0.001;
      
      // Draw subtle particle-like connections
      ctx.globalAlpha = 0.03;
      drawAmbientConnections();
      ctx.globalAlpha = 1;
      
      // Update and draw elegant attention flows (disabled on mobile)
      if (!isMobile()) {
        attentionFlowsRef.current = attentionFlowsRef.current.filter(flow => {
          flow.progress += flow.speed;
        
          if (flow.progress >= 1) {
            const targetNode = nodesRef.current.find(n => n.id === flow.targetId);
            if (targetNode) {
              targetNode.bloomIntensity = 0.6;
              targetNode.bloomDecay = 0.02;
              targetNode.activationLevel = Math.min(1, targetNode.activationLevel + 0.3);
            }
            return false;
          }
          
          const t = flow.progress;
          const easedProgress = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          
          const controlX = (flow.x + flow.targetX) / 2 + (Math.random() - 0.5) * 50;
          const controlY = (flow.y + flow.targetY) / 2 + (Math.random() - 0.5) * 50;
          
          const currentX = (1 - easedProgress) * (1 - easedProgress) * flow.x + 
                          2 * (1 - easedProgress) * easedProgress * controlX + 
                          easedProgress * easedProgress * flow.targetX;
          const currentY = (1 - easedProgress) * (1 - easedProgress) * flow.y + 
                          2 * (1 - easedProgress) * easedProgress * controlY + 
                          easedProgress * easedProgress * flow.targetY;
          
          // Add to trail with timestamp for time-based disappearing
          const currentTime = Date.now();
          flow.trail.push({ x: currentX, y: currentY, alpha: 1, weight: flow.weight, timestamp: currentTime });
          
          // Remove trail points older than 400ms (much faster disappear)
          const trailLifespan = 400; // milliseconds - much shorter
          flow.trail = flow.trail.filter(point => currentTime - point.timestamp < trailLifespan);
          
          // Draw time-based fading trail points with accelerated fade
          flow.trail.forEach((point) => {
            const age = currentTime - point.timestamp;
            const ageRatio = age / trailLifespan;
            
            // Exponential fade for faster disappearing + much lower opacity
            const alpha = Math.max(0, Math.pow(1 - ageRatio, 2) * 0.08 * flow.intensity);
            const pointSize = Math.max(0, Math.pow(1 - ageRatio, 1.5) * 0.8 * flow.intensity);
            
            // Higher threshold to stop drawing sooner
            if (alpha > 0.005 && pointSize > 0.05) {
              ctx.beginPath();
              ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
              ctx.arc(point.x, point.y, pointSize, 0, Math.PI * 2);
              ctx.fill();
            }
          });
          
          // Draw brighter and more vivid colorful main flow particle
          ctx.beginPath();
          const flowGradient = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, 3.8 * flow.intensity);
          flowGradient.addColorStop(0, `hsla(${flow.hue}, 100%, 95%, 1.0)`);    // Brightest core
          flowGradient.addColorStop(0.3, `hsla(${flow.hue}, 95%, 88%, 0.85)`);  // Bright inner
          flowGradient.addColorStop(0.6, `hsla(${flow.hue}, 90%, 80%, 0.5)`);   // Clear middle
          flowGradient.addColorStop(0.9, `hsla(${flow.hue}, 85%, 72%, 0.2)`);   // Soft outer
          flowGradient.addColorStop(1, `hsla(${flow.hue}, 80%, 65%, 0)`);       // Fade edge
          ctx.fillStyle = flowGradient;
          ctx.arc(currentX, currentY, 3.8 * flow.intensity, 0, Math.PI * 2);
          ctx.fill();
          
          return true;
        });
      }
      
      // Draw elegant network structure
      drawNetworkConnections();
      
      // Add sophisticated long-range connections
      if (Math.floor(time * 60) % 3 === 0) {
        drawLongRangeConnections();
      }
      
      // Add particle-like background connections
      drawParticleBackground();
      
      // Draw elegant Transformer nodes with sophisticated beauty
      nodesRef.current.forEach((node) => {
        // Glow effect instead of pulse - elegant breathing light
        const glowIntensity = Math.sin(time * 0.8 + node.pulsePhase) * 0.3 + 0.7;
        const size = node.baseSize * (node.z / 100); // Fixed size, no pulsing
        const isMobile = width < 768;
        const mobileAlphaFactor = isMobile ? 0.5 : 1; // Balanced visibility reduction on mobile
        const baseAlpha = Math.max(0.06, node.importance * 0.2) * mobileAlphaFactor;
        const alpha = (baseAlpha + (node.activationLevel * 0.15 + node.attentionScore * 0.1) * mobileAlphaFactor) * glowIntensity;
        
        // Sophisticated Transformer colors with better balance
        const semanticHue = getSemanticColor(node.semanticType, node.semanticType);
        const headHue = getMultiHeadColor(node.headId);
        const hue = (semanticHue * 0.75 + headHue * 0.25);
        
        // Elegant bloom effect for active nodes
        if (node.bloomIntensity > 0) {
          const bloomSize = size * (1 + node.bloomIntensity * 1.2);
          const bloomAlpha = node.bloomIntensity * 0.08 * mobileAlphaFactor * glowIntensity;
          
          ctx.beginPath();
          const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, bloomSize * 2.5);
          gradient.addColorStop(0, `hsla(${hue}, 65%, 70%, ${bloomAlpha})`);
          gradient.addColorStop(0.4, `hsla(${hue}, 55%, 60%, ${bloomAlpha * 0.6})`);
          gradient.addColorStop(0.8, `hsla(${hue}, 45%, 50%, ${bloomAlpha * 0.2})`);
          gradient.addColorStop(1, `hsla(${hue}, 35%, 40%, 0)`);
          ctx.fillStyle = gradient;
          ctx.arc(node.x, node.y, bloomSize * 2.5, 0, Math.PI * 2);
          ctx.fill();
          
          node.bloomIntensity -= node.bloomDecay;
          if (node.bloomIntensity < 0) node.bloomIntensity = 0;
        }
        
        // Sophisticated main node with refined gradients and glow
        const saturation = 70 + node.importance * 12;
        
        ctx.beginPath();
        const nodeGradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, size * 2.2);
        nodeGradient.addColorStop(0, `hsla(${hue}, ${saturation}%, 75%, ${alpha})`);
        nodeGradient.addColorStop(0.5, `hsla(${hue + 8}, ${saturation - 8}%, 65%, ${alpha * 0.5})`);
        nodeGradient.addColorStop(0.8, `hsla(${hue + 15}, ${saturation - 15}%, 55%, ${alpha * 0.2})`);
        nodeGradient.addColorStop(1, `hsla(${hue + 22}, ${saturation - 22}%, 45%, 0)`);
        ctx.fillStyle = nodeGradient;
        ctx.arc(node.x, node.y, size * 2.2, 0, Math.PI * 2);
        ctx.fill();
        
        // Refined core with subtle intellectual glow
        ctx.beginPath();
        const coreGradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, size * 0.9);
        coreGradient.addColorStop(0, `hsla(${hue}, ${saturation + 12}%, 88%, ${alpha * 0.9})`);
        coreGradient.addColorStop(0.7, `hsla(${hue + 5}, ${saturation + 8}%, 82%, ${alpha * 0.6})`);
        coreGradient.addColorStop(1, `hsla(${hue + 10}, ${saturation + 4}%, 76%, ${alpha * 0.3})`);
        ctx.fillStyle = coreGradient;
        ctx.arc(node.x, node.y, size * 0.9, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Update node states simply
      nodesRef.current.forEach(node => {
        const decayRate = 0.992 - node.importance * 0.004;
        node.activationLevel *= decayRate;
        node.attentionScore *= 0.95;
        node.activationLevel = Math.max(0.05, Math.min(1, node.activationLevel));
        node.attentionScore = Math.max(0, Math.min(1, node.attentionScore));
      });
      
      // Generate flows less frequently for performance (disabled on mobile)
      if (!isMobile() && isInitialized.current && Math.random() < 0.4) { // Reduce frequency
        const baseRate = 0.02; // Reduced flow rate
        const activeNodes = nodesRef.current.filter(node => node.activationLevel > 0.4);
        const activityMultiplier = Math.min(2, 1 + activeNodes.length / nodesRef.current.length);
        
        // Generate fewer flows per frame
        const flowsToGenerate = Math.floor(baseRate * activityMultiplier * 3) + (Math.random() < 0.5 ? 1 : 0);
        
        for (let i = 0; i < Math.min(flowsToGenerate, 2); i++) {
          if (Math.random() < 0.6) {
            createAlgorithmicFlow();
          }
        }
      }
      
      // Occasional attention bursts (less frequent, disabled on mobile)
      if (!isMobile() && isInitialized.current && Math.sin(time * 0.2) > 0.96 && Math.random() < 0.2) {
        for (let i = 0; i < 3; i++) {
          setTimeout(() => createAlgorithmicFlow(), i * 100);
        }
      }
      
      animationIdRef.current = requestAnimationFrame(animate);
    };
    
    // Static background renderer for mobile - completely fixed appearance
    const renderStaticBackground = () => {
      try {
        if (!ctx || !canvas) {
          console.error('Canvas context not available');
          return;
        }
        
        // Clear canvas with solid background
        ctx.fillStyle = 'rgba(5, 8, 16, 1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (nodesRef.current.length === 0) {
          console.warn('No nodes available for rendering');
          return;
        }
        
        // Draw all network connections
        if (isMobile()) {
          drawUnifiedConnections();
        } else {
          drawNetworkConnections();
        }
        
        // Draw static nodes with varied appearance like desktop
        nodesRef.current.forEach((node) => {
          const size = node.baseSize * (node.z / 100); // Use original size calculation
          const baseAlpha = Math.max(0.06, node.importance * 0.2) * 0.5; // Reduced for mobile but varied
          
          // Use semantic colors like desktop
          const semanticHue = getSemanticColor(node.semanticType, node.semanticType);
          const headHue = getMultiHeadColor(node.headId);
          const hue = (semanticHue * 0.75 + headHue * 0.25);
          const saturation = 70 + node.importance * 12;
          
          // Main node with static gradient
          ctx.beginPath();
          const nodeGradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, size * 2.2);
          nodeGradient.addColorStop(0, `hsla(${hue}, ${saturation}%, 75%, ${baseAlpha})`);
          nodeGradient.addColorStop(0.5, `hsla(${hue}, ${saturation}%, 65%, ${baseAlpha * 0.5})`);
          nodeGradient.addColorStop(0.8, `hsla(${hue}, ${saturation}%, 55%, ${baseAlpha * 0.2})`);
          nodeGradient.addColorStop(1, `hsla(${hue}, ${saturation}%, 45%, 0)`);
          ctx.fillStyle = nodeGradient;
          ctx.arc(node.x, node.y, size * 2.2, 0, Math.PI * 2);
          ctx.fill();
          
          // Static core
          ctx.beginPath();
          const coreGradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, size * 0.9);
          coreGradient.addColorStop(0, `hsla(${hue}, ${saturation}%, 88%, ${baseAlpha * 0.9})`);
          coreGradient.addColorStop(0.7, `hsla(${hue}, ${saturation}%, 82%, ${baseAlpha * 0.6})`);
          coreGradient.addColorStop(1, `hsla(${hue}, ${saturation}%, 76%, ${baseAlpha * 0.3})`);
          ctx.fillStyle = coreGradient;
          ctx.arc(node.x, node.y, size * 0.9, 0, Math.PI * 2);
          ctx.fill();
        });
        
        console.log('Static background rendered with', nodesRef.current.length, 'nodes');
      } catch (error) {
        console.error('Error rendering static background:', error);
      }
    };
    
    // Unified connection drawing for mobile - simplified
    const drawUnifiedConnections = () => {
      const nodes = nodesRef.current;
      if (nodes.length === 0) return;
      
      // Basic connections (same as desktop)
      nodes.forEach((node) => {
        const maxConnections = Math.min(node.neighbors.length, 15);
        
        for (let j = 0; j < maxConnections; j++) {
          const neighbor = nodes[node.neighbors[j]];
          if (!neighbor) continue;
          
          const distance = Math.sqrt((node.x - neighbor.x) ** 2 + (node.y - neighbor.y) ** 2);
          const maxDist = Math.min(width, height) * 0.35;
          const strength = Math.max(0, 1 - distance / maxDist) * 0.12;
          
          if (strength > 0.012) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${strength})`;
            ctx.lineWidth = 0.2;
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(neighbor.x, neighbor.y);
            ctx.stroke();
          }
        }
      });
      
      // Additional layers for mobile density
      const longDistanceCount = Math.floor(nodes.length * 0.6);
      for (let i = 0; i < longDistanceCount; i++) {
        const sourceNode = nodes[(i * 7) % nodes.length];
        const targetNode = nodes[(i * 11 + 3) % nodes.length];
        
        if (sourceNode !== targetNode) {
          const distance = Math.sqrt((sourceNode.x - targetNode.x) ** 2 + (sourceNode.y - targetNode.y) ** 2);
          const screenDiagonal = Math.sqrt(width * width + height * height);
          
          if (distance > screenDiagonal * 0.3 && distance < screenDiagonal * 0.9) {
            const strength = Math.max(0, 1 - distance / screenDiagonal) * 0.022;
            
            if (strength > 0.002) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(255, 255, 255, ${strength})`;
              ctx.lineWidth = 0.2;
              ctx.moveTo(sourceNode.x, sourceNode.y);
              ctx.lineTo(targetNode.x, targetNode.y);
              ctx.stroke();
            }
          }
        }
      }
    };
    
    
    const drawAmbientConnections = () => {
      // Dense ambient particle-like connections
      const connectionSubset = Math.floor(nodesRef.current.length * 1.2);
      
      for (let i = 0; i < connectionSubset; i++) {
        const node = nodesRef.current[i];
        if (!node) continue;
        
        // More connections with uniform thickness
        const nearbyNodes = node.neighbors.slice(0, 12);
        
        nearbyNodes.forEach(neighborId => {
          const neighbor = nodesRef.current[neighborId];
          if (!neighbor) return;
          
          const distanceSq = (node.x - neighbor.x) ** 2 + (node.y - neighbor.y) ** 2;
          const distance = Math.sqrt(distanceSq); // Only calculate sqrt when needed
          const maxDist = Math.min(width, height) * 0.35;
          const strength = Math.max(0, 1 - distance / maxDist) * 0.08; // 0.05 → 0.08
          
          const isLongDistance = distance > maxDist * 0.7;
          const connectionBoost = isLongDistance ? 0.4 : 1.0;
          const finalStrength = strength * connectionBoost;
          
          if (finalStrength > 0.009) { // 0.006 → 0.009
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${finalStrength})`;
            ctx.lineWidth = 0.2; // Sharp laser-like lines
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(neighbor.x, neighbor.y);
            ctx.stroke();
          }
        });
      }
      
      // Add extra long-distance connections
      drawLongDistanceConnections();
    };
    
    
    const getAlgorithmicFlowColor = (sourceNode: AttentionNodeType, targetNode: AttentionNodeType): number => {
      const headHue = getMultiHeadColor(sourceNode.headId);
      const semanticHue = getSemanticColor(sourceNode.semanticType, targetNode.semanticType);
      
      return headHue * 0.6 + semanticHue * 0.4;
    };
    
    
    
    
    
    
    
    
    
    const drawLongDistanceConnections = () => {
      // Enhanced long-distance neural connections for Transformer-like global attention
      const longDistanceConnections = Math.floor(nodesRef.current.length * 0.6); // 0.3 → 0.6
      
      for (let i = 0; i < longDistanceConnections; i++) {
        const sourceNode = nodesRef.current[Math.floor(Math.random() * nodesRef.current.length)];
        if (!sourceNode) continue;
        
        // Find distant nodes for sophisticated neural patterns
        const distantNodes = nodesRef.current.filter(node => {
          if (node.id === sourceNode.id) return false;
          const distance = Math.sqrt((sourceNode.x - node.x) ** 2 + (sourceNode.y - node.y) ** 2);
          const minDistance = Math.min(width, height) * 0.25;
          const maxDistance = Math.min(width, height) * 0.8;
          return distance > minDistance && distance < maxDistance;
        });
        
        if (distantNodes.length > 0) {
          const targetNode = distantNodes[Math.floor(Math.random() * distantNodes.length)];
          const distance = Math.sqrt((sourceNode.x - targetNode.x) ** 2 + (sourceNode.y - targetNode.y) ** 2);
          const maxDist = Math.min(width, height) * 0.8;
          const strength = Math.max(0, 1 - distance / maxDist) * 0.035; // 0.025 → 0.035
          
          if (strength > 0.004) { // 0.003 → 0.004
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${strength})`;
            ctx.lineWidth = 0.2; // Sharp laser-like lines
            ctx.moveTo(sourceNode.x, sourceNode.y);
            ctx.lineTo(targetNode.x, targetNode.y);
            ctx.stroke();
          }
        }
      }
    };
    
    const drawLongRangeConnections = () => {
      // Enhanced long-range connections for Transformer-like global attention
      const longRangeCount = Math.floor(nodesRef.current.length * 0.35); // 0.2 → 0.35
      
      for (let i = 0; i < longRangeCount; i++) {
        const sourceIndex = Math.floor(Math.random() * nodesRef.current.length);
        const targetIndex = Math.floor(Math.random() * nodesRef.current.length);
        
        if (sourceIndex === targetIndex) continue;
        
        const sourceNode = nodesRef.current[sourceIndex];
        const targetNode = nodesRef.current[targetIndex];
        
        if (!sourceNode || !targetNode) continue;
        
        const distance = Math.sqrt((sourceNode.x - targetNode.x) ** 2 + (sourceNode.y - targetNode.y) ** 2);
        const screenDiagonal = Math.sqrt(width * width + height * height);
        
        // Sophisticated long-range connections for global attention
        if (distance > screenDiagonal * 0.3 && distance < screenDiagonal * 0.9) {
          const strength = Math.max(0, 1 - distance / screenDiagonal) * 0.022; // 0.015 → 0.022
          
          if (strength > 0.002) { // 0.0015 → 0.002
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${strength})`;
            ctx.lineWidth = 0.2; // Sharp laser-like lines
            ctx.moveTo(sourceNode.x, sourceNode.y);
            ctx.lineTo(targetNode.x, targetNode.y);
            ctx.stroke();
          }
        }
      }
    };
    
    const drawParticleBackground = () => {
      // Enhanced particle background for maximum elegance
      const particleCount = Math.floor(nodesRef.current.length * 0.4);
      
      for (let i = 0; i < particleCount; i++) {
        const sourceNode = nodesRef.current[Math.floor(Math.random() * nodesRef.current.length)];
        if (!sourceNode) continue;
        
        // Create particle-like connections to random nearby points
        const angle = Math.random() * Math.PI * 2;
        const distance = 20 + Math.random() * 80;
        const targetX = sourceNode.x + Math.cos(angle) * distance;
        const targetY = sourceNode.y + Math.sin(angle) * distance;
        
        // Check if target is within screen bounds
        if (targetX > 0 && targetX < width && targetY > 0 && targetY < height) {
          const strength = 0.015 + Math.random() * 0.025; // 0.01-0.03 → 0.015-0.04
          
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${strength})`;
          ctx.lineWidth = 0.2; // Sharp laser-like lines
          ctx.moveTo(sourceNode.x, sourceNode.y);
          ctx.lineTo(targetX, targetY);
          ctx.stroke();
        }
      }
    };
    
    const resizeCanvas = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      
      // Only resize if dimensions actually changed (prevents scroll-triggered resizes)
      if (newWidth !== width || newHeight !== height) {
        width = canvas.width = newWidth;
        height = canvas.height = newHeight;
        updateMobileStatus();
        
        // For mobile, only redraw if nodes exist
        if (isMobile() && nodesRef.current.length > 0) {
          renderStaticBackground();
        }
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Initialize animation - different approach for mobile vs desktop
    const startVisualization = async () => {
      try {
        await initAttentionField();
        
        // Force a small delay to ensure everything is ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (isMobile()) {
          // Mobile: Create static display only, no animation loop
          renderStaticBackground();
          console.log('Mobile static background rendered');
        } else {
          // Desktop: Full animation - ensure fresh start
          if (animationIdRef.current) {
            cancelAnimationFrame(animationIdRef.current);
            animationIdRef.current = null;
          }
          animate();
        }
      } catch (error) {
        console.error('Visualization initialization failed:', error);
      }
    };
    
    startVisualization();
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', resizeCanvas);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ 
        background: 'linear-gradient(135deg, #050810 0%, #0f1419 30%, #1a1f2e 50%, #0f1419 70%, #050810 100%)',
        width: '100vw',
        height: '100vh',
        left: '0',
        top: '0',
        display: 'block'
      }}
    />
  );
};

export default function HomePage() {
  // ビルド時に生成された静的データを使用
  const articles = articlesData.latestByCategory as Article[];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Transformer Attention Field Canvas Background */}
        <TransformerAttentionField />
        
        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex-1 flex flex-col justify-center">
          <div className="mb-12">
            <h1 className="text-6xl lg:text-8xl font-bold text-white mb-8 tracking-tight leading-tight">
              {/* デスクトップ用（2行表示） */}
              <div className="hidden lg:block">
                <span className="block">Algorithm + Vision</span>
                <span className="block">= <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">Algion</span></span>
              </div>
              
              {/* モバイル用（3行表示） */}
              <div className="block lg:hidden">
                <span className="block">Algorithm</span>
                <span className="block">+ Vision</span>
                <span className="block">= <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">Algion</span></span>
              </div>
            </h1>
            <p className="text-xl lg:text-3xl text-white mb-12 max-w-5xl mx-auto font-light leading-relaxed">
              データとアルゴリズムで人々のビジョンを実現する
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                href="/services"
                className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-elegant-hover hover:-translate-y-1 transition-all duration-300 group min-w-[220px]"
              >
                <span className="mr-2">サービスを見る</span>
                <ChevronRight className="inline-block w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 min-w-[220px]"
              >
                お問い合わせ
              </Link>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="relative z-10 pb-8 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-elegant">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Eye className="text-blue-600" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Vision</h3>
              </div>
              <p className="text-gray-900 text-lg">人々の可能性を最大限に引き出す</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-elegant">
              <div className="flex items-center mb-6">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <Target className="text-green-600" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Mission</h3>
              </div>
              <p className="text-gray-900 text-lg">テクノロジーを価値に変え、人々の創造と成長を加速させる</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Summary */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              主要サービス
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              法人向けAIソリューション、AIコンサルティング、SaaSプロダクトを提供
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-50 p-8 rounded-2xl shadow-elegant">
              <div className="bg-blue-100 p-3 rounded-full w-fit mb-6">
                <Zap className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">法人向けAIソリューション</h3>
              <p className="text-gray-700">
                生成AI導入基盤、AIナレッジ検索、業務自動化AIエージェントなど、企業の課題に応じたAIソリューションを提供します。
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl shadow-elegant">
              <div className="bg-green-100 p-3 rounded-full w-fit mb-6">
                <Users className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">AIコンサルティング</h3>
              <p className="text-gray-700">
                AI戦略策定、データ戦略、教育支援、研究開発パートナーとして、AI導入から運用まで一貫して支援します。
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl shadow-elegant">
              <div className="bg-purple-100 p-3 rounded-full w-fit mb-6">
                <Globe className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">SaaSプロダクト</h3>
              <p className="text-gray-700">
                生成AIマネージドプラットフォーム、MLOpsサポートなど、クラウド型AIインフラを提供します。
              </p>
            </div>
          </div>
          
          <div className="flex justify-center mt-16">
            <Link 
              href="/services"
              className="inline-flex items-center bg-black text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-800 hover:-translate-y-1 transition-all duration-300 group"
            >
              <span className="mr-2">サービス一覧を見る</span>
              <ArrowRight className="inline-block w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* Media Summary */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              メディア
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              AI導入事例、技術解説、最新ニュースを発信しています
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {articles.map((article) => (
              <Link 
                key={article.id}
                href={`/media/${article.slug}`}
                className="bg-white p-6 rounded-2xl shadow-elegant hover:shadow-elegant-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col group"
              >
                <div className="mb-4">
                  <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    {article.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-black mb-3 line-clamp-2 flex-1 group-hover:text-gray-700 transition-colors">
                  {article.title}
                </h3>
                <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
                  <span>{article.date}</span>
                  <ArrowRight size={16} className="text-gray-400 group-hover:text-black transition-colors" />
                </div>
              </Link>
            ))}
          </div>
          
          <div className="flex justify-center mt-16">
            <Link 
              href="/media"
              className="inline-flex items-center bg-black text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-800 hover:-translate-y-1 transition-all duration-300 group"
            >
              <span className="mr-2">メディアを見る</span>
              <ArrowRight className="inline-block w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Contact Section */}
      <section className="py-24 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              AIで新しい価値を創造しませんか？
            </h2>
            <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
              Algionのサービスに関するご質問や導入のご相談は、<br />お気軽にお問い合わせください。
            </p>
            <Link 
              href="/contact"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-elegant-hover hover:-translate-y-1 transition-all duration-300 group"
            >
              <Mail className="inline-block w-5 h-5 mr-2" />
              <span className="mr-2">お問い合わせ</span>
              <ArrowRight className="inline-block w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}