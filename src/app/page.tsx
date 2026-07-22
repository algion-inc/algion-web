"use client";

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  AudioLines,
  Boxes,
  Building2,
  CheckCircle2,
  Cloud,
  Code2,
  Gauge,
  Handshake,
  ImageIcon,
  Mail,
  RefreshCcw,
  Search,
  Workflow,
} from 'lucide-react';
import articlesData from '../data/articles.json';

interface Article {
  id: number;
  title: string;
  category: "導入事例" | "技術解説" | "お知らせ";
  date: string;
  slug: string;
  excerpt: string;
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
  const isInViewport = useRef<boolean>(true);
  const neighborCache = useRef<Map<number, number[]>>(new Map());
  const isInitialized = useRef<boolean>(false);
  const animationStartTime = useRef<number>(Date.now());
  const pausedTime = useRef<number>(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Sharp rendering settings for crisp laser-like lines
    ctx.imageSmoothingEnabled = false;
    
    let width: number, height: number;
    
    // Performance monitoring - define early
    let isMobileDevice = false;
    const updateMobileStatus = () => {
      isMobileDevice = width < 768;
    };
    const isMobile = () => isMobileDevice;
    const shouldRenderStatic = () => isMobile() || prefersReducedMotion;
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
      } else if (isVisible.current && isInViewport.current && !animationIdRef.current && wasVisible !== isVisible.current && !shouldRenderStatic()) {
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
      
      if (shouldRenderStatic()) {
        // Static variants create all nodes at once.
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
        let x: number, y: number;
        
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
            
            // Default values in case placement fails
            x = Math.random() * width;
            y = Math.random() * height;
            
            while (!placed && attempts < 15) {
              const tempX = Math.random() * width;
              const tempY = Math.random() * height;
              
              let validPosition = true;
              for (const node of nodesRef.current) {
                if ((tempX - node.x) ** 2 + (tempY - node.y) ** 2 < minDistance ** 2) {
                  validPosition = false;
                  break;
                }
              }
              
              if (validPosition) {
                x = tempX;
                y = tempY;
                placed = true;
              }
              attempts++;
            }
          }
        }
        
        nodesRef.current.push(createAttentionNode(i, x, y, types));
      }
      
      buildOptimizedNeighborhoods();
    };
    
    const progressivelyAddNodes = async (remainingCount: number) => {
      if (shouldRenderStatic()) {
        // Static variants already created all nodes in the initial batch.
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
      
      // Stop scheduling frames while the tab or hero is not visible.
      if (!isVisible.current || !isInViewport.current) {
        animationIdRef.current = null;
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
      
      // Initialize width/height if not set
      if (!width || !height) {
        width = canvas.width = newWidth;
        height = canvas.height = newHeight;
        updateMobileStatus();
        return;
      }
      
      // Only resize if dimensions actually changed significantly (prevents scroll-triggered resizes)
      if (Math.abs(newWidth - width) > 10 || Math.abs(newHeight - height) > 10) {
        width = canvas.width = newWidth;
        height = canvas.height = newHeight;
        updateMobileStatus();
        
        // For mobile, only redraw if nodes exist but avoid frequent redrawing
        if (shouldRenderStatic() && nodesRef.current.length > 0) {
          // Use a timeout to debounce rapid resize events
          setTimeout(() => {
            if (canvas && ctx) {
              renderStaticBackground();
            }
          }, 100);
        }
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      const nextInViewport = entry.isIntersecting;
      if (nextInViewport === isInViewport.current) return;

      isInViewport.current = nextInViewport;
      if (!nextInViewport && animationIdRef.current) {
        pausedTime.current += Date.now() - animationStartTime.current;
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      } else if (nextInViewport && isVisible.current && !shouldRenderStatic() && isInitialized.current && !animationIdRef.current) {
        animationStartTime.current = Date.now();
        animate();
      }
    }, { threshold: 0.01 });

    intersectionObserver.observe(canvas);
    
    // Initialize animation - different approach for mobile vs desktop
    const startVisualization = async () => {
      try {
        await initAttentionField();
        
        // Force a small delay to ensure everything is ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (shouldRenderStatic()) {
          // Mobile and reduced-motion variants use a fixed display.
          renderStaticBackground();
        } else {
          // Desktop: Full animation - ensure fresh start
          if (animationIdRef.current) {
            cancelAnimationFrame(animationIdRef.current);
            animationIdRef.current = null;
          }
          if (isVisible.current && isInViewport.current) animate();
        }
      } catch (error) {
        console.error('Visualization initialization failed:', error);
      }
    };
    
    startVisualization();
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', resizeCanvas);
      intersectionObserver.disconnect();
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
        left: '50%',
        transform: 'translateX(-50%)'
      }}
    />
  );
};

export default function HomePage() {
  const articles = (articlesData.articles as Article[]).slice(0, 3);

  const consultationPoints = [
    {
      icon: Search,
      title: 'AIを使う場所が決まっていない',
      text: '業務課題はあるものの、AIが有効な場所や、人が判断すべき範囲を整理できていない段階。',
    },
    {
      icon: Workflow,
      title: '要件や評価方法が決まっていない',
      text: '構想はあるものの、何をもって成功とするか、どこまで試すかが定まっていない段階。',
    },
    {
      icon: RefreshCcw,
      title: 'PoCから本番へ進めない',
      text: '試作は動いたものの、品質、コスト、運用、既存システムとの接続に課題が残る段階。',
    },
  ];

  const approaches = [
    {
      icon: Workflow,
      title: '業務からAIの役割を決める',
      text: '業務上の判断、例外、責任範囲を整理し、AI、固定ルール、既存システム、人の役割を分けて設計します。',
    },
    {
      icon: Gauge,
      title: '「動く」から「使える」まで検証する',
      text: '精度だけでなく、速度、コスト、安定性、体験、安全性まで、実際の利用条件に近い形で確かめます。',
    },
    {
      icon: RefreshCcw,
      title: '評価と改善を運用に組み込む',
      text: '失敗ケースを評価資産として残し、ログ、監視、回帰評価、更新、切り戻しまで改善できる形を作ります。',
    },
  ];

  const capabilities = [
    { icon: Boxes, text: '生成AI・LLM・RAG・AIエージェント' },
    { icon: ImageIcon, text: '画像認識・音声処理・マルチモーダルAI' },
    { icon: AudioLines, text: '予測・最適化・データ分析' },
    { icon: Cloud, text: 'API・DB・クラウド・評価基盤' },
  ];

  const services = [
    { title: '業務・AI設計', text: 'AIを使う場所と使わない場所を整理し、評価方法とPoC計画を作ります。' },
    { title: 'PoC開発・評価', text: '動く試作と評価セットを作り、技術・業務の成立性を確かめます。' },
    { title: '本開発・運用設計', text: '既存システムへの組み込みから、ログ・監視・安全性・運用まで設計します。' },
    { title: '技術顧問・継続改善', text: '設計・コードレビュー、回帰評価、品質・コスト改善を継続的に支援します。' },
  ];

  const process = [
    { step: '01', title: '無料相談', text: '内容を確認し、必要に応じて30分ほどオンラインでお話しします。' },
    { step: '02', title: '業務・AI設計', text: '業務、データ、制約を整理し、AIの役割と評価方法を決めます。' },
    { step: '03', title: 'PoC開発・評価', text: '試作と評価セットを作り、品質、速度、コスト、安定性を確認します。' },
    { step: '04', title: '本開発・継続改善', text: '効果を確認できたものを本開発へ進め、運用後も改善できる形にします。' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="relative flex min-h-[78svh] items-center overflow-hidden lg:min-h-[82svh]">
        <TransformerAttentionField />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="mb-6 text-sm font-semibold text-cyan-300 sm:text-base">Algorithm + Vision = Algion</p>
            <h1 className="text-4xl font-bold leading-[1.25] text-white sm:text-5xl lg:text-6xl">
              構想段階のAIを、<br className="hidden sm:block" />現場で使える仕組みへ。
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-relaxed text-white/75 sm:text-xl">
              構想整理から、短期の技術検証、評価設計、本番実装、運用改善まで。機械学習とソフトウェア開発の両面から、AIを現場で使い続けられる仕組みへつなげます。
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-3 font-semibold text-white transition-transform hover:-translate-y-0.5">
                無料相談を申し込む <ArrowRight className="ml-2" size={18} />
              </Link>
              <Link href="/services" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 bg-white/10 px-7 py-3 font-semibold text-white backdrop-blur-sm hover:bg-white/15">
                サービスと目安料金を見る
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-blue-700">STARTING POINT</p>
            <h2 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">こんな段階からご相談いただけます</h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {consultationPoints.map(({ icon: Icon, title, text }) => (
              <div key={title} className="border-t border-gray-300 pt-6">
                <Icon className="text-blue-600" size={26} />
                <h3 className="mt-5 text-xl font-bold text-gray-950">{title}</h3>
                <p className="mt-3 leading-relaxed text-gray-600">{text}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 border-l-2 border-cyan-500 pl-5 text-gray-700">
            特定の業界に限定せず、業務課題とデータ、利用条件に応じて最適な構成を設計します。
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-blue-700">APPROACH</p>
            <h2 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">AIを、現場で使える価値へ</h2>
            <p className="mt-5 text-lg leading-relaxed text-gray-600">
              技術ありきで構成を決めず、業務と制約からAIの役割を設計します。AIを使わない方がよい部分はシンプルに保ちます。
            </p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {approaches.map(({ icon: Icon, title, text }, index) => (
              <article key={title} className="rounded-lg border border-gray-200 bg-white p-7 shadow-sm">
                <div className="flex items-center justify-between">
                  <Icon className="text-blue-600" size={28} />
                  <span className="text-sm font-semibold text-gray-400">0{index + 1}</span>
                </div>
                <h3 className="mt-8 text-xl font-bold text-gray-950">{title}</h3>
                <p className="mt-4 leading-relaxed text-gray-600">{text}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 border-y border-gray-200 py-7">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {capabilities.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3 text-sm font-semibold text-gray-700">
                  <Icon className="mt-0.5 shrink-0 text-cyan-600" size={18} />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-7 border-l-2 border-blue-600 pl-6 md:grid-cols-[1.1fr_1fr] md:items-center md:pl-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-950">AIとソフトウェアを、ひとつの設計として扱う</h3>
              <p className="mt-4 leading-relaxed text-gray-600">
                AIプロダクトとソフトウェア開発の経験を背景に、業務整理、技術判断、評価、本番実装を分断せずに進めます。
              </p>
            </div>
            <div className="grid gap-3 text-sm font-semibold text-gray-800 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
              {['AI Strategy', 'Machine Learning × Software Engineering', 'PoC → Production'].map((item) => (
                <div key={item} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 shrink-0 text-blue-600" size={17} />{item}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-blue-700">SERVICES</p>
            <h2 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">ご支援できること</h2>
            <p className="mt-5 text-lg text-gray-600">初回相談は無料です。構想整理、PoC、評価、本開発、継続改善まで、必要な段階からご依頼いただけます。</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="rounded-lg bg-gray-950 p-7 text-white">
              <Building2 className="text-cyan-400" size={27} />
              <h3 className="mt-5 text-xl font-bold">事業会社のAI・DX・プロダクトチーム</h3>
              <p className="mt-3 leading-relaxed text-white/65">業務と技術をつなぐシニア人材が不足し、構想、PoC、本番化のどこかで前進しづらいチーム。</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-7">
              <Handshake className="text-blue-600" size={27} />
              <h3 className="mt-5 text-xl font-bold text-gray-950">AI企業・SIer・コンサルティング会社</h3>
              <p className="mt-3 leading-relaxed text-gray-600">AI評価、機械学習、ソフトウェア実装を任せられる外部開発パートナーを探しているチーム。</p>
            </div>
          </div>
          <div className="mt-10 grid gap-x-8 gap-y-2 md:grid-cols-2">
            {services.map((service) => (
              <div key={service.title} className="grid grid-cols-[auto_1fr] gap-4 border-b border-gray-200 py-6">
                <Code2 className="mt-1 text-blue-600" size={21} />
                <div><h3 className="text-lg font-bold text-gray-950">{service.title}</h3><p className="mt-2 text-gray-600">{service.text}</p></div>
              </div>
            ))}
          </div>
          <Link href="/services" className="mt-9 inline-flex items-center rounded-full bg-black px-7 py-3 font-semibold text-white hover:bg-gray-800">
            料金の詳細を見る <ArrowRight className="ml-2" size={18} />
          </Link>
        </div>
      </section>

      <section className="bg-gray-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-blue-700">PROCESS</p>
          <h2 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">ご依頼の流れ</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {process.map((item) => (
              <div key={item.step} className="border-t-2 border-blue-600 pt-5">
                <span className="text-sm font-bold text-blue-600">{item.step}</span>
                <h3 className="mt-3 text-xl font-bold text-gray-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold text-blue-700">FOUNDER</p>
            <div className="mt-5 grid gap-6 sm:grid-cols-[150px_1fr] lg:grid-cols-1">
              <Image src="/hideaki-okamoto-profile.jpg" alt="Algion株式会社 代表取締役CEO 岡本秀明" width={320} height={427} className="aspect-[3/4] w-full max-w-[280px] rounded-lg object-cover" />
              <div>
                <h2 className="text-3xl font-bold text-gray-950">岡本 秀明 / Hideaki Okamoto</h2>
                <p className="mt-2 font-semibold text-gray-800">代表取締役CEO / AI &amp; Software Engineer</p>
                <p className="mt-5 leading-relaxed text-gray-600">
                  ソフトバンクで機械学習エンジニアとしてAIプロダクトの研究開発と実装に携わり、高市場価値AI人材に認定。PayPayではFDE / Senior Software Engineerとして、AIエージェントの開発を主導しています。2025年にAlgion株式会社を設立し、代表取締役CEOとして、AI活用の構想整理から技術検証、本番実装、運用改善までを一貫して支援しています。
                </p>
                <Link href="/about" className="mt-6 inline-flex items-center font-semibold text-blue-700 hover:text-blue-900">代表プロフィールの詳細 <ArrowRight className="ml-2" size={17} /></Link>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-end justify-between gap-4">
              <div><p className="text-sm font-semibold text-blue-700">MEDIA</p><h2 className="mt-3 text-3xl font-bold text-gray-950">技術発信</h2></div>
              <Link href="/media" className="hidden items-center text-sm font-semibold text-gray-700 sm:inline-flex">一覧を見る <ArrowRight className="ml-2" size={16} /></Link>
            </div>
            <div className="mt-7 divide-y divide-gray-200 border-y border-gray-200">
              {articles.map((article) => (
                <Link key={article.id} href={`/media/${article.slug}`} className="group grid gap-2 py-6 sm:grid-cols-[110px_1fr_auto] sm:items-center sm:gap-5">
                  <span className="text-xs font-semibold text-blue-700">{article.category}</span>
                  <div><h3 className="font-bold text-gray-950 group-hover:text-blue-700">{article.title}</h3><p className="mt-1 line-clamp-1 text-sm text-gray-500">{article.excerpt}</p></div>
                  <ArrowRight className="hidden text-gray-400 sm:block" size={18} />
                </Link>
              ))}
            </div>
            <Link href="/media" className="mt-6 inline-flex items-center text-sm font-semibold text-gray-700 sm:hidden">一覧を見る <ArrowRight className="ml-2" size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="bg-black py-20 text-white sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Mail className="mx-auto text-cyan-400" size={30} />
          <h2 className="mt-6 text-3xl font-bold sm:text-4xl">まだ、AIを使うべきか決まっていなくても構いません。</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/65">業務と制約を整理し、どこから着手し、どう本番へつなげるかを一緒に考えます。</p>
          <Link href="/contact" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 py-3 font-semibold text-black hover:bg-cyan-50">
            無料相談を申し込む <ArrowRight className="ml-2" size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
