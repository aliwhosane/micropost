"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Wand2, Download, Image as ImageIcon, Type, ChevronLeft, ChevronRight } from "lucide-react";
import { createCarouselAction } from "@/app/actions/carousel";
import { uploadImageAction } from "@/app/actions/upload";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

export function CarouselWizard() {
    const [step, setStep] = useState<"TOPIC" | "EDIT" | "PREVIEW">("TOPIC");
    const [topic, setTopic] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    // Placeholder for slides
    const [slides, setSlides] = useState<Array<{ title: string; content: string; bgImage?: string }>>([
        { title: "Your Big Title", content: "Subtitle or hook goes here." },
        { title: "Point One", content: "Explain the first big idea." },
        { title: "Point Two", content: "Explain the second big idea." },
        { title: "Summary", content: "Follow for more tips!" },
    ]);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const result = await createCarouselAction(topic);
            if (result.success && result.slides) {
                setSlides(result.slides);
                setStep("EDIT");
                setCurrentSlideIndex(0);
                toast.success("Carousel generated!");
            } else {
                toast.error("Failed to generate content. Try again.");
            }
        } catch (e) {
            toast.error("Something went wrong.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleExportPDF = async () => {
        setIsExporting(true);
        const element = document.getElementById('carousel-preview');
        if (!element) return;

        try {
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [1080, 1350] // Common carousel format (4:5 aspect ratio)
            });

            // We need to render EACH slide visuals. 
            // Since we only show one at a time in preview, we need a trick.
            // Option: Render hidden divs for all slides or iterate and update state (flashy).
            // Better: Render a hidden container with ALL slides and capture that.

            // Creating a temporary container for rendering all slides
            const hiddenContainer = document.createElement('div');
            hiddenContainer.style.position = 'absolute';
            hiddenContainer.style.top = '-9999px';
            hiddenContainer.style.left = '-9999px';
            hiddenContainer.style.width = '1080px'; // High res width

            // Loop and create slide elements
            slides.forEach((slide, i) => {
                const slideDiv = document.createElement('div');
                slideDiv.style.width = '1080px';
                slideDiv.style.height = '1350px';
                slideDiv.style.backgroundColor = 'white';
                slideDiv.style.padding = '80px';
                slideDiv.style.display = 'flex';
                slideDiv.style.flexDirection = 'column';
                slideDiv.style.justifyContent = 'center';
                slideDiv.style.alignItems = 'flex-start'; // Align left usually looks better for text
                slideDiv.style.fontFamily = 'Inter, sans-serif';
                slideDiv.style.border = '1px solid #f0f0f0'; // Subtle border

                // Content
                slideDiv.innerHTML = `
                    <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; width: 100%;">
                        <h1 style="font-size: ${i === 0 ? '90px' : '70px'}; font-weight: 800; color: #111; margin-bottom: 40px; line-height: 1.1;">${slide.title}</h1>
                        <p style="font-size: 40px; color: #444; line-height: 1.4;">${slide.content}</p>
                    </div>
                    <div style="margin-top: auto; padding-top: 40px; border-top: 2px solid #eee; width: 100%; display: flex; justify-content: space-between; align-items: center; color: #888; font-size: 24px;">
                        <span>@YourHandle</span>
                        <span>${i + 1}/${slides.length}</span>
                    </div>
                `;
                hiddenContainer.appendChild(slideDiv);
            });

            document.body.appendChild(hiddenContainer);

            // Capture each slide
            const slideNodes = Array.from(hiddenContainer.children) as HTMLElement[];

            for (let i = 0; i < slideNodes.length; i++) {
                if (i > 0) pdf.addPage();

                const canvas = await html2canvas(slideNodes[i], {
                    scale: 2, // 2x scale for crisp text
                    useCORS: true,
                    logging: false
                });

                const imgData = canvas.toDataURL('image/jpeg', 1.0);
                pdf.addImage(imgData, 'JPEG', 0, 0, 1080, 1350);
            }

            pdf.save(`${topic.substring(0, 20) || "carousel"}.pdf`);
            document.body.removeChild(hiddenContainer);
            toast.success("PDF Downloaded!");

        } catch (e) {
            console.error(e);
            toast.error("Export failed.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header / Stepper */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-on-surface">Carousel Generator</h2>
                <div className="flex gap-2">
                    <Button variant="outlined" disabled={step === "TOPIC"} onClick={() => setStep("TOPIC")} size="sm">
                        Topic
                    </Button>
                    <Button variant="outlined" disabled={step !== "EDIT" && step !== "PREVIEW"} onClick={() => setStep("EDIT")} size="sm">
                        Edit
                    </Button>
                    <Button
                        variant="filled"
                        disabled={step !== "EDIT" || isExporting}
                        onClick={handleExportPDF}
                        className="bg-primary text-on-primary"
                    >
                        {isExporting ? <span className="animate-pulse">Exporting...</span> : <><Download className="w-4 h-4 mr-2" /> Export PDF</>}
                    </Button>
                </div>
            </div>

            {/* STEP 1: TOPIC */}
            {step === "TOPIC" && (
                <Card className="max-w-2xl mx-auto mt-12 shadow-lg">
                    <CardContent className="p-10 space-y-8">
                        <div className="space-y-2 text-center">
                            <h3 className="text-2xl font-bold text-on-surface">What is this carousel about?</h3>
                            <p className="text-on-surface-variant text-lg">Enter a topic and AI will outline the slides.</p>
                        </div>
                        <div className="space-y-6">
                            <Input
                                placeholder="e.g. 7 ways to scale your agency..."
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="text-lg p-6 h-16 rounded-2xl bg-surface-variant/30 border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium placeholder:text-on-surface-variant/50"
                            />
                            <Button
                                className="w-full text-lg h-16 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all font-bold"
                                variant="filled"
                                onClick={handleGenerate}
                                disabled={!topic || isGenerating}
                            >
                                {isGenerating ? (
                                    <>
                                        <Wand2 className="mr-2 h-6 w-6 animate-spin" /> Generating Magic...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="mr-2 h-6 w-6" /> Generate Carousel
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* STEP 2: EDITOR */}
            {step === "EDIT" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:h-[700px]">
                    {/* Sidebar: Controls */}
                    <Card className="lg:col-span-4 h-full flex flex-col overflow-hidden border-outline-variant/10 shadow-sm">
                        <div className="p-5 border-b border-outline-variant/10 font-bold text-on-surface flex justify-between items-center bg-surface-variant/30">
                            <span>Slides</span>
                            <span className="text-xs font-normal text-on-surface-variant bg-surface px-2 py-1 rounded-full">{slides.length} cards</span>
                        </div>
                        <CardContent className="p-4 space-y-3 overflow-y-auto flex-1 custom-scrollbar bg-surface/50">
                            {slides.map((slide, i) => (
                                <div
                                    key={i}
                                    onClick={() => setCurrentSlideIndex(i)}
                                    className={`p-4 rounded-2xl cursor-pointer transition-all border-2 ${currentSlideIndex === i
                                        ? 'border-primary bg-primary/5 shadow-sm'
                                        : 'border-transparent bg-surface hover:bg-surface-variant/50'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`font-bold text-xs uppercase tracking-wider ${currentSlideIndex === i ? 'text-primary' : 'text-on-surface-variant'}`}>Slide {i + 1}</span>
                                        {currentSlideIndex === i && <div className="w-2 h-2 rounded-full bg-primary" />}
                                    </div>
                                    <Input
                                        value={slide.title}
                                        onChange={(e) => {
                                            const newSlides = [...slides];
                                            newSlides[i].title = e.target.value;
                                            setSlides(newSlides);
                                        }}
                                        className="mb-2 font-bold text-sm border-none shadow-none p-0 h-auto focus-visible:ring-0 bg-transparent placeholder:text-on-surface-variant/30"
                                        placeholder="Title"
                                    />
                                    <textarea
                                        value={slide.content}
                                        onChange={(e) => {
                                            const newSlides = [...slides];
                                            newSlides[i].content = e.target.value;
                                            setSlides(newSlides);
                                        }}
                                        className="w-full text-xs text-on-surface-variant bg-transparent resize-none focus:outline-none placeholder:text-on-surface-variant/30"
                                        rows={2}
                                        placeholder="Content..."
                                    />
                                </div>
                            ))}
                            <Button variant="outlined" size="sm" className="w-full border-dashed border-outline-variant/40 hover:border-primary hover:text-primary hover:bg-primary/5 rounded-xl h-12" onClick={() => setSlides([...slides, { title: "New Slide", content: "Content..." }])}>
                                + Add Slide
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Main: Preview */}
                    <div className="lg:col-span-8 bg-surface-variant/20 rounded-[2.5rem] border border-outline-variant/10 flex flex-col items-center justify-center p-8 relative overflow-hidden">
                        {/* Soft Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

                        {/* Navigation */}
                        <div className="absolute top-1/2 left-4 -translate-y-1/2 z-10">
                            <Button
                                variant="outlined"
                                size="icon"
                                className="rounded-full bg-surface shadow-md border-none"
                                disabled={currentSlideIndex === 0}
                                onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </Button>
                        </div>
                        <div className="absolute top-1/2 right-4 -translate-y-1/2 z-10">
                            <Button
                                variant="outlined"
                                size="icon"
                                className="rounded-full bg-surface shadow-md border-none"
                                disabled={currentSlideIndex === slides.length - 1}
                                onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* The Slide Canvas */}
                        <div
                            id="carousel-preview"
                            className="aspect-[4/5] h-[550px] bg-white text-black shadow-2xl rounded-sm flex flex-col p-10 relative overflow-hidden transition-all duration-300"
                            style={{
                                backgroundImage: slides[currentSlideIndex].bgImage ? `url(${slides[currentSlideIndex].bgImage})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        >
                            {/* Overlay for readability if image exists */}
                            {slides[currentSlideIndex].bgImage && (
                                <div className="absolute inset-0 bg-black/40 pointer-events-none" />
                            )}

                            <div className="flex-1 flex flex-col justify-center relative z-10">
                                <h1
                                    className="text-4xl font-extrabold mb-6 leading-tight break-words"
                                    style={{ color: slides[currentSlideIndex].bgImage ? 'white' : '#111' }}
                                >
                                    {slides[currentSlideIndex].title}
                                </h1>
                                <p
                                    className="text-xl leading-relaxed whitespace-pre-wrap"
                                    style={{ color: slides[currentSlideIndex].bgImage ? '#f0f0f0' : '#444' }}
                                >
                                    {slides[currentSlideIndex].content}
                                </p>
                            </div>

                            <div className="mt-auto pt-6 border-t border-gray-100/20 flex justify-between items-center text-sm font-medium relative z-10"
                                style={{ color: slides[currentSlideIndex].bgImage ? 'white' : '#888', borderColor: slides[currentSlideIndex].bgImage ? 'rgba(255,255,255,0.2)' : '#eee' }}
                            >
                                <div className="flex items-center gap-2">
                                    {/* Use a generic avatar or placeholder */}
                                    <div className="w-6 h-6 rounded-full bg-gray-200/50" />
                                    <span>@YourHandle</span>
                                </div>
                                <span>{currentSlideIndex + 1}/{slides.length}</span>
                            </div>
                        </div>

                        <div className="mt-8 text-sm text-on-surface-variant/70 flex gap-4">
                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        const formData = new FormData();
                                        formData.append("file", file);

                                        toast.promise(
                                            uploadImageAction(formData).then((res) => {
                                                if (res.success && res.url) {
                                                    const newSlides = [...slides];
                                                    newSlides[currentSlideIndex].bgImage = res.url;
                                                    setSlides(newSlides);
                                                    return "Background updated!";
                                                }
                                                throw new Error(res.error);
                                            }),
                                            {
                                                loading: 'Uploading...',
                                                success: 'Background updated!',
                                                error: 'Upload failed'
                                            }
                                        );
                                    }}
                                />
                                <div className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-surface-variant rounded-lg transition-colors border border-outline-variant/20">
                                    <ImageIcon className="w-4 h-4" />
                                    <span>Change Background</span>
                                </div>
                            </label>
                            <Button variant="ghost" size="sm" className="text-xs">
                                <Type className="w-3 h-3 mr-2" /> Font Settings (Soon)
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
