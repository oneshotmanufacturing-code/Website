"use client";

import React, { useState } from "react";
import { COMPANY } from "@/lib/constants";

const MESSAGE = encodeURIComponent(
  "Hi, I have some inquiries. Can we connect or set up a meeting?"
);
const WA_URL = `https://wa.me/${COMPANY.whatsappNumber}?text=${MESSAGE}`;

export default function WhatsAppFloat() {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "fixed",
        bottom: "28px",
        right: "28px",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "10px",
        background: "#25D366",
        borderRadius: "50px",
        padding: hovered ? "14px 20px 14px 16px" : "14px",
        boxShadow: hovered
          ? "0 8px 30px rgba(37,211,102,0.55)"
          : "0 4px 18px rgba(37,211,102,0.4)",
        textDecoration: "none",
        transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
        transform: hovered ? "scale(1.07)" : "scale(1)",
        overflow: "hidden",
        maxWidth: hovered ? "220px" : "52px",
      }}
    >
      {/* WhatsApp SVG icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width="26"
        height="26"
        fill="#FFFFFF"
        style={{ flexShrink: 0 }}
      >
        <path d="M16.003 2.667C8.639 2.667 2.667 8.638 2.667 16c0 2.37.635 4.688 1.84 6.714L2.667 29.333l6.828-1.793A13.28 13.28 0 0016.003 29.333C23.364 29.333 29.333 23.362 29.333 16S23.364 2.667 16.003 2.667zm0 24.267a11.007 11.007 0 01-5.627-1.55l-.403-.24-4.053 1.065 1.082-3.95-.264-.417A10.98 10.98 0 015.002 16c0-6.065 4.937-11 11.001-11S27.004 9.935 27.004 16 22.068 26.934 16.003 26.934zm6.04-8.232c-.33-.165-1.953-.964-2.257-1.074-.303-.11-.524-.165-.745.165-.22.33-.854 1.074-1.046 1.295-.193.22-.386.247-.716.082-.33-.165-1.393-.513-2.653-1.638-.98-.874-1.643-1.953-1.835-2.283-.193-.33-.02-.509.145-.673.149-.148.33-.386.495-.579.165-.193.22-.33.33-.55.11-.22.055-.413-.027-.579-.082-.165-.745-1.797-1.02-2.46-.269-.646-.541-.558-.745-.568l-.634-.011c-.22 0-.579.082-.882.413s-1.158 1.132-1.158 2.764 1.185 3.207 1.35 3.427c.165.22 2.333 3.563 5.654 4.997.79.341 1.406.545 1.886.698.793.252 1.515.216 2.086.131.636-.095 1.953-.799 2.228-1.57.276-.771.276-1.432.193-1.57-.082-.138-.303-.22-.634-.385z" />
      </svg>

      {/* Label — expands on hover */}
      <span
        style={{
          color: "#FFFFFF",
          fontSize: "13px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          whiteSpace: "nowrap",
          opacity: hovered ? 1 : 0,
          maxWidth: hovered ? "160px" : "0px",
          overflow: "hidden",
          transition: "opacity 0.2s ease 0.05s, max-width 0.25s ease",
        }}
      >
        Chat on WhatsApp
      </span>
    </a>
  );
}
