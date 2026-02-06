import { ScriptWizard } from "@/components/dashboard/ShortsMaker/ScriptWizard";

export default function ShortsMakerPage() {
    return (
        <div className="p-8 space-y-8">
            <div className="max-w-4xl mx-auto space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">ShortsMaker</h1>
                <p className="text-zinc-400">Turn ideas into viral TikTok/Reels scripts and storyboards in seconds.</p>
            </div>

            <ScriptWizard />
        </div>
    );
}
