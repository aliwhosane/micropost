import { Button } from "@/components/ui/Button";
import { X, TrendingUp } from "lucide-react";
import { forwardRef, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SchedulingPopoverProps {
    scheduleDate: string;
    isScheduling: boolean;
    onClose: () => void;
    onConfirm: () => void;
    onDateChange: (value: string) => void;
}

const TIME_SLOTS = [
    { label: "6 AM", value: "06:00" },
    { label: "7 AM", value: "07:00" },
    { label: "8 AM", value: "08:00" },
    { label: "9 AM", value: "09:00" },
    { label: "10 AM", value: "10:00" },
    { label: "11 AM", value: "11:00" },
    { label: "12 PM", value: "12:00" },
    { label: "1 PM", value: "13:00" },
    { label: "2 PM", value: "14:00" },
    { label: "3 PM", value: "15:00" },
    { label: "4 PM", value: "16:00" },
    { label: "5 PM", value: "17:00" },
    { label: "6 PM", value: "18:00" },
    { label: "7 PM", value: "19:00" },
    { label: "8 PM", value: "20:00" },
    { label: "9 PM", value: "21:00" },
];

function getQuickScheduleOptions() {
    const now = new Date();

    // In 1 hour
    const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);
    const pad = (n: number) => n.toString().padStart(2, "0");
    const formatDT = (d: Date) =>
        `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

    // Tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}`;

    // Next Monday
    const nextMonday = new Date(now);
    const dayOfWeek = nextMonday.getDay();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    nextMonday.setDate(nextMonday.getDate() + daysUntilMonday);
    const nextMondayDate = `${nextMonday.getFullYear()}-${pad(nextMonday.getMonth() + 1)}-${pad(nextMonday.getDate())}`;

    return [
        { emoji: "⚡", label: "In 1 hour", value: formatDT(inOneHour) },
        { emoji: "🌅", label: "Tomorrow morning", value: `${tomorrowDate}T09:00` },
        { emoji: "☀️", label: "Tomorrow afternoon", value: `${tomorrowDate}T14:00` },
        { emoji: "📅", label: "Next Monday", value: `${nextMondayDate}T09:00` },
    ];
}

export const SchedulingPopover = forwardRef<HTMLDivElement, SchedulingPopoverProps>(({
    scheduleDate,
    isScheduling,
    onClose,
    onConfirm,
    onDateChange
}, ref) => {
    const quickOptions = useMemo(() => getQuickScheduleOptions(), []);
    const selectedTime = scheduleDate.includes("T") ? scheduleDate.split("T")[1]?.slice(0, 5) : "";

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-full right-0 mb-2 z-20 w-80 bg-surface rounded-xl shadow-2xl border border-outline-variant p-4"
        >
            <div className="flex flex-col gap-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-on-surface">Schedule Post</h4>
                    <Button size="sm" variant="text" onClick={onClose} className="h-6 w-6 p-0 text-on-surface-variant">
                        <X className="h-3 w-3" />
                    </Button>
                </div>

                {/* Quick Schedule Pills */}
                <div className="grid grid-cols-2 gap-2">
                    {quickOptions.map((option) => (
                        <motion.button
                            key={option.label}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onDateChange(option.value)}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all border",
                                scheduleDate === option.value
                                    ? "bg-primary text-on-primary border-primary shadow-sm"
                                    : "bg-surface-variant/30 text-on-surface-variant border-outline-variant/40 hover:bg-surface-variant/60 hover:border-outline-variant"
                            )}
                        >
                            <span className="text-sm">{option.emoji}</span>
                            <span>{option.label}</span>
                        </motion.button>
                    ))}
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 my-1">
                    <div className="flex-1 h-px bg-outline-variant/30" />
                    <span className="text-[10px] text-on-surface-variant/50 uppercase tracking-wider font-medium">or pick exact time</span>
                    <div className="flex-1 h-px bg-outline-variant/30" />
                </div>

                {/* Date Picker */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-on-surface-variant font-medium ml-1">Date</label>
                    <input
                        type="date"
                        className="w-full p-2.5 rounded-lg bg-surface-variant/30 border border-outline-variant text-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        value={scheduleDate.split("T")[0]}
                        min={new Date().toLocaleDateString('en-CA')}
                        onChange={(e) => {
                            const timePart = scheduleDate.includes("T") ? scheduleDate.split("T")[1] : "09:00";
                            onDateChange(`${e.target.value}T${timePart}`);
                        }}
                    />
                </div>

                {/* Time Slot Grid */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-on-surface-variant font-medium ml-1">Time</label>
                    <div className="grid grid-cols-4 gap-1.5">
                        {TIME_SLOTS.map((slot) => (
                            <motion.button
                                key={slot.value}
                                whileTap={{ scale: 0.92 }}
                                onClick={() => {
                                    const datePart = scheduleDate.split("T")[0] || new Date().toISOString().split("T")[0];
                                    onDateChange(`${datePart}T${slot.value}`);
                                }}
                                className={cn(
                                    "px-1 py-1.5 rounded-md text-xs font-medium transition-all",
                                    selectedTime === slot.value
                                        ? "bg-primary text-on-primary shadow-sm"
                                        : "bg-surface-variant/30 text-on-surface-variant hover:bg-surface-variant/60"
                                )}
                            >
                                {slot.label}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Best Times Hint */}
                <div className="flex items-center gap-2 text-xs text-on-surface-variant/60 mt-2">
                    <TrendingUp className="w-3 h-3" />
                    <span>Best engagement: 8-9am, 12-1pm</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-1">
                    <Button size="sm" variant="outlined" className="flex-1 border-outline-variant hover:bg-surface-variant" onClick={onClose}>Cancel</Button>
                    <Button
                        size="sm"
                        variant="filled"
                        className="flex-1 bg-primary text-on-primary"
                        onClick={onConfirm}
                        disabled={!scheduleDate || !scheduleDate.includes("T")}
                        isLoading={isScheduling}
                    >
                        Schedule
                    </Button>
                </div>
            </div>
        </motion.div>
    );
});

SchedulingPopover.displayName = "SchedulingPopover";
