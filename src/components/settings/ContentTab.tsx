"use client";

import { updatePreferences } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/Card";
import { FormSlider } from "@/components/settings/FormSlider";
import { Twitter, Linkedin, AtSign, Save, AlertCircle, Wand2 } from "lucide-react";

interface ContentTabProps {
    twitterPostsPerDay: number;
    linkedinPostsPerDay: number;
    threadsPostsPerDay: number;
    postsPerDay: number;
}

export function ContentTab({
    twitterPostsPerDay,
    linkedinPostsPerDay,
    threadsPostsPerDay,
    postsPerDay,
}: ContentTabProps) {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <Wand2 className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-on-surface">
                        Content Configuration
                    </h3>
                    <p className="text-sm text-on-surface-variant">
                        Control how often the AI writes for each platform.
                    </p>
                </div>
            </div>

            {/* Sliders form */}
            <form action={updatePreferences}>
                <Card className="overflow-hidden border-outline-variant/30 shadow-sm bg-surface">
                    <CardHeader className="border-b border-outline-variant/10 pb-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-lg">Ghostwriter Preferences</CardTitle>
                                <CardDescription className="mt-1">
                                    Control how often and consistently the AI writes for you.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-10 p-8">
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {/* Twitter Slider */}
                                <FormSlider
                                    name="twitterPostsPerDay"
                                    defaultValue={twitterPostsPerDay}
                                    max={10}
                                    step={1}
                                    label="Twitter / X"
                                    icon={<Twitter className="h-4 w-4 fill-current text-[#1DA1F2]" />}
                                    description="Maximum daily automated tweets."
                                />

                                {/* LinkedIn Slider */}
                                <FormSlider
                                    name="linkedinPostsPerDay"
                                    defaultValue={linkedinPostsPerDay}
                                    max={5}
                                    step={1}
                                    label="LinkedIn"
                                    icon={<Linkedin className="h-4 w-4 fill-current text-[#0077b5]" />}
                                    description="Maximum daily professional posts."
                                />

                                {/* Threads Slider */}
                                <FormSlider
                                    name="threadsPostsPerDay"
                                    defaultValue={threadsPostsPerDay}
                                    max={10}
                                    step={1}
                                    label="Threads"
                                    icon={<AtSign className="h-4 w-4 text-on-surface" />}
                                    description="Maximum daily threads."
                                />
                            </div>
                        </div>

                        <input type="hidden" name="postsPerDay" value={postsPerDay} />
                    </CardContent>

                    <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-variant/10 border-t border-outline-variant/10 p-6">
                        <div className="flex items-center text-xs text-on-surface-variant font-medium bg-primary/5 px-3 py-1.5 rounded-full text-primary">
                            <AlertCircle className="mr-2 h-3.5 w-3.5" />
                            Changes apply to the next generation cycle
                        </div>
                        <Button
                            type="submit"
                            variant="filled"
                            size="lg"
                            className="w-full sm:w-auto px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                        >
                            <Save className="mr-2 h-4 w-4" />
                            Save Preferences
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
