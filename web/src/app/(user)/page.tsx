"use client";

import { ArrowRight, BadgeCheck, ExternalLink, KeyRound, Layers3, Settings2, Sparkles, WalletCards } from "lucide-react";
import { useEffect, useState } from "react";
import { App, Image, Tag } from "antd";

import { navigationTools } from "@/constant/navigation-tools";
import { RELAYBASES_CONSOLE_URL, RELAYBASES_HOME_URL, RELAYBASES_KEYS_URL, RELAYBASES_WALLET_URL } from "@/constant/relaybases-links";
import { fetchPrompts, type Prompt } from "@/services/api/prompts";
import { useConfigStore } from "@/stores/use-config-store";
import { useLanguageStore } from "@/stores/use-language-store";

const heroPromptIds = ["rb-prompt-001", "rb-prompt-011", "rb-prompt-021", "rb-prompt-031", "rb-prompt-041", "rb-prompt-051", "rb-prompt-061", "rb-prompt-071", "rb-prompt-081", "rb-prompt-091"];

const fallbackPrompts: Prompt[] = [
    createFallbackPrompt("rb-prompt-001", "雨夜玻璃窗人像", "/prompt-covers/relaybases/rb-prompt-001.webp", ["人像", "电影感"]),
    createFallbackPrompt("rb-prompt-011", "透明香水瓶广告", "/prompt-covers/relaybases/rb-prompt-011.webp", ["产品", "广告"]),
    createFallbackPrompt("rb-prompt-021", "峡谷玻璃住宅", "/prompt-covers/relaybases/rb-prompt-021.webp", ["建筑", "现代"]),
    createFallbackPrompt("rb-prompt-031", "冰川蓝湖航拍", "/prompt-covers/relaybases/rb-prompt-031.webp", ["风景", "航拍"]),
    createFallbackPrompt("rb-prompt-041", "月亮邮局绘本", "/prompt-covers/relaybases/rb-prompt-041.webp", ["插画", "绘本"]),
    createFallbackPrompt("rb-prompt-051", "透明机械水母", "/prompt-covers/relaybases/rb-prompt-051.webp", ["3D", "机械"]),
    createFallbackPrompt("rb-prompt-061", "城市能源流可视化", "/prompt-covers/relaybases/rb-prompt-061.webp", ["信息图", "科技"]),
    createFallbackPrompt("rb-prompt-071", "法式早餐桌", "/prompt-covers/relaybases/rb-prompt-071.webp", ["美食", "生活"]),
    createFallbackPrompt("rb-prompt-081", "星际植物温室", "/prompt-covers/relaybases/rb-prompt-081.webp", ["科幻", "植物"]),
    createFallbackPrompt("rb-prompt-091", "无字音乐节主视觉", "/prompt-covers/relaybases/rb-prompt-091.webp", ["海报", "音乐"]),
    createFallbackPrompt("rb-prompt-012", "黑色机械腕表特写", "/prompt-covers/relaybases/rb-prompt-012.webp", ["产品", "机械"]),
    createFallbackPrompt("rb-prompt-032", "竹林晨雾小径", "/prompt-covers/relaybases/rb-prompt-032.webp", ["风景", "东方"]),
];

const keySteps = [
    {
        title: "在主站获取 Key",
        copy: "前往 RelayBases API 密钥页面创建媒体 Key 和文本 Key，余额、模型与账单都在主站管理。",
        icon: KeyRound,
    },
    {
        title: "媒体 Key 用于图片和视频",
        copy: "画布内图片与视频统一走 RelayBases 媒体线路；异步图片和视频任务会按 4x 计费。",
        icon: Sparkles,
    },
    {
        title: "文本 Key 用于 Agent",
        copy: "文本 Key 负责 Agent、提示词反推和文本生成。填入后可自动获取可用文本模型。",
        icon: Layers3,
    },
] as const;

const promoLinks = [
    {
        label: "API 密钥",
        href: RELAYBASES_KEYS_URL,
        icon: KeyRound,
    },
    {
        label: "控制台",
        href: RELAYBASES_CONSOLE_URL,
        icon: BadgeCheck,
    },
    {
        label: "钱包充值",
        href: RELAYBASES_WALLET_URL,
        icon: WalletCards,
    },
] as const;

function createFallbackPrompt(id: string, title: string, coverUrl: string, tags: string[]): Prompt {
    return {
        id,
        title,
        coverUrl,
        prompt: "RelayBases 精选视觉提示词示例，适合直接加入画布继续改写、延展和生成。",
        tags,
        category: "RelayBases",
        githubUrl: "",
        preview: coverUrl,
        createdAt: "",
        updatedAt: "",
    };
}

function pickHeroPrompts(items: Prompt[]) {
    const byId = new Map(items.map((item) => [item.id, item]));
    const picked = heroPromptIds.map((id) => byId.get(id)).filter(Boolean) as Prompt[];
    if (picked.length >= Math.min(heroPromptIds.length, items.length)) return picked.slice(0, 10);
    const pickedIds = new Set(picked.map((item) => item.id));
    return [...picked, ...items.filter((item) => !pickedIds.has(item.id))].slice(0, 10);
}

export default function IndexPage() {
    const { message } = App.useApp();
    const openConfigDialog = useConfigStore((state) => state.openConfigDialog);
    const language = useLanguageStore((state) => state.language);
    const [primaryTool] = navigationTools;
    const [promptShowcase, setPromptShowcase] = useState<Prompt[]>([]);
    const [hiddenPromptIds, setHiddenPromptIds] = useState<Set<string>>(() => new Set());
    const [previewIndex, setPreviewIndex] = useState(0);
    const [previewOpen, setPreviewOpen] = useState(false);
    const visiblePromptShowcase = promptShowcase.filter((item) => !hiddenPromptIds.has(item.id) && item.coverUrl.trim());
    const showcasePrompts = (visiblePromptShowcase.length ? visiblePromptShowcase : fallbackPrompts).filter((item) => !hiddenPromptIds.has(item.id));
    const heroPrompts = pickHeroPrompts(showcasePrompts);
    const heroPromptIdSet = new Set(heroPrompts.map((item) => item.id));
    const galleryPrompts = showcasePrompts.filter((item) => !heroPromptIdSet.has(item.id)).slice(0, 15);

    useEffect(() => {
        void fetchPrompts({ pageSize: 100 })
            .then((data) => {
                setHiddenPromptIds(new Set());
                setPromptShowcase(data.items);
            })
            .catch((error) => message.error(error instanceof Error ? error.message : "获取提示词失败"));
    }, [language, message]);

    const hidePrompt = (id: string) => {
        setHiddenPromptIds((current) => new Set(current).add(id));
    };

    return (
        <main className="min-h-full bg-[#f7f8f6] text-stone-950 dark:bg-[#090a09] dark:text-stone-50">
            <section className="relative overflow-hidden border-b border-black/10 bg-[linear-gradient(135deg,#fbfbf8_0%,#eef3ef_48%,#f8fafc_100%)] dark:border-white/10 dark:bg-[linear-gradient(135deg,#090a09_0%,#151713_54%,#0d1110_100%)]">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(22,24,20,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(22,24,20,.06)_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(rgba(255,255,255,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.055)_1px,transparent_1px)]" />
                <div className="relative mx-auto grid max-w-7xl gap-9 px-6 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-10">
                    <div className="max-w-3xl">
                        <a
                            href={RELAYBASES_HOME_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1.5 text-sm font-medium text-stone-700 shadow-sm backdrop-blur transition hover:border-black/20 hover:text-stone-950 dark:border-white/10 dark:bg-white/10 dark:text-stone-200 dark:hover:border-white/20 dark:hover:text-white"
                        >
                            RelayBases Canvas
                            <ExternalLink className="size-3.5" />
                        </a>
                        <h1 className="mt-5 max-w-4xl text-balance text-4xl font-semibold leading-[1.04] tracking-normal text-stone-950 sm:text-5xl lg:text-6xl dark:text-white">把生图、视频和 Agent 串进同一张画布</h1>
                        <p className="mt-5 max-w-2xl text-base leading-7 text-stone-600 dark:text-stone-300">
                            面向 RelayBases 用户的创作入口。获取 API Key 后，在画布配置里分别填写媒体 Key 和文本 Key，即可使用图片生成、视频任务、Agent 编排和精选提示词库。
                        </p>
                        <div className="mt-7 flex flex-wrap gap-3">
                            <a
                                href={RELAYBASES_KEYS_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-stone-950 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-stone-800 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
                            >
                                获取 API Key
                                <ArrowRight className="size-4" />
                            </a>
                            <a
                                href={`/${primaryTool.slug}?mode=new`}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-stone-300 bg-white/70 px-5 text-sm font-medium text-stone-950 shadow-sm transition hover:border-stone-400 hover:bg-white dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:border-white/25 dark:hover:bg-white/15"
                            >
                                进入画布
                            </a>
                            <button
                                type="button"
                                onClick={() => openConfigDialog(false)}
                                className="group relative isolate inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-full border border-emerald-400/70 bg-white px-5 text-sm font-semibold text-emerald-950 shadow-[0_0_0_4px_rgba(16,185,129,0.10),0_10px_24px_rgba(15,23,42,0.10)] transition hover:-translate-y-0.5 hover:border-emerald-500 hover:bg-emerald-50 hover:shadow-[0_0_0_5px_rgba(16,185,129,0.14),0_14px_30px_rgba(15,23,42,0.14)] dark:border-emerald-300/40 dark:bg-white/10 dark:text-emerald-50 dark:shadow-[0_0_0_4px_rgba(110,231,183,0.10),0_10px_24px_rgba(0,0,0,0.24)] dark:hover:bg-emerald-300/15"
                            >
                                <span className="absolute inset-y-0 -left-16 -z-10 w-12 skew-x-[-18deg] bg-white/70 opacity-0 transition duration-700 group-hover:translate-x-48 group-hover:opacity-80 dark:bg-white/20" />
                                <span className="flex size-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm dark:bg-emerald-400 dark:text-stone-950">
                                    <Settings2 className="size-3.5 transition group-hover:rotate-45" />
                                </span>
                                配置 Key
                            </button>
                        </div>
                        <div className="mt-7 grid max-w-2xl gap-3 sm:grid-cols-3">
                            {promoLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center gap-3 rounded-xl border border-black/10 bg-white/65 p-3 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-black/20 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:hover:border-white/20 dark:hover:bg-white/15"
                                    >
                                        <span className="flex size-9 items-center justify-center rounded-lg bg-stone-950 text-white dark:bg-white dark:text-stone-950">
                                            <Icon className="size-4" />
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block text-sm font-medium text-stone-950 dark:text-white">{link.label}</span>
                                            <span className="mt-0.5 block text-xs text-stone-500 dark:text-stone-400">主站管理</span>
                                        </span>
                                        <ExternalLink className="ml-auto size-3.5 opacity-40 transition group-hover:opacity-70" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="ml-auto max-w-[700px] rounded-2xl border border-white/50 bg-white/55 p-3 shadow-2xl shadow-stone-900/10 backdrop-blur dark:border-white/10 dark:bg-white/[0.04] dark:shadow-black/30">
                            <div className="mb-3 flex items-center justify-between px-1">
                                <span className="text-xs font-medium uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">Poster Wall</span>
                                <a href="/prompts" className="inline-flex items-center gap-1 text-xs font-medium text-stone-600 transition hover:text-stone-950 dark:text-stone-300 dark:hover:text-white">
                                    提示词库
                                    <ArrowRight className="size-3.5" />
                                </a>
                            </div>
                            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                                {heroPrompts.map((item, index) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => {
                                            const galleryIndex = galleryPrompts.findIndex((prompt) => prompt.id === item.id);
                                            setPreviewIndex(Math.max(galleryIndex, 0));
                                            setPreviewOpen(true);
                                        }}
                                        className="group relative aspect-[3/4] overflow-hidden rounded-lg border border-black/10 bg-stone-950 shadow-md shadow-stone-900/10 transition hover:-translate-y-0.5 dark:border-white/10 dark:shadow-black/30"
                                    >
                                        <img src={item.coverUrl} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" onError={() => hidePrompt(item.id)} />
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-4 text-left text-white">
                                            <p className="line-clamp-1 text-xs font-medium">{item.title}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-b border-stone-200 bg-white px-6 py-14 dark:border-white/10 dark:bg-[#0d0e0d]">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">Key Setup</p>
                            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-stone-950 dark:text-white">先在 RelayBases 主站获取 Key</h2>
                        </div>
                    </div>
                    <div className="mt-8 grid gap-4 lg:grid-cols-3">
                        {keySteps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <article key={step.title} className="rounded-2xl border border-stone-200 bg-[#f8f8f4] p-6 dark:border-white/10 dark:bg-white/5">
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="flex size-11 items-center justify-center rounded-xl bg-stone-950 text-white dark:bg-white dark:text-stone-950">
                                            <Icon className="size-5" />
                                        </span>
                                        <span className="text-sm font-medium text-stone-400">0{index + 1}</span>
                                    </div>
                                    <h3 className="mt-5 text-lg font-semibold text-stone-950 dark:text-white">{step.title}</h3>
                                    <p className="mt-3 text-sm leading-6 text-stone-600 dark:text-stone-300">{step.copy}</p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-[#f7f8f6] px-6 py-14 dark:bg-[#090a09]">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400">Prompt Gallery</p>
                            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-stone-950 dark:text-white">精选提示词示例</h2>
                        </div>
                        <a href="/prompts" className="inline-flex items-center gap-2 text-sm font-medium text-stone-700 transition hover:text-stone-950 dark:text-stone-300 dark:hover:text-white">
                            查看提示词库
                            <ArrowRight className="size-4" />
                        </a>
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                        {galleryPrompts.map((item, index) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                    setPreviewIndex(index);
                                    setPreviewOpen(true);
                                }}
                                className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 text-left shadow-sm transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5"
                            >
                                <img src={item.coverUrl} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" onError={() => hidePrompt(item.id)} />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-4 text-white">
                                    <div className="mb-2 flex flex-wrap gap-1.5">
                                        {item.tags.slice(0, 2).map((tag, tagIndex) => (
                                            <Tag key={`${tag}-${tagIndex}`} className="m-0 border-white/10 bg-white/15 text-[11px] text-white backdrop-blur">
                                                {tag}
                                            </Tag>
                                        ))}
                                    </div>
                                    <h3 className="text-sm font-medium">{item.title}</h3>
                                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/75">{item.prompt}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>
            <Image.PreviewGroup
                preview={{
                    open: previewOpen,
                    current: previewIndex,
                    onOpenChange: setPreviewOpen,
                    onChange: setPreviewIndex,
                }}
            >
                <div className="hidden">
                    {galleryPrompts.map((item) => (
                        <Image key={item.id} src={item.coverUrl} alt={item.title} onError={() => hidePrompt(item.id)} />
                    ))}
                </div>
            </Image.PreviewGroup>
        </main>
    );
}
