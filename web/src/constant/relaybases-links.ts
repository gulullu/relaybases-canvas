export const RELAYBASES_HOME_URL = "https://relaybases.com/";
export const RELAYBASES_KEYS_URL = "https://relaybases.com/keys";
export const RELAYBASES_CONSOLE_URL = "https://relaybases.com/dashboard/overview";
export const RELAYBASES_WALLET_URL = "https://relaybases.com/wallet";

export const relayBasesLinks = [
    {
        label: "主站",
        href: RELAYBASES_HOME_URL,
    },
    {
        label: "获取 Key",
        href: RELAYBASES_KEYS_URL,
        primary: true,
    },
    {
        label: "控制台",
        href: RELAYBASES_CONSOLE_URL,
    },
] as const;
