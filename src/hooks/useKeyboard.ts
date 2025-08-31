import { useEffect, useState } from "react";

export function useKeyboard(){
    const [keys, set] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const on = (e: KeyboardEvent) => set((k) => ({ ...k, [e.key]: true}));
        const off = (e: KeyboardEvent) => set((k) => ({ ...k, [e.key]: false}));

        window.addEventListener("keydown", on);
        window.addEventListener("keyup", off);

        return () => {
            window.removeEventListener("keydown", on); 
            window.removeEventListener("keyup", off);
        };
    }, []);
    return keys;
}