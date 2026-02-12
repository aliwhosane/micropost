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
                    color: "white",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "20px",
                    }}
                >
                    {/* Logo Icon */}
                    <svg
                        viewBox="0 0 100 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ width: "120px", height: "120px", marginRight: "20px" }}
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
                            background: "linear-gradient(to bottom right, #ffffff, #94a3b8)",
                            backgroundClip: "text",
                            color: "transparent",
                        }}
                    >
                        {siteConfig.name}
                    </div>
                </div>
                <div
                    style={{
                        fontSize: 32,
                        color: "#94a3b8", // Slate-400
                        textAlign: "center",
                        maxWidth: "80%",
                        lineHeight: 1.4,
                    }}
                >
                    {siteConfig.description}
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
