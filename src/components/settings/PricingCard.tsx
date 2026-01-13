"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Check, Star, Zap } from "lucide-react";
import { createCheckout } from "@/lib/polar-actions";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type PricingCardProps = {
    name: string;
    price: string;
    description: string;
    features: string[];
    buttonText: string;
    productId: string;
    isPopular?: boolean;
    isActive?: boolean;
};

export function PricingCard({ name, price, description, features, buttonText, productId, isPopular, isActive }: PricingCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="h-full"
        >
            <Card className={cn(
                "flex flex-col h-full relative overflow-hidden transition-all duration-300 border-2",
                isActive
                    ? "border-primary bg-surface-container-high shadow-xl ring-2 ring-primary/20 ring-offset-2 ring-offset-background"
                    : isPopular
                        ? "border-primary/50 shadow-lg bg-surface-container"
                        : "border-transparent bg-surface-container-low hover:border-outline-variant/30"
            )}>

                {isPopular && !isActive && (
                    <div className="absolute top-0 right-0 p-0 z-10">
                        <div className="bg-gradient-to-bl from-primary to-tertiary text-on-primary text-[10px] font-bold px-3 py-1.5 rounded-bl-xl shadow-sm flex items-center gap-1 uppercase tracking-wider">
                            <Star className="w-3 h-3 fill-current" /> Popular
                        </div>
                    </div>
                )}

                {isActive && (
                    <div className="absolute top-0 right-0 p-0 z-10">
                        <div className="bg-green-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-xl shadow-sm flex items-center gap-1 uppercase tracking-wider">
                            <Check className="w-3 h-3" strokeWidth={3} /> Current Plan
                        </div>
                    </div>
                )}

                <CardHeader className="pb-4 relative">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-xl font-bold tracking-tight mb-1">{name}</CardTitle>
                            <CardDescription className="text-on-surface-variant/80 text-sm leading-relaxed">{description}</CardDescription>
                        </div>
                        {isActive ? <div className="p-2 rounded-full bg-green-500/10 text-green-500"><Check className="h-6 w-6" /></div> : <div className="p-2 rounded-full bg-primary/5 text-primary"><Zap className="h-6 w-6" /></div>}
                    </div>

                    <div className="mt-6 flex items-baseline">
                        <span className="text-4xl font-extrabold text-on-surface tracking-tight">{price}</span>
                        {price !== "Free" && price !== "$XXX" && !price.includes("Pay") && !price.includes("$999") && <span className="text-muted-foreground ml-1 font-medium">/mo</span>}
                    </div>
                </CardHeader>
                <CardContent className="flex-1">
                    <div className="w-full h-px bg-outline-variant/10 mb-6"></div>
                    <ul className="space-y-3">
                        {features.map((feature, i) => (
                            <motion.li
                                key={feature}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-start text-sm group"
                            >
                                <div className={cn("mt-0.5 mr-3 flex-shrink-0 rounded-full p-0.5", isActive ? "bg-green-500/10 text-green-500" : "bg-primary/10 text-primary")}>
                                    <Check className="h-3 w-3" strokeWidth={3} />
                                </div>
                                <span className="text-on-surface/80 group-hover:text-on-surface transition-colors">{feature}</span>
                            </motion.li>
                        ))}
                    </ul>
                </CardContent>
                <CardFooter className="pt-4 pb-6">
                    {isActive ? (
                        <Button
                            className="w-full font-semibold shadow-none cursor-default bg-green-500/10 text-green-600 hover:bg-green-500/20"
                            variant="filled"
                            size="lg"
                        >
                            Active Plan
                        </Button>
                    ) : (
                        <form action={() => createCheckout(productId)} className="w-full">
                            <Button
                                className={cn("w-full font-semibold shadow-sm", isPopular ? "shadow-primary/20" : "")}
                                variant={isPopular ? "filled" : "outlined"}
                                size="lg"
                            >
                                {buttonText}
                            </Button>
                        </form>
                    )}
                </CardFooter>
            </Card>
        </motion.div>
    );
}
