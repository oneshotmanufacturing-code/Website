import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#161B22", // bg-bg-tertiary roughly
          color: "#D4A847", // accent-primary gold color
          fontWeight: 800,
          fontSize: 16,
          fontFamily: "system-ui, sans-serif",
          borderRadius: "50%",
          letterSpacing: "-0.5px",
        }}
      >
        MP
      </div>
    ),
    { ...size }
  );
}
