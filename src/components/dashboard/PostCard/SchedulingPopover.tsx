import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";
import { forwardRef } from "react";

interface SchedulingPopoverProps {
    scheduleDate: string;
    isScheduling: boolean;
    onClose: () => void;
    onConfirm: () => void;
    onDateChange: (value: string) => void;
}

export const SchedulingPopover = forwardRef<HTMLDivElement, SchedulingPopoverProps>(({
    scheduleDate,
    isScheduling,
    onClose,
    onConfirm,
    onDateChange
}, ref) => {
    return (
        <div ref={ref} className="absolute bottom-full right-0 mb-2 z-20 w-72 bg-surface rounded-xl shadow-2xl border border-outline-variant p-4 animate-in fade-in zoom-in-95 slide-in-from-bottom-2">
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-on-surface">Schedule Post</h4>
                    <Button size="sm" variant="text" onClick={onClose} className="h-6 w-6 p-0 text-on-surface-variant"><X className="h-3 w-3" /></Button>
                </div>

                <div className="flex flex-col gap-3">
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

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-on-surface-variant font-medium ml-1">Time</label>
                        <select
                            className="w-full p-2.5 rounded-lg bg-surface-variant/30 border border-outline-variant text-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                            value={scheduleDate.split("T")[1] || "09:00"}
                            onChange={(e) => {
                                const datePart = scheduleDate.split("T")[0] || new Date().toISOString().split("T")[0];
                                onDateChange(`${datePart}T${e.target.value}`);
                            }}
                        >
                            <option value="" disabled>Select time</option>
                            {Array.from({ length: 48 }).map((_, i) => {
                                const hour = Math.floor(i / 2);
                                const minute = (i % 2) * 30;
                                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

                                const date = new Date();
                                date.setHours(hour, minute);
                                const display = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

                                return <option key={timeString} value={timeString}>{display}</option>
                            })}
                        </select>
                    </div>
                </div>

                <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outlined" className="flex-1 border-outline-variant hover:bg-surface-variant" onClick={onClose}>Cancel</Button>
                    <Button
                        size="sm"
                        variant="filled"
                        className="flex-1 bg-primary text-on-primary"
                        onClick={onConfirm}
                        disabled={!scheduleDate || !scheduleDate.includes("T")}
                        isLoading={isScheduling}
                    >
                        Confirm
                    </Button>
                </div>
            </div>
        </div>
    );
});

SchedulingPopover.displayName = "SchedulingPopover";
