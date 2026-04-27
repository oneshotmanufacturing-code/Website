"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof typeof formData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};
    if (!formData.name.trim()) newErrors.name = "Full Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.from("contact_submissions").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        message: formData.message,
      });

      if (error) {
        throw error;
      }

      setIsSuccess(true);
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" style={{ display: "flex", flexWrap: "wrap", minHeight: "100vh" }}>
      {/* Left Panel: Info (White Background) */}
      <div
        style={{
          flex: "1 1 50%",
          background: "#FFFFFF",
          padding: "80px 10%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div style={{ maxWidth: "500px" }}>
          <span
            style={{
              display: "inline-block",
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#F7941D",
              marginBottom: "12px",
            }}
          >
            CONTACT
          </span>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#0F1D3F",
              lineHeight: 1.15,
              marginBottom: "48px",
            }}
          >
            GET IN TOUCH
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <MapPin size={24} color="#F7941D" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#0F1D3F", marginBottom: "4px" }}>Address</h4>
                <p style={{ fontSize: "14px", color: "#555555", lineHeight: 1.6 }}>
                  L140, MIDC, Ahilyanagar<br />
                  Maharashtra, India - 414111
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <Phone size={24} color="#F7941D" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#0F1D3F", marginBottom: "4px" }}>Phone</h4>
                <p style={{ fontSize: "14px", color: "#555555", lineHeight: 1.6 }}>+91 95884 46409</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <Mail size={24} color="#F7941D" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#0F1D3F", marginBottom: "4px" }}>Email</h4>
                <p style={{ fontSize: "14px", color: "#555555", lineHeight: 1.6 }}>info@oneshotmanufacturing.com</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <Clock size={24} color="#F7941D" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#0F1D3F", marginBottom: "4px" }}>Hours</h4>
                <p style={{ fontSize: "14px", color: "#555555", lineHeight: 1.6 }}>Monday – Saturday<br />9:00 AM – 6:00 PM IST</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Form (Navy Background) */}
      <div
        style={{
          flex: "1 1 50%",
          background: "#0F1D3F",
          padding: "80px 10%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div style={{ maxWidth: "500px", width: "100%" }}>
          {isSuccess ? (
            <div style={{ textAlign: "center", color: "#FFFFFF" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "#F7941D",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "16px" }}>Message Sent</h3>
              <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
                Thank you for reaching out. Our team will get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                    Full Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      background: "#FFFFFF",
                      border: "1px solid #E0E0E0",
                      borderRadius: "4px",
                      padding: "12px 16px",
                      fontSize: "14px",
                      color: "#1A1A1A",
                      outline: "none",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                      borderColor: errors.name ? "#ef4444" : "#E0E0E0",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#F7941D";
                      e.target.style.boxShadow = "0 0 0 2px rgba(247,148,29,0.2)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.name ? "#ef4444" : "#E0E0E0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  {errors.name && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors.name}</p>}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                    Email*
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      background: "#FFFFFF",
                      border: "1px solid #E0E0E0",
                      borderRadius: "4px",
                      padding: "12px 16px",
                      fontSize: "14px",
                      color: "#1A1A1A",
                      outline: "none",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                      borderColor: errors.email ? "#ef4444" : "#E0E0E0",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#F7941D";
                      e.target.style.boxShadow = "0 0 0 2px rgba(247,148,29,0.2)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.email ? "#ef4444" : "#E0E0E0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  {errors.email && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors.email}</p>}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                    Phone*
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      background: "#FFFFFF",
                      border: "1px solid #E0E0E0",
                      borderRadius: "4px",
                      padding: "12px 16px",
                      fontSize: "14px",
                      color: "#1A1A1A",
                      outline: "none",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                      borderColor: errors.phone ? "#ef4444" : "#E0E0E0",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#F7941D";
                      e.target.style.boxShadow = "0 0 0 2px rgba(247,148,29,0.2)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.phone ? "#ef4444" : "#E0E0E0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  {errors.phone && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors.phone}</p>}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      background: "#FFFFFF",
                      border: "1px solid #E0E0E0",
                      borderRadius: "4px",
                      padding: "12px 16px",
                      fontSize: "14px",
                      color: "#1A1A1A",
                      outline: "none",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#F7941D";
                      e.target.style.boxShadow = "0 0 0 2px rgba(247,148,29,0.2)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#E0E0E0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                  Message*
                </label>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    background: "#FFFFFF",
                    border: "1px solid #E0E0E0",
                    borderRadius: "4px",
                    padding: "12px 16px",
                    fontSize: "14px",
                    color: "#1A1A1A",
                    outline: "none",
                    resize: "none",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    borderColor: errors.message ? "#ef4444" : "#E0E0E0",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#F7941D";
                    e.target.style.boxShadow = "0 0 0 2px rgba(247,148,29,0.2)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.message ? "#ef4444" : "#E0E0E0";
                    e.target.style.boxShadow = "none";
                  }}
                />
                {errors.message && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  background: "#F7941D",
                  color: "#FFFFFF",
                  fontSize: "13px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  padding: "14px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  marginTop: "8px",
                  opacity: isSubmitting ? 0.7 : 1,
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) (e.currentTarget as HTMLButtonElement).style.background = "#E08319";
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) (e.currentTarget as HTMLButtonElement).style.background = "#F7941D";
                }}
              >
                {isSubmitting ? "SENDING..." : "SEND MESSAGE →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
