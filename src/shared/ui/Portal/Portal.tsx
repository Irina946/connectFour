import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface IPortalProps {
    children: ReactNode;
    containerId?: string;
}

export const Portal = ({ children, containerId = "modal-root" }: IPortalProps) => {
    const elRef = useRef<HTMLDivElement | null>(null);

    if (!elRef.current) {
        elRef.current = document.createElement("div");
    }

    useEffect(() => {
        const container = document.getElementById(containerId) || document.body;
        const el = elRef.current!;
        container.appendChild(el);
        return () => {
            container.removeChild(el);
        };
    }, [containerId]);

    return createPortal(children, elRef.current);
};
