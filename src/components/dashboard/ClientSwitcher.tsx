"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { ChevronDown, Plus, User, Check, Settings } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/Dropdown"; // Assuming we have this or need to create/import generic primitives if not
import { getClientProfiles, createClientProfile, type ClientProfileData } from "@/app/actions/clients";
import { switchWorkspace } from "@/app/actions/workspace";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { toast } from "sonner";

// --- Context ---

interface ClientProfile {
    id: string;
    name: string;
    avatarUrl?: string | null;
}

interface ClientContextType {
    activeClientId: string | null; // null = Personal Brand
    activeClientName: string;
    activeClientAvatar?: string | null;
    profiles: ClientProfile[];
    refreshProfiles: () => Promise<void>;
    setActiveClientId: (id: string | null) => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export function ClientProvider({ children, user }: { children: React.ReactNode; user: { name?: string | null; image?: string | null } }) {
    const [profiles, setProfiles] = useState<ClientProfile[]>([]);
    const [activeClientId, setActiveClientIdState] = useState<string | null>(null);

    // Initial Load
    useEffect(() => {
        const stored = localStorage.getItem("micropost_active_client");
        if (stored) setActiveClientIdState(stored);

        loadProfiles();
    }, []);

    const loadProfiles = async () => {
        const data = await getClientProfiles();
        setProfiles(data);
    };

    const setActiveClientId = (id: string | null) => {
        setActiveClientIdState(id);
        if (id) {
            localStorage.setItem("micropost_active_client", id);
        } else {
            localStorage.removeItem("micropost_active_client");
        }
    };

    const activeProfile = activeClientId ? profiles.find(p => p.id === activeClientId) : null;
    const activeClientName = activeProfile?.name || user.name || "My Brand";
    const activeClientAvatar = activeProfile?.avatarUrl || user.image;

    return (
        <ClientContext.Provider value={{ activeClientId, activeClientName, activeClientAvatar, profiles, refreshProfiles: loadProfiles, setActiveClientId }}>
            {children}
        </ClientContext.Provider>
    );
}

export function useClient() {
    const context = useContext(ClientContext);
    if (!context) throw new Error("useClient must be used within a ClientProvider");
    return context;
}

// --- Component ---

export function ClientSwitcher() {
    const { activeClientId, activeClientName, activeClientAvatar, profiles, setActiveClientId, refreshProfiles } = useClient();
    const router = useRouter();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newClientName, setNewClientName] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const handleCreate = async () => {
        if (!newClientName.trim()) return;
        setIsCreating(true);
        const res = await createClientProfile({ name: newClientName });
        if (res.success && res.profile) {
            await refreshProfiles();
            // setActiveClientId(res.profile.id); // Handled by wrapper now?
            // actually we should update the switcher to use a wrapper that calls the server action
            await handleSwitch(res.profile.id);

            setIsCreateOpen(false);
            setNewClientName("");
            toast.success("Workspace created!");
        } else {
            toast.error("Failed to create workspace");
        }
        setIsCreating(false);
    };

    const handleSwitch = async (id: string | null) => {
        setActiveClientId(id); // Client state
        await switchWorkspace(id); // Server state (cookie)
    };

    return (
        <>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-w-sm rounded-[2rem] bg-surface border-outline-variant/10 p-0 overflow-hidden gap-0">
                    <DialogHeader className="p-6 pb-2">
                        <DialogTitle>New Workspace</DialogTitle>
                    </DialogHeader>
                    <div className="p-6 pt-2 space-y-4">
                        <div className="space-y-2">
                            <Label>Client / Brand Name</Label>
                            <Input
                                placeholder="e.g. Acme Corp"
                                value={newClientName}
                                onChange={(e) => setNewClientName(e.target.value)}
                                className="bg-surface-variant/30 border-transparent focus:bg-surface transition-all"
                            />
                        </div>
                        <Button
                            className="w-full rounded-xl h-12 text-md font-bold"
                            onClick={handleCreate}
                            disabled={isCreating || !newClientName}
                        >
                            {isCreating ? "Creating..." : "Create Workspace"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all outline-none group w-full">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 shadow-sm group-hover:scale-105 transition-transform">
                                {activeClientAvatar ? (
                                    <img src={activeClientAvatar} alt={activeClientName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary font-bold text-lg">
                                        {activeClientName[0]?.toUpperCase()}
                                    </div>
                                )}
                            </div>
                            {/* Status Indicator for Workspaces */}
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-background rounded-full flex items-center justify-center">
                                <div className={`w-2.5 h-2.5 rounded-full ${activeClientId ? 'bg-tertiary' : 'bg-primary'}`} />
                            </div>
                        </div>

                        <div className="flex-1 text-left">
                            <div className="text-xs font-medium text-on-surface-variant/70 uppercase tracking-wider mb-0.5">Workspace</div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-on-surface truncate max-w-[120px]">{activeClientName}</span>
                                <ChevronDown className="w-3 h-3 text-on-surface-variant opacity-50 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-64 p-2 rounded-2xl border-outline-variant/10 bg-surface/95 backdrop-blur-xl shadow-2xl" align="start">
                    <DropdownMenuLabel className="text-xs text-on-surface-variant/50 uppercase tracking-widest px-2 py-1.5">Switch Context</DropdownMenuLabel>

                    {/* Personal Brand */}
                    <DropdownMenuItem
                        onClick={() => handleSwitch(null)}
                        className={`p-2 rounded-lg cursor-pointer flex items-center gap-3 mb-1 ${!activeClientId ? 'bg-primary/10' : 'hover:bg-surface-variant/50'}`}
                    >
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                            <User className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-medium">My Personal Brand</div>
                        </div>
                        {!activeClientId && <Check className="w-4 h-4 text-primary" />}
                    </DropdownMenuItem>

                    {/* Client Profiles */}
                    {profiles.map(profile => (
                        <DropdownMenuItem
                            key={profile.id}
                            onClick={() => handleSwitch(profile.id)}
                            className={`p-2 rounded-lg cursor-pointer flex items-center gap-3 mb-1 ${activeClientId === profile.id ? 'bg-tertiary/10' : 'hover:bg-surface-variant/50'}`}
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-tertiary/20 to-secondary/20 overflow-hidden flex items-center justify-center">
                                {profile.avatarUrl ? (
                                    <img src={profile.avatarUrl} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-xs font-bold text-tertiary">{profile.name[0]}</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-medium truncate">{profile.name}</div>
                            </div>
                            {activeClientId === profile.id && <Check className="w-4 h-4 text-tertiary" />}
                        </DropdownMenuItem>
                    ))}

                    <DropdownMenuSeparator className="bg-outline-variant/10 my-1" />

                    <DropdownMenuItem
                        onSelect={() => setIsCreateOpen(true)}
                        className="p-2 rounded-lg cursor-pointer flex items-center gap-3 hover:bg-surface-variant/50 text-on-surface-variant hover:text-primary transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full border border-dashed border-outline-variant/40 flex items-center justify-center">
                            <Plus className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">Create New Workspace</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => router.push("/dashboard/settings")}
                        className="p-2 rounded-lg cursor-pointer flex items-center gap-3 hover:bg-surface-variant/50 text-on-surface-variant"
                    >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center">
                            <Settings className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">Manage Clients</span>
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
