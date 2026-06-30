"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

type RelayBasesCanvasIconProps = {
    className?: string;
};

export function RelayBasesCanvasIcon({ className }: RelayBasesCanvasIconProps) {
    const id = useId().replace(/:/g, "");
    const baseGradientId = `${id}-base`;
    const rimGradientId = `${id}-rim`;
    const flowGradientId = `${id}-flow`;
    const glowGradientId = `${id}-glow`;
    const shineGradientId = `${id}-shine`;

    return (
        <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={cn("shrink-0 drop-shadow-[0_10px_22px_rgba(47,125,225,0.24)]", className)}>
            <defs>
                <linearGradient id={baseGradientId} x1="4" x2="28" y1="3" y2="30" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#1D1E23" />
                    <stop offset="0.48" stopColor="#0F1117" />
                    <stop offset="1" stopColor="#050507" />
                </linearGradient>
                <linearGradient id={rimGradientId} x1="5" x2="28" y1="3" y2="28" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" stopOpacity="0.42" />
                    <stop offset="0.38" stopColor="#2F7DE1" stopOpacity="0.32" />
                    <stop offset="0.68" stopColor="#7547D1" stopOpacity="0.34" />
                    <stop offset="1" stopColor="#E94C89" stopOpacity="0.42" />
                </linearGradient>
                <linearGradient id={flowGradientId} x1="7" x2="25" y1="8" y2="25" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#2F7DE1" />
                    <stop offset="0.5" stopColor="#7547D1" />
                    <stop offset="1" stopColor="#E94C89" />
                </linearGradient>
                <radialGradient id={glowGradientId} cx="0" cy="0" r="1" gradientTransform="matrix(18 0 0 18 12.6 9.2)" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" stopOpacity="0.2" />
                    <stop offset="0.5" stopColor="#2F7DE1" stopOpacity="0.1" />
                    <stop offset="1" stopColor="#E94C89" stopOpacity="0" />
                </radialGradient>
                <linearGradient id={shineGradientId} x1="8" x2="24" y1="5" y2="23" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" stopOpacity="0.34" />
                    <stop offset="0.42" stopColor="white" stopOpacity="0.08" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                </linearGradient>
            </defs>
            <rect x="2.25" y="2.25" width="27.5" height="27.5" rx="9.25" fill={`url(#${baseGradientId})`} />
            <rect x="2.8" y="2.8" width="26.4" height="26.4" rx="8.7" stroke={`url(#${rimGradientId})`} strokeWidth="1.1" />
            <rect x="4" y="4" width="24" height="24" rx="7.8" fill={`url(#${glowGradientId})`} />
            <path d="M7.8 8.8c3.6-3.1 11.4-3.2 15.6-.3" stroke={`url(#${shineGradientId})`} strokeWidth="1.15" strokeLinecap="round" opacity="0.8" />
            <path
                d="M7.6 16.25c0-4.78 3.42-8.18 8.2-8.18 4.42 0 7.92 3.12 7.92 7.1 0 4.58-3.42 7.86-8.14 7.86-3.42 0-5.72-1.64-5.72-4.02 0-2.82 2.54-4.14 6.44-4.14 4.02 0 6.56-1.4 6.56-3.52"
                stroke="rgba(255,255,255,0.28)"
                strokeWidth="3.05"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M7.6 16.25c0-4.78 3.42-8.18 8.2-8.18 4.42 0 7.92 3.12 7.92 7.1 0 4.58-3.42 7.86-8.14 7.86-3.42 0-5.72-1.64-5.72-4.02 0-2.82 2.54-4.14 6.44-4.14 4.02 0 6.56-1.4 6.56-3.52"
                stroke={`url(#${flowGradientId})`}
                strokeWidth="2.45"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="9.6 10.4 7.2 11.2"
            >
                <animate attributeName="stroke-dashoffset" from="0" to="-38.4" dur="5.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.95;0.68;0.95" dur="4.2s" repeatCount="indefinite" />
            </path>
            <path d="M8.7 9.55l1.15-.46.46-1.15.46 1.15 1.15.46-1.15.46-.46 1.15-.46-1.15-1.15-.46Z" fill="rgba(255,255,255,0.94)">
                <animate attributeName="opacity" values="0.95;0.45;0.95" dur="3.6s" repeatCount="indefinite" />
            </path>
            <circle cx="16" cy="16" r="1.15" fill="white">
                <animate attributeName="r" values="1;1.28;1" dur="3.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.92;0.65;0.92" dur="3.2s" repeatCount="indefinite" />
            </circle>
        </svg>
    );
}
