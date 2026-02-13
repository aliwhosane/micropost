import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const runtime = "edge";

export const alt = siteConfig.name;
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#020617", // Slate-950
                    backgroundImage: "radial-gradient(circle at 25% 25%, #1e293b 0%, #020617 50%)",
                    color: "white",
                    fontFamily: '"Inter", sans-serif',
                }}
            >
                {/* Background Grid (Simulated) */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    opacity: 0.1,
                    zIndex: -1
                }} />

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "40px",
                    }}
                >
                    {/* Logo Icon */}
                    <svg
                        viewBox="0 0 100 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ width: "100px", height: "100px", marginRight: "30px" }}
                    >
                        <path
                            d="M20 80V20L50 50L80 20V80"
                            stroke="#3b82f6"
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <div
                        style={{
                            fontSize: 80,
                            fontWeight: 900,
                            letterSpacing: '-0.05em',
                            color: "white",
                            display: 'flex'
                        }}
                    >
                        Micropost
                        <span style={{ color: '#3b82f6', marginLeft: '10px' }}>AI</span>
                    </div>
                </div>

                <div
                    style={{
                        fontSize: 48,
                        fontWeight: 700,
                        textAlign: "center",
                        maxWidth: "80%",
                        lineHeight: 1.1,
                        background: "linear-gradient(to bottom right, #ffffff, #94a3b8)",
                        backgroundClip: "text",
                        color: "transparent",
                        marginBottom: "20px"
                    }}
                >
                    The Viral Content Engine
                </div>

                <div
                    style={{
                        fontSize: 28,
                        color: "#94a3b8", // Slate-400
                        textAlign: "center",
                        maxWidth: "70%",
                        lineHeight: 1.5,
                        marginBottom: "40px"
                    }}
                >
                    AI Ghostwriter • Viral Frameworks • Image Gen
                </div>

                {/* Badge */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 24px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '50px',
                    color: '#60a5fa',
                    fontSize: 24,
                    fontWeight: 600
                }}>
                    Start for Free • No Credit Card Required
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
