"use client";

import type { RemoteSyncStorage } from "@/services/app-sync";

const CLOUD_SYNC_BASE_URL = "https://relaybases.com/api/canvas-sync";
const CLOUD_SYNC_TIMEOUT_MS = 120000;
const SESSION_REFRESH_SKEW_MS = 5 * 60 * 1000;

type CloudSyncSession = {
    token: string;
    expiresAt: string;
};

let cachedSession: CloudSyncSession | null = null;

export function hasCloudSyncKey(mediaApiKey: string, textApiKey: string) {
    return Boolean(getCloudSyncApiKey(mediaApiKey, textApiKey));
}

export function getCloudSyncApiKey(mediaApiKey: string, textApiKey: string) {
    return mediaApiKey.trim() || textApiKey.trim();
}

export function createRelayBasesCloudSyncStorage(apiKey: string): RemoteSyncStorage {
    const normalizedApiKey = apiKey.trim();
    if (!normalizedApiKey) throw new Error("请先填写媒体 API Key 或文本 API Key");

    return {
        readFile: async (path) => {
            const response = await cloudSyncFetch(normalizedApiKey, path, { method: "GET" });
            if (response.status === 404) return null;
            if (!response.ok) await throwCloudSyncError(response, "读取云端同步文件失败");
            const file = await withTimeout(response.blob(), "读取云端同步文件超时");
            return file.size ? file : null;
        },
        writeFile: async (path, file, contentType = "application/octet-stream") => {
            if (!file.size) throw new Error("上传文件为空，已取消上传");
            const response = await cloudSyncFetch(normalizedApiKey, path, {
                method: "PUT",
                headers: { "Content-Type": contentType },
                body: file,
            });
            if (!response.ok) await throwCloudSyncError(response, "上传云端同步文件失败");
        },
    };
}

async function cloudSyncFetch(apiKey: string, path: string, init: RequestInit) {
    const session = await getCloudSyncSession(apiKey);
    const headers = new Headers(init.headers);
    headers.set("Authorization", `Bearer ${session.token}`);
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), CLOUD_SYNC_TIMEOUT_MS);
    try {
        return await fetch(`${CLOUD_SYNC_BASE_URL}/file?path=${encodeURIComponent(path)}`, {
            ...init,
            headers,
            signal: controller.signal,
        });
    } catch (error) {
        if (error instanceof Error && error.name === "AbortError") throw new Error("云同步请求超时，请稍后重试");
        if (error instanceof TypeError) throw new Error("无法连接 RelayBases 云同步，请检查网络状态");
        throw error;
    } finally {
        window.clearTimeout(timer);
    }
}

async function getCloudSyncSession(apiKey: string) {
    if (cachedSession && Date.parse(cachedSession.expiresAt) - Date.now() > SESSION_REFRESH_SKEW_MS) return cachedSession;
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), CLOUD_SYNC_TIMEOUT_MS);
    try {
        const response = await fetch(`${CLOUD_SYNC_BASE_URL}/session`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: "{}",
            signal: controller.signal,
        });
        if (!response.ok) await throwCloudSyncError(response, "创建云同步会话失败");
        const payload = (await response.json()) as { success?: boolean; data?: CloudSyncSession };
        const session = payload.data;
        if (!payload.success || !session?.token || !session.expiresAt) throw new Error("云同步会话响应无效");
        cachedSession = session;
        return session;
    } catch (error) {
        cachedSession = null;
        if (error instanceof Error && error.name === "AbortError") throw new Error("创建云同步会话超时，请稍后重试");
        throw error;
    } finally {
        window.clearTimeout(timer);
    }
}

async function throwCloudSyncError(response: Response, fallback: string): Promise<never> {
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
        const payload = await response.json().catch(() => null);
        const message = payload?.error?.message || payload?.message;
        if (message) throw new Error(message);
    }
    const detail = await response.text().catch(() => "");
    if (response.status === 401 || response.status === 403) throw new Error("云同步认证失败，请检查 RelayBases Key 是否可用");
    if (response.status === 404) throw new Error("云端同步文件不存在");
    throw new Error(`${fallback}：${response.status}${detail ? ` ${detail.slice(0, 120)}` : ""}`);
}

function withTimeout<T>(promise: Promise<T>, message: string) {
    return new Promise<T>((resolve, reject) => {
        const timer = window.setTimeout(() => reject(new Error(message)), CLOUD_SYNC_TIMEOUT_MS);
        promise.then(resolve, reject).finally(() => window.clearTimeout(timer));
    });
}
