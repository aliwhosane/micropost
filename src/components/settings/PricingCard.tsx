"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Check, Star } from "lucide-react";
import { createCheckout } from "@/lib/polar-actions";
import { motion } from "framer-motion";

type PricingCardProps = {
    name: string;
    price: string;
    description: string;
    features: string[];
    buttonText: string;
    productId: string;
    isPopular?: boolean;
};

export function PricingCard({ name, price, description, features, buttonText, productId, isPopular }: PricingCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="h-full"
        >
            <Card className={`flex flex-col h-full relative overflow-hidden border-2 transition-all duration-300 ${isPopular ? "border-primary shadow-xl bg-surface-container-high" : "border-transparent bg-surface-container-low hover:border-outline-variant"}`}>

                {isPopular && (
                    <div className="absolute top-0 right-0 p-0">
                        <div className="bg-primary text-on-primary text-xs font-bold px-3 py-1 rounded-bl-xl shadow-sm flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" /> Popular
                        </div>
                    </div>
                )}

                <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold tracking-tight">{name}</CardTitle>
                    <CardDescription className="text-on-surface-variant/80">{description}</CardDescription>
                    <div className="mt-4 flex items-baseline">
                        <span className="text-4xl font-extrabold text-on-surface">{price}</span>
                        {price !== "Free" && price !== "$XXX" && !price.includes("Pay") && <span className="text-muted-foreground ml-1">/month</span>}
                    </div>
                </CardHeader>
                <CardContent className="flex-1">
                    <div className="w-full h-px bg-outline-variant/20 mb-6"></div>
                    <ul className="space-y-3">
                        {features.map((feature, i) => (
                            <motion.li
                                key={feature}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-start text-sm group"
                            >
                                <div className={`mt-0.5 mr-3 flex-shrink-0 rounded-full p-0.5 ${isPopular ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"}`}>
                                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                                </div>
                                <span className="text-on-surface/90 group-hover:text-primary transition-colors">{feature}</span>
                            </motion.li>
                        ))}
                    </ul>
                </CardContent>
                <CardFooter className="pt-4">
                    <form action={() => createCheckout(productId)} className="w-full">
                        <Button
                            className="w-full font-semibold shadow-sm"
                            variant={isPopular ? "filled" : "outlined"}
                            size="lg"
                        >
                            {buttonText}
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
