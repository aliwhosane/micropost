import { useState } from "react";

export function usePostScheduling(approvePost: (id: string, scheduledAt: string) => Promise<void>) {
    const [isScheduling, setIsScheduling] = useState(false);
    const [scheduleDate, setScheduleDate] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleConfirmSchedule = async (postId: string) => {
        if (!scheduleDate || !scheduleDate.includes("T")) return;

        setIsSubmitting(true);
        try {
            // Convert local time to UTC ISO string to preserve the correct instant
            const isoDate = new Date(scheduleDate).toISOString();
            await approvePost(postId, isoDate);
            setIsScheduling(false);
        } catch (error) {
            console.error("Failed to schedule:", error);
            // Ideally handle error state here
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        isScheduling,
        setIsScheduling,
        scheduleDate,
        setScheduleDate,
        handleConfirmSchedule,
        isSubmitting
    };
}
