import { useCallback } from "react";

import { useLanguageStore, type LanguageName } from "@/stores/use-language-store";

const zhToEn = {
    无限画布: "Infinite Canvas",
    "RelayBases Canvas": "RelayBases Canvas",
    "把生图、视频和 Agent 串进同一张画布": "Image, Video, And Agents On One Canvas",
    "面向 RelayBases 用户的创作入口。获取 API Key 后，在画布配置里分别填写媒体 Key 和文本 Key，即可使用图片生成、视频任务、Agent 编排和本地精选提示词库。":
        "A creation workspace for RelayBases users. Get API keys from RelayBases, enter separate media and text keys in settings, then use image generation, video tasks, agent orchestration, and the local prompt library.",
    "获取 API Key": "Get API Key",
    进入画布: "Enter Canvas",
    "配置 Key": "Configure Keys",
    提示词库: "Prompt Library",
    "先在 RelayBases 主站获取 Key": "Get Your Keys From RelayBases First",
    "在主站获取 Key": "Get Keys On RelayBases",
    "前往 RelayBases API 密钥页面创建媒体 Key 和文本 Key，余额、模型与账单都在主站管理。": "Create media and text keys on the RelayBases API keys page. Balance, models, and billing stay on the main site.",
    "媒体 Key 用于图片和视频": "Media Key Powers Images And Videos",
    "画布内图片与视频统一走 RelayBases 媒体线路；异步图片和视频任务会按 4x 计费。": "Images and videos use the RelayBases media route. Async image and video tasks are billed at 4x.",
    "文本 Key 用于 Agent": "Text Key Powers Agents",
    "文本 Key 负责 Agent、提示词反推和文本生成。填入后可自动获取可用文本模型。": "The text key is used for agents, prompt reverse engineering, and text generation. Available text models are loaded automatically.",
    "主站管理": "Main Site",
    "API 密钥": "API Keys",
    控制台: "Console",
    钱包充值: "Wallet",
    "高质量示例": "High Quality Examples",
    "从本地精选提示词库抽取示例图，发布后随项目一起部署，不依赖远端原库。": "Examples come from the local curated prompt library and deploy with the project, without depending on the original remote library.",
    "查看更多提示词": "More Prompts",
    本地精选提示词示例: "Local Curated Prompt Examples",
    查看提示词库: "View Prompt Library",
    "没有可展示的示例图": "No Examples Available",
    "基于 infinite-canvas 定制": "Customized From infinite-canvas",
    修改版源码: "Modified Source",
    原项目: "Original Project",

    我的画布: "My Canvas",
    生图工作台: "Image Studio",
    视频创作台: "Video Studio",
    我的素材: "My Assets",
    主站: "Main Site",
    "获取 Key": "Get Key",
    打开导航菜单: "Open Navigation",
    导航菜单: "Navigation",
    配置: "Settings",
    快捷键: "Shortcuts",
    切换到浅色主题: "Switch To Light Theme",
    切换到深色主题: "Switch To Dark Theme",
    切换到英文: "Switch To English",
    切换到中文: "Switch To Chinese",

    配置与用户偏好: "Settings And Preferences",
    "媒体 API Key、文本 API Key、默认模型和同步偏好": "Media API key, text API key, default models, and sync preferences",
    "媒体 API Key、文本 API Key、推荐分组和默认模型": "Media API key, text API key, recommended groups, and default models",
    RelayBases: "RelayBases",
    模型: "Models",
    生成偏好: "Generation",
    "WebDAV": "WebDAV",
    "媒体 API Key": "Media API Key",
    "文本 API Key": "Text API Key",
    "用于图片和视频生成；视频与异步任务按 4x 计费。": "Used for image and video generation. Video and async tasks are billed at 4x.",
    "用于图片和视频生成。建议在主站用 gpt-image-2 分组创建媒体 Key；视频与异步任务按 4x 计费。": "Used for image and video generation. Create the media key from the gpt-image-2 group on RelayBases. Video and async tasks are billed at 4x.",
    "用于 Agent、图片反推提示词和文本生成。": "Used for agents, image-to-prompt, and text generation.",
    "用于 Agent、图片反推提示词和文本生成。建议用 codex-pro 分组创建文本 Key，其它文本分组也可用。": "Used for agents, image-to-prompt, and text generation. The codex-pro group is recommended for text keys, while other text groups also work.",
    获取模型: "Load Models",
    同步图片默认: "Sync Image Default",
    "生图推荐 gpt-image-2 分组": "Image Generation: gpt-image-2 Group Recommended",
    "同步图默认 gpt-image-2": "Sync Images Default To gpt-image-2",
    "推荐 codex-pro 分组": "codex-pro Group Recommended",
    其它文本分组可用: "Other Text Groups Also Work",
    "异步任务 4x 计费": "Async Tasks 4x Billing",
    同步图片模型: "Sync Image Models",
    异步视频任务: "Async Video Tasks",
    "按 4x 计费。": "Billed At 4x.",
    完成: "Done",
    默认模型: "Default Model",
    模型列表: "Model List",
    基础设置: "Basic Settings",
    保存: "Save",
    取消: "Cancel",
    删除: "Delete",
    清空: "Clear",
    关闭: "Close",
    上传: "Upload",
    下载: "Download",
    复制: "Copy",
    加入我的素材: "Add To Assets",
    新建: "New",
    编辑: "Edit",
    重命名: "Rename",
    预览: "Preview",
    生成: "Generate",
    开始生成: "Start",
    停止: "Stop",
    参数: "Settings",
    历史: "History",
    日志: "Logs",
    提示词: "Prompt",
    负面提示词: "Negative Prompt",
    尺寸: "Size",
    质量: "Quality",
    比例: "Ratio",
    宽: "Width",
    高: "Height",
    数量: "Count",
    图片: "Image",
    视频: "Video",
    素材: "Assets",
    选择模型: "Choose Model",
    选择尺寸: "Choose Size",
    选择比例: "Choose Ratio",
    生成张数: "Images",
    加载中: "Loading",
    加载失败: "Load Failed",
    暂无数据: "No Data",
    暂无素材: "No Assets",
    暂无画布: "No Canvas Yet",
    创建画布: "Create Canvas",
    新建画布: "New Canvas",
    画布名称: "Canvas Name",
    我的项目: "My Projects",
    最近编辑: "Recent",
    搜索: "Search",
    全部: "All",
    分类: "Category",
    标签: "Tags",
    复制成功: "Copied",
    操作成功: "Done",
    操作失败: "Failed",
    "已导入 RelayBases API Key": "RelayBases API Key Imported",
    已忽略不支持的链接参数: "Unsupported link parameters were ignored",
    "获取提示词失败": "Failed To Load Prompts",
    "填写文本 API Key 后获取模型；若返回列表包含 codex-pro，会优先使用 codex-pro，否则使用返回列表第一个。":
        "Enter the text API key and load models. If codex-pro is returned, it will be preferred; otherwise the first returned model is used.",
    "图片加载失败": "Image Failed To Load",
    "模型没有返回工具调用，画布操作未执行。": "The model returned no tool call, so no canvas operation was executed.",
} as const;

const enToZh = Object.fromEntries(Object.entries(zhToEn).map(([zh, en]) => [en, zh])) as Record<string, string>;

export function translateText(value: string, language: LanguageName): string {
    if (language === "en") return zhToEn[value as keyof typeof zhToEn] ?? value;
    return enToZh[value] ?? value;
}

export function translateLooseText(value: string, language: LanguageName): string {
    const trimmed = value.trim();
    if (!trimmed) return value;
    const translated = translateText(trimmed, language);
    if (translated === trimmed) return value;
    const prefix = value.match(/^\s*/)?.[0] ?? "";
    const suffix = value.match(/\s*$/)?.[0] ?? "";
    return `${prefix}${translated}${suffix}`;
}

export function useI18n() {
    const language = useLanguageStore((state) => state.language);
    const setLanguage = useLanguageStore((state) => state.setLanguage);
    const t = useCallback((value: string) => translateText(value, language), [language]);
    return { language, setLanguage, t };
}
