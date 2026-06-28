"use client";

import type { ReactNode } from "react";

import { AppLegalFooter } from "@/components/layout/app-legal-footer";
import { AppTopNav } from "@/components/layout/app-top-nav";

export default function UserLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
            <AppTopNav />
            <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="min-h-full">{children}</div>
                <AppLegalFooter />
            </div>
        </div>
    );
}
