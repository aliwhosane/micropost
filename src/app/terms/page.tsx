import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[var(--md-sys-color-background)] text-[var(--md-sys-color-on-background)] font-sans">
            <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
                {/* Header */}
                <div className="mb-12">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm font-medium text-[var(--md-sys-color-secondary)] hover:text-[var(--md-sys-color-primary)] transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--md-sys-color-on-surface)] mb-4">
                        Terms and Conditions
                    </h1>
                    <p className="text-[var(--md-sys-color-outline)] text-lg">
                        Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-12 text-[var(--md-sys-color-on-surface-variant)] leading-relaxed">

                    <section>
                        <h2 className="text-2xl font-semibold text-[var(--md-sys-color-on-surface)] mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By accessing, browsing, or using the Micropost AI platform (the "Service"), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, you must importantly not use the Service.
                        </p>
                    </section>

                    <section className="p-6 rounded-2xl bg-[var(--md-sys-color-error-container)]/10 border border-[var(--md-sys-color-error)]/20">
                        <h2 className="text-2xl font-semibold text-[var(--md-sys-color-error)] mb-4 flex items-center gap-2">
                            2. Termination of Service & Lifetime Access
                        </h2>
                        <div className="space-y-4">
                            <p>
                                <strong>"Lifetime" Defined:</strong> Any reference to "Lifetime" access, sales, or subscriptions refers solely to the lifetime of the Service's active deployment or the lifetime of the specific version of the product you purchased, whichever is shorter. It does <u>not</u> refer to the lifetime of the purchaser.
                            </p>
                            <p>
                                <strong>Right to Terminate:</strong> We reserve the absolute, irrevocable right to terminate, suspend, or discontinue the Service, your account, or any "Lifetime" access plan at any time, for any reason or no reason, without prior notice or liability.
                            </p>
                            <p>
                                <strong>No Refunds:</strong> In the event of such termination or discontinuation, you agree that you constitute no right to a refund, partial or full, regardless of the time elapsed since purchase.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[var(--md-sys-color-on-surface)] mb-4">3. Modification of Features</h2>
                        <p>
                            The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We reserve the right to modify, update, remove, or deprecate any feature, functionality, or aspect of the Service at any time without notice. We make no guarantees that any specific feature will remain available or functional. You acknowledge that features may be added or removed at our sole discretion to align with our business goals.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[var(--md-sys-color-on-surface)] mb-4">4. Subscription Cancellation</h2>
                        <p>
                            We reserve the right to cancel your subscription, revoke your license, or block your access to the Service at any time, with or without cause. This includes, but is not limited to, violations of fair use policies, unauthorized sharing of accounts, or any behavior deemed determined by us to be detrimental to the Service or other users.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[var(--md-sys-color-on-surface)] mb-4">5. Limitation of Liability</h2>
                        <p>
                            To the maximum extent permitted by applicable law, Micropost AI, its affiliates, agents, directors, and employees shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, or goodwill, arising out of or in connection with your use or inability to use the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[var(--md-sys-color-on-surface)] mb-4">6. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify these Terms at any time. We will attempt to provide notice of significant changes, but it is your responsibility to review these Terms periodically. Your continued use of the Service after any modification constitutes your acceptance of the new Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[var(--md-sys-color-on-surface)] mb-4">7. Governing Law</h2>
                        <p>
                            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which the company is incorporated, without regard to its conflict of law provisions.
                        </p>
                    </section>

                </div>

                <div className="mt-20 pt-8 border-t border-[var(--md-sys-color-outline-variant)]">
                    <p className="text-sm text-[var(--md-sys-color-secondary)] text-center">
                        &copy; {new Date().getFullYear()} Micropost AI. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
