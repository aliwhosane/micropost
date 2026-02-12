"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { MoreVertical, Pencil, Plus, Trash2, Users, Twitter, Linkedin, AtSign } from "lucide-react";
import { deleteClientProfile, updateClientProfile, createClientProfile } from "@/app/actions/clients";
import { toast } from "sonner";
import { useClient } from "@/components/dashboard/ClientSwitcher";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/Dropdown";
import { connectClientAccount } from "@/app/actions/auth-client";
import { cn } from "@/lib/utils";

type Client = {
    id: string;
    name: string;
    niche?: string | null;
    bio?: string | null;
    tone?: string | null;
    avatarUrl?: string | null;
    accounts?: any[];
};

export function ClientList({ initialClients }: { initialClients: Client[] }) {
    const [clients, setClients] = useState<Client[]>(initialClients);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const { activeClientId, setActiveClientId } = useClient();

    const handleConnect = async (provider: string, clientId: string) => {
        toast.loading(`Connecting to ${provider}...`);
        await connectClientAccount(provider, clientId);
    };

    // Edit State
    const [editingClient, setEditingClient] = useState<Client | null>(null);

    const refreshClients = (updated: Client[]) => {
        setClients(updated);
        // Also update local storage if the active client was modified? 
        // Logic handled in ClientSwitcher context ideally, but here we just update the list.
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this profile?")) return;

        try {
            const result = await deleteClientProfile(id);
            if (result.success) {
                toast.success("Client profile deleted");
                setClients(prev => prev.filter(c => c.id !== id));
                if (activeClientId === id) {
                    setActiveClientId(null); // Reset to personal
                }
            } else {
                toast.error("Failed to delete profile");
            }
        } catch (e) {
            toast.error("Error deleting profile");
        }
    };

    return (
        <Card className="border-outline-variant/30 shadow-sm bg-surface">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        Client Workspaces
                    </CardTitle>
                    <CardDescription>Manage profiles for your clients or different brands.</CardDescription>
                </div>
                <ClientDialog
                    mode="create"
                    onSuccess={(newClient) => setClients([...clients, newClient])}
                >
                    <Button variant="tonal" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Client
                    </Button>
                </ClientDialog>
            </CardHeader>
            <CardContent className="space-y-4">
                {clients.length === 0 ? (
                    <div className="text-center py-8 text-on-surface-variant/60">
                        <p>No client profiles yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {clients.map(client => (
                            <div key={client.id} className="group relative flex flex-col p-4 rounded-xl border border-outline-variant/20 bg-surface-variant/10 hover:bg-surface-variant/20 transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-10 h-10 border border-outline-variant/20">
                                            <AvatarImage src={client.avatarUrl || ""} />
                                            <AvatarFallback>{client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className="font-semibold text-on-surface line-clamp-1">{client.name}</h4>
                                            <p className="text-xs text-on-surface-variant line-clamp-1">{client.niche || "No niche"}</p>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <ClientDialog
                                                mode="edit"
                                                client={client}
                                                onSuccess={(updated) => setClients(clients.map(c => c.id === updated.id ? updated : c))}
                                            >
                                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                    <Pencil className="w-4 h-4 mr-2" /> Edit
                                                </DropdownMenuItem>
                                            </ClientDialog>
                                            <DropdownMenuItem className="text-error" onClick={() => handleDelete(client.id)}>
                                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className="mt-auto space-y-3">
                                    <p className="text-xs text-on-surface-variant line-clamp-2 bg-surface/50 p-2 rounded-md h-12">
                                        {client.bio || "No bio set."}
                                    </p>
                                    <div className="flex items-center gap-2 text-[10px] text-on-surface-variant/70">
                                        <span className="px-1.5 py-0.5 rounded bg-surface/50 border border-outline-variant/10">
                                            {client.tone || "Neutral tone"}
                                        </span>
                                    </div>

                                    {/* Social Connections */}
                                    <div className="pt-2 border-t border-outline-variant/10 flex gap-2">
                                        {[
                                            { provider: "twitter", icon: <Twitter className="w-3 h-3" />, color: "text-[#1DA1F2]", bg: "bg-[#1DA1F2]/10" },
                                            { provider: "linkedin", icon: <Linkedin className="w-3 h-3" />, color: "text-[#0077b5]", bg: "bg-[#0077b5]/10" },
                                            { provider: "threads", icon: <AtSign className="w-3 h-3" />, color: "text-black dark:text-white", bg: "bg-black/5 dark:bg-white/10" }
                                        ].map(platform => {
                                            const account = client.accounts?.find((a: any) => a.provider === platform.provider);
                                            return (
                                                <button
                                                    key={platform.provider}
                                                    onClick={() => !account && handleConnect(platform.provider, client.id)}
                                                    disabled={!!account}
                                                    className={cn(
                                                        "flex items-center justify-center w-8 h-8 rounded-full transition-all border",
                                                        account
                                                            ? `${platform.bg} ${platform.color} border-transparent`
                                                            : "bg-surface border-outline-variant/20 text-on-surface-variant/40 hover:text-primary hover:border-primary/20"
                                                    )}
                                                    title={account ? `Connected as ${account.accountName || account.provider}` : `Connect ${platform.provider}`}
                                                >
                                                    {account ? (
                                                        account.accountImage ? (
                                                            <img src={account.accountImage} className="w-full h-full object-cover rounded-full" />
                                                        ) : platform.icon
                                                    ) : (
                                                        <Plus className="w-3 h-3" />
                                                    )}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function ClientDialog({ mode, client, children, onSuccess }: { mode: "create" | "edit", client?: Client, children: React.ReactNode, onSuccess: (c: Client) => void }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form State
    const [name, setName] = useState(client?.name || "");
    const [niche, setNiche] = useState(client?.niche || "");
    const [bio, setBio] = useState(client?.bio || "");
    const [tone, setTone] = useState(client?.tone || "");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (mode === "create") {
                const res = await createClientProfile({ name, niche, bio, tone });
                if (res.success && res.profile) {
                    toast.success("Client created!");
                    onSuccess(res.profile);
                    setOpen(false);
                    // Reset
                    setName(""); setNiche(""); setBio(""); setTone("");
                } else {
                    toast.error(res.error || "Failed to create");
                }
            } else if (mode === "edit" && client) {
                const res = await updateClientProfile(client.id, { name, niche, bio, tone });
                if (res.success && res.profile) {
                    toast.success("Client updated!");
                    onSuccess(res.profile);
                    setOpen(false);
                } else {
                    toast.error(res.error || "Failed to update");
                }
            }
        } catch (err) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{mode === "create" ? "Add Client" : "Edit Client"}</DialogTitle>
                    <DialogDescription>
                        Set up the brand voice and context for this client.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Client Name</Label>
                        <Input required value={name} onChange={e => setName(e.target.value)} placeholder="Acme Corp" />
                    </div>
                    <div className="space-y-2">
                        <Label>Niche / Industry</Label>
                        <Input value={niche} onChange={e => setNiche(e.target.value)} placeholder="e.g. SaaS, Fitness, Finance" />
                    </div>
                    <div className="space-y-2">
                        <Label>Brand Bio</Label>
                        <Textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Short description of the brand..." />
                    </div>
                    <div className="space-y-2">
                        <Label>Tone of Voice</Label>
                        <Input value={tone} onChange={e => setTone(e.target.value)} placeholder="e.g. Professional, Witty, Authoritative" />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save Profile"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
