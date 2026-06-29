"use client";

import { useEffect, useRef } from "react";

import { getCloudSyncApiKey } from "@/services/cloud-sync";
import { syncAppDataToCloud } from "@/services/app-sync";
import { useConfigStore } from "@/stores/use-config-store";

const INITIAL_AUTO_SYNC_DELAY_MS = 6000;
const AUTO_SYNC_INTERVAL_MS = 5 * 60 * 1000;

export function CloudSyncAutoRunner() {
    const syncingRef = useRef(false);
    const config = useConfigStore((state) => state.config);
    const cloudSync = useConfigStore((state) => state.cloudSync);
    const updateCloudSyncConfig = useConfigStore((state) => state.updateCloudSyncConfig);
    const apiKey = getCloudSyncApiKey(config.mediaApiKey, config.textApiKey);

    useEffect(() => {
        if (!cloudSync.enabled || !apiKey) return;

        const run = async () => {
            if (syncingRef.current) return;
            syncingRef.current = true;
            try {
                const result = await syncAppDataToCloud(apiKey);
                updateCloudSyncConfig("lastSyncedAt", result.syncedAt);
                updateCloudSyncConfig("lastError", "");
            } catch (error) {
                updateCloudSyncConfig("lastError", error instanceof Error ? error.message : "RelayBases 云同步失败");
            } finally {
                syncingRef.current = false;
            }
        };

        const timer = window.setTimeout(() => void run(), INITIAL_AUTO_SYNC_DELAY_MS);
        const interval = window.setInterval(() => void run(), AUTO_SYNC_INTERVAL_MS);
        return () => {
            window.clearTimeout(timer);
            window.clearInterval(interval);
        };
    }, [apiKey, cloudSync.enabled, updateCloudSyncConfig]);

    return null;
}
