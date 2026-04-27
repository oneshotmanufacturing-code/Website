"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const SectionTag = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block text-[18px] font-bold uppercase tracking-[0.15em] text-red mb-4">
    {children}
  </span>
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-display text-3xl sm:text-5xl md:text-7xl leading-none text-white-text">
    {children}
  </h2>
);

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    file: null as File | null,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, file: e.target.files![0] }));
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
    <section id="contact" className="py-16 md:py-28 min-h-screen flex items-center">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <header className="flex flex-col items-start">
          <SectionTag>CONTACT</SectionTag>
          <SectionHeading>GET IN TOUCH</SectionHeading>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mt-14 rounded-lg overflow-hidden border border-dark-3 bg-white">
          
          {/* Left Panel: Info */}
          <div className="p-6 sm:p-10 md:p-12">
            <div>
              <div className="font-body text-[13px] sm:text-[16px] uppercase tracking-[0.12em] text-grey mb-1">
                ADDRESS
              </div>
              <div className="font-body text-[16px] sm:text-[22px] text-white-text mb-6">
                L140, MIDC, Ahilyanagar, Maharashtra, India - 414111
              </div>
            </div>
            <div>
              <div className="font-body text-[13px] sm:text-[16px] uppercase tracking-[0.12em] text-grey mb-1">
                PHONE
              </div>
              <div className="font-body text-[16px] sm:text-[22px] text-white-text mb-6">
                +91 95884 46409
              </div>
            </div>
            <div>
              <div className="font-body text-[13px] sm:text-[16px] uppercase tracking-[0.12em] text-grey mb-1">
                EMAIL
              </div>
              <div className="font-body text-[16px] sm:text-[22px] text-white-text mb-6 break-all">
                info@oneshotmanufacturing.com
              </div>
            </div>
            <div>
              <div className="font-body text-[13px] sm:text-[16px] uppercase tracking-[0.12em] text-grey mb-1">
                HOURS
              </div>
              <div className="font-body text-[16px] sm:text-[22px] text-white-text mb-6">
                Monday – Saturday, 9:00 AM – 6:00 PM IST
              </div>
            </div>
          </div>

          {/* Right Panel: Form */}
          <div className="border-t border-dark-3 md:border-t-0 md:border-l md:border-l-dark-3 p-6 sm:p-10 md:p-12">
            {isSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-red text-white flex items-center justify-center mb-6">
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                   </svg>
                </div>
                <h3 className="font-display text-5xl text-white-text mb-2">THANK YOU</h3>
                <p className="font-body text-[22px] text-grey">
                  Your message has been received. Our team will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="font-body text-[16px] uppercase tracking-[0.12em] text-grey mb-1 block">
                    Full Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full bg-[#FAFAFA] border ${
                      errors.name ? "border-red-500" : "border-dark-3"
                    } focus:border-red outline-none text-white-text font-body text-[22px] px-4 py-3 rounded-lg transition-colors`}
                  />
                  {errors.name && (
                    <p className="text-[16px] text-red mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="font-body text-[16px] uppercase tracking-[0.12em] text-grey mb-1 block">
                    Email*
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full bg-[#FAFAFA] border ${
                      errors.email ? "border-red-500" : "border-dark-3"
                    } focus:border-red outline-none text-white-text font-body text-[22px] px-4 py-3 rounded-lg transition-colors`}
                  />
                  {errors.email && (
                    <p className="text-[16px] text-red mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="font-body text-[16px] uppercase tracking-[0.12em] text-grey mb-1 block">
                    Phone*
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full bg-[#FAFAFA] border ${
                      errors.phone ? "border-red-500" : "border-dark-3"
                    } focus:border-red outline-none text-white-text font-body text-[22px] px-4 py-3 rounded-lg transition-colors`}
                  />
                  {errors.phone && (
                    <p className="text-[16px] text-red mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="font-body text-[16px] uppercase tracking-[0.12em] text-grey mb-1 block">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full bg-[#FAFAFA] border border-dark-3 focus:border-red outline-none text-white-text font-body text-[22px] px-4 py-3 rounded-lg transition-colors"
                  />
                </div>

                <div>
                  <label className="font-body text-[16px] uppercase tracking-[0.12em] text-grey mb-1 block">
                    Message*
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`w-full bg-[#FAFAFA] border ${
                      errors.message ? "border-red-500" : "border-dark-3"
                    } focus:border-red outline-none text-white-text font-body text-[22px] px-4 py-3 rounded-lg transition-colors resize-none`}
                  />
                  {errors.message && (
                    <p className="text-[16px] text-red mt-1">{errors.message}</p>
                  )}
                </div>

                <div>
                  <label className="font-body text-[16px] uppercase tracking-[0.12em] text-grey mb-1 block">
                    Attachment
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.png,.dxf"
                    onChange={handleFileChange}
                    className="w-full bg-[#FAFAFA] border border-dark-3 focus:border-red outline-none text-white-text font-body text-[22px] px-4 py-3 rounded-lg transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-base file:font-semibold file:bg-dark-3 file:text-white-text hover:file:bg-dim hover:file:text-white hover:file:cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-red hover:bg-red-hover text-white font-display tracking-wide text-[22px] sm:text-[33px] h-[50px] sm:h-[60px] rounded-lg transition-colors mt-2 ${
                    isSubmitting ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  SEND MESSAGE &rarr;
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
