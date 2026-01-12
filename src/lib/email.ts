import { Resend } from 'resend';
import { DailyDigestEmail } from '@/emails/DailyDigest';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface SendDigestParams {
    email: string;
    name: string;
    posts: {
        id: string;
        content: string;
        platform: string;
        topic: string;
    }[];
    approvalUrl: string;
}

export async function sendDailyDigest({ email, name, posts, approvalUrl }: SendDigestParams) {
    if (!resend) {
        console.warn("Missing RESEND_API_KEY. Email sending skipped.");
        console.log("Mock Email to:", email);
        console.log("Approval Link:", approvalUrl);
        return { success: true, mock: true };
    }

    try {
        const data = await resend.emails.send({
            from: 'Micropost AI <onboarding@resend.dev>', // Update this with verified domain later
            to: email,
            subject: 'Your Daily Social Media Drafts',
            react: DailyDigestEmail({
                userFirstname: name,
                posts,
                approvalLink: approvalUrl,
            }),
        });
        return { success: true, data };
    } catch (error) {
        console.error("Failed to send email:", error);
        return { success: false, error };
    }
}
