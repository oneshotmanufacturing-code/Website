import React from "react";

export default function MapEmbed() {
  // AVS Layout, Ejipura, Koramangala 4th Block, Bengaluru, Karnataka - 560095
  const embedSrc =
    "https://maps.google.com/maps?q=AVS+Layout+Ejipura+Koramangala+4th+Block+Bengaluru+Karnataka+560095&output=embed&z=15";

  return (
    <div className="relative rounded-2xl overflow-hidden border border-border-subtle">
      <iframe
        src={embedSrc}
        width="100%"
        height="380"
        style={{
          border: 0,
          filter:
            "invert(90%) hue-rotate(180deg) brightness(0.88) contrast(1.1)",
        }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="OneShot Manufacturing — AVS Layout, Bengaluru"
        className="w-full"
      />
      {/* View on Google Maps link */}
      <div className="absolute bottom-4 right-4">
        <a
          href="https://maps.app.goo.gl/1WyyRTztDgSzYjEw8"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-primary/90 backdrop-blur border border-border-subtle text-xs font-medium text-accent-primary hover:bg-accent-primary/10 transition-colors"
        >
          Open in Google Maps ↗
        </a>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-bg-secondary to-transparent pointer-events-none" />
    </div>
  );
}
