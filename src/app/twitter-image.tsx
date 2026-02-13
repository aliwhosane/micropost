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
                    backgroundImage: "radial-gradient(circle at 80% 80%, #1e293b 0%, #020617 50%)",
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
                    backgroundSize: '60px 60px',
                    opacity: 0.1,
                    zIndex: -1
                }} />

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "30px",
                    }}
                >
                    {/* Logo Icon */}
                    <svg
                        viewBox="0 0 100 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ width: "80px", height: "80px", marginRight: "20px" }}
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
                            fontSize: 70,
                            fontWeight: 900,
                            color: "white",
                            letterSpacing: '-0.05em',
                            display: 'flex'
                        }}
                    >
                        Micropost
                        <span style={{ color: '#3b82f6', marginLeft: '5px' }}>AI</span>
                    </div>
                </div>

                <div
                    style={{
                        fontSize: 52,
                        fontWeight: 800,
                        textAlign: "center",
                        maxWidth: "90%",
                        lineHeight: 1.1,
                        background: "linear-gradient(to bottom right, #60a5fa, #3b82f6)",
                        backgroundClip: "text",
                        color: "transparent",
                        marginBottom: "20px"
                    }}
                >
                    Consistent Viral Content.
                </div>

                <div
                    style={{
                        fontSize: 30,
                        color: "#cbd5e1", // Slate-300
                        textAlign: "center",
                        maxWidth: "80%",
                        lineHeight: 1.4,
                    }}
                >
                    The daily workflow for top creators on LinkedIn & X.
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
