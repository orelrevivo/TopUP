"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

export function ThemeHandler({ force }: { force?: "light" | "dark" }) {
    const { setTheme } = useTheme();

    useEffect(() => {
        if (force) {
            setTheme(force);
        }
    }, [force, setTheme]);

    return null;
}
