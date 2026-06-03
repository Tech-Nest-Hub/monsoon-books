"use client"

import { useEffect } from "react"
import { ContactForm } from "./ContactForm"

export default function ContactPage() {
  useEffect(() => {
    // Load reCAPTCHA Enterprise script
    const script = document.createElement("script")
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    return () => {
      // Cleanup
      const scripts = document.querySelectorAll(`script[src*="recaptcha/enterprise"]`)
      scripts.forEach(script => script.remove())
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Have questions about your order, need book recommendations, or just want to say hello? 
            We'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Send us a message</h2>
              <p className="text-slate-600">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>
            <ContactForm />
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-6">
            {/* Contact Info Cards */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Get in touch</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Email Us</h3>
                    <a href="mailto:info@monsoonbooks.com.np" className="text-slate-600 hover:text-primary transition-colors">
                      info@monsoonbooks.com.np
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Call Us</h3>
                    <a href="tel:+97711234567" className="text-slate-600 hover:text-primary transition-colors">
                      +977 98-51000689
                    </a>
                    <p className="text-xs text-slate-500 mt-1">Mon-Fri, 9AM - 6PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Visit Us</h3>
                    <p className="text-slate-600">Kathmandu, Nepal</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 pb-0">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Find us here</h2>
                <p className="text-slate-600 text-sm mb-4">
                  Visit our store to explore our collection in person.
                </p>
              </div>
             <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.3723660116443!2d85.31561657508067!3d27.705787076183384!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19cf2ccbc1ff:0xfd8484238331408a!2sMonsoon Books!5e0!3m2!1sen!2snp!4v1780386474391!5m2!1sen!2snp"
              width="600"
              height="300"
              style={{
                border: "0",
              }}
              allowFullScreen={true}
              aria-hidden="false"
              tabIndex={0}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>    
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h3 className="font-semibold text-slate-900 mb-4">Business Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Everday (Sun-Saturday)</span>
                  <span className="font-medium text-slate-900">6:30 AM - 7:30 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}