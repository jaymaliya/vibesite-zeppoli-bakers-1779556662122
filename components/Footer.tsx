"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

function InstagramIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { label: "Instagram", icon: <InstagramIcon />, href: "https://instagram.com" },
  { label: "Twitter", icon: <TwitterIcon />, href: "https://twitter.com" },
  { label: "WhatsApp", icon: <WhatsAppIcon />, href: "https://wa.me/919999999999" },
];

const QUICK_LINKS: { label: string; route?: string; scrollId?: string }[] = [
  { label: "Home", route: "/" },
  { label: "Shop", route: "/shop" },
  { label: "Seasonal Specials", scrollId: "seasonal-specials" },
  { label: "Our Story", scrollId: "about" },
  { label: "Gifting", scrollId: "gifting" },
];

export default function Footer() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState("");

  function handleNav(link: (typeof QUICK_LINKS)[number]) {
    if (link.route) {
      router.push(link.route);
    } else if (link.scrollId) {
      const el = document.getElementById(link.scrollId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push("/");
        setTimeout(() => {
          document.getElementById(link.scrollId!)?.scrollIntoView({ behavior: "smooth" });
        }, 400);
      }
    }
  }

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setEmailError("Please enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setSubscribed(true);
    setEmail("");
  }

  const dividerColor = "rgba(88,49,39,0.18)";

  const sectionHeadStyle: React.CSSProperties = {
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 700,
    fontSize: "13px",
    letterSpacing: "0.10em",
    textTransform: "uppercase" as const,
    color: "#583127",
    marginBottom: "16px",
  };

  const bodyTextStyle: React.CSSProperties = {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: "14px",
    color: "#9B8B7D",
    lineHeight: 1.7,
  };

  const quickLinkBtnStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: "14px",
    color: "#583127",
    padding: "5px 0",
    textAlign: "left" as const,
    transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
  };

  return (
    <footer
      role="contentinfo"
      style={{
        backgroundColor: "#F5EDE0",
        borderTop: `1px solid ${dividerColor}`,
        paddingTop: "64px",
        paddingBottom: "32px",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Top Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "48px",
            marginBottom: "64px",
          }}
        >
          {/* Brand Column */}
          <div>
            <div style={{ marginBottom: "16px" }}>
              <img
                src="/logo.png"
                alt="Zeppoli Bakers logo"
                style={{ height: "32px", objectFit: "contain", opacity: 0.85, display: "block" }}
              />
            </div>
            <p
              style={{
                ...bodyTextStyle,
                marginBottom: "16px",
                maxWidth: "240px",
              }}
            >
              Layered moments, pure indulgence. Handcrafted cakes baked fresh in India — celebrating every occasion with artisan quality.
            </p>
            <p style={{ ...bodyTextStyle, marginBottom: "4px" }}>
              Made with love in India
            </p>
            <p style={bodyTextStyle}>
              <a
                href="mailto:maliyajay77@gmail.com"
                style={{
                  color: "#8D1D1C",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "opacity 0.2s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                maliyajay77@gmail.com
              </a>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p style={sectionHeadStyle}>Quick Links</p>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <button
                    style={quickLinkBtnStyle}
                    onClick={() => handleNav(link)}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = "#8D1D1C";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = "#583127";
                    }}
                    onFocus={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.outline = "2px solid #8D1D1C";
                      (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
                    }}
                    onBlur={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.outline = "none";
                    }}
                  >
                    <ChevronRightIcon />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Column */}
          <div>
            <p style={sectionHeadStyle}>Bakery Info</p>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {[
                "Free delivery on orders above ₹999",
                "Fresh-baked, made to order",
                "Customisation available",
                "Serves 6–10 per whole cake",
                "Pan-India shipping available",
              ].map((item) => (
                <li key={item} style={{ ...bodyTextStyle, marginBottom: "8px", paddingLeft: "0" }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <p style={sectionHeadStyle}>Stay Sweet</p>
            <p style={{ ...bodyTextStyle, marginBottom: "16px" }}>
              Get exclusive recipes, seasonal specials, and early access to festive offers.
            </p>
            {subscribed ? (
              <p
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "14px",
                  color: "#583127",
                  fontWeight: 600,
                  padding: "12px 16px",
                  backgroundColor: "rgba(88,49,39,0.10)",
                  borderRadius: "12px",
                }}
              >
                Thank you for subscribing! Check your inbox.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} noValidate>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div>
                    <label
                      htmlFor="footer-email"
                      style={{
                        position: "absolute",
                        width: "1px",
                        height: "1px",
                        overflow: "hidden",
                        clip: "rect(0,0,0,0)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Email address
                    </label>
                    <input
                      id="footer-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError("");
                      }}
                      placeholder="Your email address"
                      aria-describedby={emailError ? "email-error" : undefined}
                      aria-invalid={!!emailError}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "12px",
                        border: emailError
                          ? "1.5px solid #8D1D1C"
                          : "1.5px solid rgba(88,49,39,0.30)",
                        backgroundColor: "#fff",
                        fontFamily: "'Source Sans 3', sans-serif",
                        fontSize: "14px",
                        color: "#1A1A1A",
                        outline: "none",
                        boxSizing: "border-box",
                        transition:
                          "border-color 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s cubic-bezier(0.4,0,0.2,1)",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#8D1D1C";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(141,29,28,0.12)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = emailError
                          ? "#8D1D1C"
                          : "rgba(88,49,39,0.30)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                    {emailError && (
                      <p
                        id="email-error"
                        role="alert"
                        style={{
                          fontFamily: "'Source Sans 3', sans-serif",
                          fontSize: "12px",
                          color: "#8D1D1C",
                          marginTop: "6px",
                        }}
                      >
                        {emailError}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    style={{
                      padding: "12px 20px",
                      borderRadius: "12px",
                      backgroundColor: "#8D1D1C",
                      color: "#F5EDE0",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: 700,
                      fontSize: "14px",
                      letterSpacing: "0.02em",
                      transition:
                        "transform 0.25s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s cubic-bezier(0.4,0,0.2,1)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
                      (e.currentTarget as HTMLButtonElement).style.boxShadow =
                        "0 4px 16px rgba(141,29,28,0.30)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                    }}
                    onMouseDown={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)";
                    }}
                    onMouseUp={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
                    }}
                    onFocus={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.outline = "2px solid #8D1D1C";
                      (e.currentTarget as HTMLButtonElement).style.outlineOffset = "3px";
                    }}
                    onBlur={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.outline = "none";
                    }}
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            borderTop: `1px solid ${dividerColor}`,
            paddingTop: "32px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          {/* Copyright */}
          <p
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "13px",
              color: "#9B8B7D",
              margin: 0,
            }}
          >
            &copy; {new Date().getFullYear()} Zeppoli Bakers. All rights reserved.
          </p>

          {/* Social Icons */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Zeppoli Bakers on ${social.label}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  color: "#583127",
                  backgroundColor: "rgba(88,49,39,0.10)",
                  transition:
                    "background-color 0.2s cubic-bezier(0.4,0,0.2,1), color 0.2s cubic-bezier(0.4,0,0.2,1), transform 0.2s cubic-bezier(0.4,0,0.2,1)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.backgroundColor = "#8D1D1C";
                  el.style.color = "#F5EDE0";
                  el.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.backgroundColor = "rgba(88,49,39,0.10)";
                  el.style.color = "#583127";
                  el.style.transform = "translateY(0)";
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.outline = "2px solid #8D1D1C";
                  (e.currentTarget as HTMLAnchorElement).style.outlineOffset = "2px";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.outline = "none";
                }}
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Legal small print */}
          <p
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "12px",
              color: "#9B8B7D",
              margin: 0,
            }}
          >
            Payments powered by Razorpay &nbsp;&middot;&nbsp; Made in India
          </p>
        </div>
      </div>
    </footer>
  );
}