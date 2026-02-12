export function ActivityChart({ data }: { data: { label: string; value: number }[] }) {
    const maxValue = Math.max(...data.map(d => d.value), 1);

    return (
        <div className="w-full h-64 flex items-end justify-between gap-2 pt-8 relative">
            {/* Background grid lines could go here */}
            {data.map((item, i) => {
                const heightPercentage = (item.value / maxValue) * 100;
                return (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end group h-full">
                        <div className="text-xs text-on-surface-variant mb-2 opacity-0 group-hover:opacity-100 transition-opacity absolute top-0">
                            {item.value}
                        </div>
                        <div
                            className="w-full max-w-[40px] bg-primary/20 rounded-t-lg hover:bg-primary/40 transition-all cursor-pointer relative"
                            style={{ height: `${heightPercentage}%`, minHeight: '4px' }}
                        >
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0.5 h-full max-h-0 bg-white/20 group-hover:max-h-full transition-all duration-500" />
                        </div>
                        <span className="text-xs text-on-surface-variant mt-3 font-medium truncate w-full text-center">
                            {item.label}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}
