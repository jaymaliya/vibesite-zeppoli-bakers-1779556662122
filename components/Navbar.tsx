"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";

const NAV_LINKS: { label: string; route?: string; scrollId?: string }[] = [
  { label: "Shop", route: "/shop" },
  { label: "Seasonal Specials", scrollId: "seasonal-specials" },
  { label: "Our Story", scrollId: "about" },
  { label: "Gifting", scrollId: "gifting" },
];

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {open ? (
        <>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </>
      ) : (
        <>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </>
      )}
    </svg>
  );
}

export default function Navbar() {
  const router = useRouter();
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [badgePulse, setBadgePulse] = useState(false);
  const prevTotalRef = useRef(totalItems);

  useEffect(() => {
    if (prevTotalRef.current !== totalItems) {
      setBadgePulse(true);
      const t = setTimeout(() => setBadgePulse(false), 400);
      prevTotalRef.current = totalItems;
      return () => clearTimeout(t);
    }
  }, [totalItems]);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function handleNavClick(link: (typeof NAV_LINKS)[number]) {
    setMobileOpen(false);
    if (link.route) {
      router.push(link.route);
    } else if (link.scrollId) {
      const el = document.getElementById(link.scrollId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push("/");
        setTimeout(() => {
          const el2 = document.getElementById(link.scrollId!);
          el2?.scrollIntoView({ behavior: "smooth" });
        }, 400);
      }
    }
  }

  function handleCartClick() {
    setMobileOpen(false);
    router.push("/checkout");
  }

  const navBase: React.CSSProperties = {
    position: "sticky",
    top: 0,
    zIndex: 50,
    backgroundColor: "#F5EDE0",
    borderBottom: scrolled ? "1px solid #e0d2bf" : "1px solid transparent",
    boxShadow: scrolled
      ? "0 2px 16px 0 rgba(141,29,28,0.10)"
      : "none",
    transition:
      "box-shadow 0.3s cubic-bezier(0.4,0,0.2,1), border-color 0.3s cubic-bezier(0.4,0,0.2,1)",
  };

  const linkStyle: React.CSSProperties = {
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 600,
    fontSize: "15px",
    letterSpacing: "0.02em",
    color: "#1A1A1A",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "8px 4px",
    borderRadius: "8px",
    transition:
      "color 0.2s cubic-bezier(0.4,0,0.2,1), background 0.2s cubic-bezier(0.4,0,0.2,1)",
  };

  const iconBtnStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#1A1A1A",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px",
    borderRadius: "50%",
    transition:
      "color 0.2s cubic-bezier(0.4,0,0.2,1), background 0.2s cubic-bezier(0.4,0,0.2,1)",
  };

  return (
    <>
      <header style={navBase} role="banner">
        <nav
          aria-label="Main navigation"
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 24px",
            height: "68px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          {/* Logo */}
          <div style={{ flexShrink: 0 }}>
            <img
              src="/logo.png"
              alt="Zeppoli Bakers logo"
              style={{ height: "40px", objectFit: "contain", cursor: "pointer", display: "block" }}
              onClick={() => router.push("/")}
            />
          </div>

          {/* Desktop Nav Links */}
          <div
            className="hidden md:flex"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flex: 1,
              justifyContent: "center",
            }}
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link)}
                style={linkStyle}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "#8D1D1C";
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(141,29,28,0.07)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "#1A1A1A";
                  (e.currentTarget as HTMLButtonElement).style.background = "none";
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.outline = "2px solid #8D1D1C";
                  (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.outline = "none";
                }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop Right Icons */}
          <div
            className="hidden md:flex"
            style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}
          >
            {/* Search */}
            <button
              aria-label="Search"
              style={iconBtnStyle}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(141,29,28,0.08)";
                (e.currentTarget as HTMLButtonElement).style.color = "#8D1D1C";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "none";
                (e.currentTarget as HTMLButtonElement).style.color = "#1A1A1A";
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "2px solid #8D1D1C";
                (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "none";
              }}
            >
              <SearchIcon />
            </button>

            {/* Cart */}
            <button
              aria-label={`Cart, ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
              style={{ ...iconBtnStyle, position: "relative" }}
              onClick={handleCartClick}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(141,29,28,0.08)";
                (e.currentTarget as HTMLButtonElement).style.color = "#8D1D1C";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "none";
                (e.currentTarget as HTMLButtonElement).style.color = "#1A1A1A";
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "2px solid #8D1D1C";
                (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "none";
              }}
            >
              <CartIcon />
              {totalItems > 0 && (
                <span
                  aria-live="polite"
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "9999px",
                    backgroundColor: "#B56A3C",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1,
                    transform: badgePulse ? "scale(1.25)" : "scale(1)",
                    transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1)",
                  }}
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Right */}
          <div
            className="flex md:hidden"
            style={{ display: "flex", alignItems: "center", gap: "4px" }}
          >
            {/* Mobile Cart */}
            <button
              aria-label={`Cart, ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
              style={{ ...iconBtnStyle, position: "relative" }}
              onClick={handleCartClick}
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "2px solid #8D1D1C";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "none";
              }}
            >
              <CartIcon />
              {totalItems > 0 && (
                <span
                  aria-live="polite"
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "9999px",
                    backgroundColor: "#B56A3C",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1,
                    transform: badgePulse ? "scale(1.25)" : "scale(1)",
                    transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1)",
                  }}
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>

            {/* Hamburger */}
            <button
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              style={iconBtnStyle}
              onClick={() => setMobileOpen((v) => !v)}
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "2px solid #8D1D1C";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "none";
              }}
            >
              <HamburgerIcon open={mobileOpen} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Overlay Menu */}
      <div
        aria-hidden={!mobileOpen}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 49,
          backgroundColor: "#F5EDE0",
          display: "flex",
          flexDirection: "column",
          paddingTop: "88px",
          paddingLeft: "24px",
          paddingRight: "24px",
          paddingBottom: "40px",
          transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "auto" : "none",
          transition:
            "transform 0.32s cubic-bezier(0.4,0,0.2,1), opacity 0.32s cubic-bezier(0.4,0,0.2,1)",
          overflowY: "auto",
        }}
      >
        <nav aria-label="Mobile navigation">
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {NAV_LINKS.map((link, i) => (
              <li key={link.label} style={{ borderBottom: "1px solid rgba(88,49,39,0.15)" }}>
                <button
                  tabIndex={mobileOpen ? 0 : -1}
                  onClick={() => handleNavClick(link)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 700,
                    fontSize: "22px",
                    letterSpacing: "-0.01em",
                    color: "#1A1A1A",
                    padding: "20px 0",
                    transition:
                      "color 0.2s cubic-bezier(0.4,0,0.2,1)",
                    animationDelay: `${i * 60}ms`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = "#8D1D1C";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = "#1A1A1A";
                  }}
                  onFocus={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.outline = "2px solid #8D1D1C";
                    (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
                  }}
                  onBlur={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.outline = "none";
                  }}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Search */}
        <div style={{ marginTop: "32px" }}>
          <button
            tabIndex={mobileOpen ? 0 : -1}
            aria-label="Search"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 600,
              fontSize: "16px",
              color: "#9B8B7D",
              padding: "8px 0",
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLButtonElement).style.outline = "2px solid #8D1D1C";
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLButtonElement).style.outline = "none";
            }}
          >
            <SearchIcon />
            Search
          </button>
        </div>

        {/* Mobile Footer Note */}
        <div style={{ marginTop: "auto", paddingTop: "32px" }}>
          <img
            src="/logo.png"
            alt="Zeppoli Bakers logo"
            style={{ height: "32px", objectFit: "contain", opacity: 0.7 }}
          />
          <p
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "13px",
              color: "#9B8B7D",
              marginTop: "8px",
              lineHeight: 1.5,
            }}
          >
            Layered moments, pure indulgence.
          </p>
        </div>
      </div>
    </>
  );
}