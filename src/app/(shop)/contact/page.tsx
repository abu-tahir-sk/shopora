import { Metadata } from "next";
import { Mail, Phone, MapPin, Clock, MessageSquareQuote } from "lucide-react";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Us | Shopora",
  description: "Get in touch with the Shopora design concierge team for order questions, custom styling, or press inquiries.",
};

export default function ContactPage() {
  const contactDetails = [
    {
      icon: Mail,
      title: "Email Us",
      details: "care@shopora.com",
      subtitle: "Response within 24 business hours",
    },
    {
      icon: Phone,
      title: "Direct Concierge",
      details: "+91 (022) 8000-SHOP",
      subtitle: "Mon - Sat, 10:00 AM - 7:00 PM IST",
    },
    {
      icon: MapPin,
      title: "Design Studio & Flagship",
      details: "123 Fashion Street, Bandra West",
      subtitle: "Mumbai, Maharashtra 400050",
    },
    {
      icon: Clock,
      title: "Studio Visiting Hours",
      details: "Tuesday to Sunday",
      subtitle: "11:00 AM - 8:00 PM (By Appointment)",
    },
  ];

  return (
    <div className="bg-background min-h-screen pb-24">
      {/* Banner */}
      <div className="bg-secondary/40 py-16 md:py-24 border-b border-border text-center px-4">
        <h1 className="text-3xl md:text-5xl font-light tracking-tight mb-4">
          Connect With Us
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto font-light leading-relaxed text-sm md:text-base">
          Whether you need assistance with an existing order, dimensions inquiry, or interior styling advice, our dedicated team is here to assist.
        </p>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-6xl pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-2xl font-light tracking-tight mb-4">
              Get In Touch
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {contactDetails.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="p-5 rounded-2xl border border-border bg-card flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center shrink-0 text-brand">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                      <p className="text-sm font-medium mt-0.5">{item.details}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-6 rounded-2xl bg-secondary/30 border border-border mt-8">
              <div className="flex items-center gap-2 font-medium text-sm mb-2">
                <MessageSquareQuote className="h-4 w-4 text-brand" />
                <span>Trade & Commercial Projects</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Are you an interior designer, architect, or hospitality developer? Reach out directly to <strong className="text-foreground">trade@shopora.com</strong> for exclusive spec sheets, volume rates, and custom finish options.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-sm">
              <h2 className="text-2xl font-light tracking-tight mb-2">
                Send an Inquiry
              </h2>
              <p className="text-sm text-muted-foreground mb-6 font-light">
                Fill in the details below and an associate will be in touch shortly.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
