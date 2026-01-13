import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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
                        Privacy Policy
                    </h1>
                    <p className="text-[var(--md-sys-color-outline)] text-lg">
                        Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-12 text-[var(--md-sys-color-on-surface-variant)] leading-relaxed">

                    <section>
                        <h2 className="text-2xl font-semibold text-[var(--md-sys-color-on-surface)] mb-4">1. Introduction</h2>
                        <p>
                            Micropost AI ("we," "our," or "us") respects your privacy and is committed to protecting it through our compliance with this policy. This policy describes the types of information we may collect from you or that you may provide when you visit the website or use our services (collectively, "Services") and our practices for collecting, using, maintaining, protecting, and disclosing that information.
                        </p>
                    </section>

                    <section className="p-6 rounded-2xl bg-[var(--md-sys-color-primary-container)]/10 border border-[var(--md-sys-color-primary)]/20">
                        <h2 className="text-2xl font-semibold text-[var(--md-sys-color-primary)] mb-4">
                            2. Data Collection Rights
                        </h2>
                        <p className="mb-4">
                            We reserve the right to collect, store, and process a broad range of data to ensure the functionality and optimization of our Service. This includes, but is not limited to:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Personal Identification Information:</strong> Name, email address, phone number, and social media profile details provided during account creation.</li>
                            <li><strong>Usage Data:</strong> Information on how the Service is accessed and used, including clickstreams, interaction data, and feature usage patterns.</li>
                            <li><strong>Device & Technical Data:</strong> IP address, browser type, operating system version, unique device identifiers, and network information.</li>
                            <li><strong>Generated Content:</strong> All content, text, and media generated through our AI tools may be stored and analyzed to improve our models.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[var(--md-sys-color-on-surface)] mb-4">3. Data Usage</h2>
                        <p>
                            By using our Service, you explicitly grant us the right to use your data for the following purposes:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mt-4">
                            <li>To provide, operate, and maintain our Service.</li>
                            <li>To improve, personalize, and expand our Service, including training our AI models.</li>
                            <li>To understand and analyze how you use our Service.</li>
                            <li>To develop new products, services, features, and functionality.</li>
                            <li>To communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the Service, and for marketing and promotional purposes.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[var(--md-sys-color-on-surface)] mb-4">4. Third-Party Sharing</h2>
                        <p>
                            We acknowledge and you agree that we may share your information with:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mt-4">
                            <li><strong>Service Providers:</strong> Third-party companies and individuals that facilitate our Service (e.g., payment processors like Polar.sh, cloud providers, AI service providers).</li>
                            <li><strong>Business Partners:</strong> Affiliates and partners for marketing and promotional purposes.</li>
                            <li><strong>Legal Obligations:</strong> When required by law or in response to valid requests by public authorities (e.g., a court or a government agency).</li>
                            <li><strong>Business Transfers:</strong> In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[var(--md-sys-color-on-surface)] mb-4">5. Security of Data</h2>
                        <p>
                            The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security. By using the Service, you acknowledge this risk and release us from liability for any data breach to the fullest extent permitted by law.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[var(--md-sys-color-on-surface)] mb-4">6. Cookies and Tracking Technologies</h2>
                        <p>
                            We use cookies and similar tracking technologies to track the activity on our Service and store certain information. Tracking technologies used are beacons, tags, and scripts to collect and track information and to improve and analyze our Service. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some parts of our Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[var(--md-sys-color-on-surface)] mb-4">7. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us via the support channels tailored within the application.
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
