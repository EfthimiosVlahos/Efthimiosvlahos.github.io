import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const dynamic = "force-static";
export const alt = `${profile.name}, applied AI engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Share card for LinkedIn, Slack and iMessage previews, in the site's navy and blue. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "radial-gradient(circle at 30% 20%, #23305e 0%, #16162a 55%)",
          color: "#f3f4f6",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              background: "linear-gradient(135deg, #3b82f6, #a78bfa)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            EV
          </div>
          <div style={{ fontSize: 26, color: "#a1a8b8" }}>evlahos.netlify.app</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 800, letterSpacing: -2 }}>{profile.name}</div>
          <div style={{ fontSize: 36, color: "#60a5fa", marginTop: 12 }}>Applied AI engineer</div>
          <div style={{ fontSize: 30, color: "#cbd2de", marginTop: 28, maxWidth: 980, lineHeight: 1.35 }}>{profile.headline}</div>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 24, color: "#a1a8b8" }}>
          {["LLM agents", "Evals", "Document AI", "MLOps"].map((t) => (
            <div key={t} style={{ padding: "8px 18px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.15)" }}>
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
