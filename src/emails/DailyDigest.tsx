import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Tailwind,
    Hr,
} from "@react-email/components";
import * as React from "react";

interface PostDraft {
    id: string;
    content: string;
    platform: string;
    topic: string;
}

interface DailyDigestEmailProps {
    userFirstname: string;
    posts: PostDraft[];
    approvalLink: string;
}

export const DailyDigestEmail = ({
    userFirstname,
    posts,
    approvalLink,
}: DailyDigestEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Your daily social media posts are ready for review!</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            Micropost AI Daily Digest
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Hello {userFirstname},
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Here are your generated drafts for today. Please review and approve them to get them scheduled!
                        </Text>

                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

                        {posts.map((post) => (
                            <Section key={post.id} className="mb-6 p-4 border border-gray-200 rounded-lg">
                                <Text className="text-[#666666] text-[12px] uppercase font-bold tracking-wider mb-2">
                                    {post.platform} • {post.topic}
                                </Text>
                                <Text className="text-black text-[15px] leading-[22px] mb-4 font-medium bg-gray-50 p-3 rounded">
                                    "{post.content}"
                                </Text>
                            </Section>
                        ))}

                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href={approvalLink}
                            >
                                Review & Approve All
                            </Button>
                        </Section>
                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            If you take no action, these posts will <strong>not</strong> be published.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default DailyDigestEmail;
