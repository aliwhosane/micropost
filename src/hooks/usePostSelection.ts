import { useState, useEffect, RefObject } from "react";

interface SelectionState {
    text: string;
    top: number;
    left: number;
}

export function usePostSelection(
    isEditing: boolean,
    cardRef: RefObject<HTMLDivElement | null>,
    contentRef: RefObject<HTMLDivElement | null>
) {
    const [selection, setSelection] = useState<SelectionState | null>(null);

    // Reset selection when editing starts
    useEffect(() => {
        if (isEditing) {
            setSelection(null);
        }
    }, [isEditing]);

    useEffect(() => {
        const handleDocumentMouseUp = () => {
            if (isEditing) return;
            if (!cardRef.current) return;

            const sel = window.getSelection();
            if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
                return;
            }

            const text = sel.toString().trim();
            if (!text) return;

            // Verify selection is within our content
            if (
                contentRef.current &&
                contentRef.current.contains(sel.anchorNode) &&
                contentRef.current.contains(sel.focusNode)
            ) {
                const range = sel.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                const cardRect = cardRef.current.getBoundingClientRect();

                setSelection({
                    text,
                    // Calculate position relative to the card container
                    top: rect.bottom - cardRect.top + 10,
                    left: rect.left - cardRect.left,
                });
            }
        };

        document.addEventListener("mouseup", handleDocumentMouseUp);
        return () => document.removeEventListener("mouseup", handleDocumentMouseUp);
    }, [isEditing, cardRef, contentRef]);

    return { selection, setSelection };
}
