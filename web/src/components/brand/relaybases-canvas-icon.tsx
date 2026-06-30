"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

type RelayBasesCanvasIconProps = {
    className?: string;
};

export function RelayBasesCanvasIcon({ className }: RelayBasesCanvasIconProps) {
    const id = useId().replace(/:/g, "");
    const baseGradientId = `${id}-base`;
    const flowGradientId = `${id}-flow`;
    const glowGradientId = `${id}-glow`;

    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={cn("shrink-0 drop-shadow-[0_8px_16px_rgba(47,125,225,0.22)]", className)}>
            <defs>
                <linearGradient id={baseGradientId} x1="4" x2="21" y1="3" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#18181B" />
                    <stop offset="0.5" stopColor="#0F1115" />
                    <stop offset="1" stopColor="#050507" />
                </linearGradient>
                <linearGradient id={flowGradientId} x1="5.5" x2="18.6" y1="6" y2="18.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#2F7DE1" />
                    <stop offset="0.5" stopColor="#7547D1" />
                    <stop offset="1" stopColor="#E94C89" />
                </linearGradient>
                <radialGradient id={glowGradientId} cx="0" cy="0" r="1" gradientTransform="matrix(13.5 0 0 13.5 10 7.5)" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" stopOpacity="0.18" />
                    <stop offset="0.58" stopColor="#2F7DE1" stopOpacity="0.08" />
                    <stop offset="1" stopColor="#E94C89" stopOpacity="0" />
                </radialGradient>
            </defs>
            <rect x="2.35" y="2.35" width="19.3" height="19.3" rx="7" fill={`url(#${baseGradientId})`} />
            <rect x="2.85" y="2.85" width="18.3" height="18.3" rx="6.45" stroke="rgba(255,255,255,0.18)" strokeWidth="0.9" />
            <rect x="3.5" y="3.5" width="17" height="17" rx="5.9" fill={`url(#${glowGradientId})`} />
            <path
                d="M6.05 12.05c0-3.58 2.58-6.12 5.94-6.12 3.22 0 5.78 2.32 5.78 5.27 0 3.42-2.5 5.86-5.95 5.86-2.48 0-4.14-1.2-4.14-2.95 0-2.07 1.86-3.05 4.65-3.05 2.9 0 4.78-1.02 4.78-2.57"
                stroke="rgba(255,255,255,0.26)"
                strokeWidth="2.45"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M6.05 12.05c0-3.58 2.58-6.12 5.94-6.12 3.22 0 5.78 2.32 5.78 5.27 0 3.42-2.5 5.86-5.95 5.86-2.48 0-4.14-1.2-4.14-2.95 0-2.07 1.86-3.05 4.65-3.05 2.9 0 4.78-1.02 4.78-2.57"
                stroke={`url(#${flowGradientId})`}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="7.2 7.6 5.4 8.2"
            >
                <animate attributeName="stroke-dashoffset" from="0" to="-28.4" dur="5.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.95;0.68;0.95" dur="4.2s" repeatCount="indefinite" />
            </path>
            <path d="M7.05 7.35l1-.4.4-1 .4 1 1 .4-1 .4-.4 1-.4-1-1-.4Z" fill="rgba(255,255,255,0.92)">
                <animate attributeName="opacity" values="0.95;0.45;0.95" dur="3.6s" repeatCount="indefinite" />
            </path>
            <circle cx="12" cy="12" r="0.95" fill="white">
                <animate attributeName="r" values="0.82;1.08;0.82" dur="3.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.92;0.65;0.92" dur="3.2s" repeatCount="indefinite" />
            </circle>
        </svg>
    );
}
