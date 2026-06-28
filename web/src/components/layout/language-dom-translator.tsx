"use client";

import { useEffect } from "react";

import { translateLooseText } from "@/lib/i18n";
import { useLanguageStore } from "@/stores/use-language-store";

const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "SELECT", "OPTION", "CODE", "PRE"]);
const TRANSLATABLE_ATTRIBUTES = ["aria-label", "title", "placeholder"];

function shouldSkipElement(element: Element | null): boolean {
    if (!element) return false;
    if (SKIP_TAGS.has(element.tagName)) return true;
    if (element.closest("[contenteditable='true'],[data-no-i18n='true']")) return true;
    return false;
}

function translateTextNode(node: Text, language: "zh" | "en") {
    if (shouldSkipElement(node.parentElement)) return;
    const nextValue = translateLooseText(node.nodeValue ?? "", language);
    if (nextValue !== node.nodeValue) node.nodeValue = nextValue;
}

function translateAttributes(element: Element, language: "zh" | "en") {
    if (shouldSkipElement(element)) return;
    for (const attribute of TRANSLATABLE_ATTRIBUTES) {
        const value = element.getAttribute(attribute);
        if (!value) continue;
        const nextValue = translateLooseText(value, language);
        if (nextValue !== value) element.setAttribute(attribute, nextValue);
    }
}

function translateSubtree(root: Node, language: "zh" | "en") {
    if (root.nodeType === Node.TEXT_NODE) {
        translateTextNode(root as Text, language);
        return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;

    const element = root.nodeType === Node.ELEMENT_NODE ? (root as Element) : null;
    if (shouldSkipElement(element)) return;
    if (element) translateAttributes(element, language);

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
        acceptNode(node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                return shouldSkipElement(node as Element) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
            }
            return shouldSkipElement(node.parentElement) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        },
    });

    let node = walker.nextNode();
    while (node) {
        if (node.nodeType === Node.TEXT_NODE) translateTextNode(node as Text, language);
        if (node.nodeType === Node.ELEMENT_NODE) translateAttributes(node as Element, language);
        node = walker.nextNode();
    }
}

export function LanguageDomTranslator() {
    const language = useLanguageStore((state) => state.language);

    useEffect(() => {
        document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
        document.documentElement.dataset.lang = language;
        translateSubtree(document.body, language);

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === "characterData") {
                    translateSubtree(mutation.target, language);
                    continue;
                }
                if (mutation.type === "attributes") {
                    translateSubtree(mutation.target, language);
                    continue;
                }
                mutation.addedNodes.forEach((node) => translateSubtree(node, language));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true,
            attributeFilter: TRANSLATABLE_ATTRIBUTES,
        });

        return () => observer.disconnect();
    }, [language]);

    return null;
}
