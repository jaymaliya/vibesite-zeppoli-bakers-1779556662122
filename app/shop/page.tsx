"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";

const FILTERS = ["All Cakes", "Chocolate", "Cheesecakes", "Red Velvet", "Celebration"];

const products = [
  { id: 1, img: "/product-1.jpg", name: "image features classic,", description: "This image features a classic, decadent whole chocolate cake, specifically a round layer", price: 0, badge: "NEW" },
  { id: 2, img: "/product-2.jpg", name: "image showcases meticulously", description: "This image showcases a meticulously crafted blueberry cheesecake, presented as a single,", price: 299, badge: "" },
  { id: 3, img: "/product-3.jpg", name: "image showcases meticulously", description: "This image showcases a meticulously crafted, multi-layered red velvet cake, prominently", price: 399, badge: "" },
  { id: 4, img: "/product-4.jpg", name: "image presents premium,", description: "This image presents a premium, single-tier celebration cake, precisely a round caramel or", price: 499, badge: "" }
];

export default function ShopPage() {
  const { addItem } = useCart() ?? { addItem: () => {} };
  const router = useRouter();

  const [activeFilter, setActiveFilter] = useState("All Cakes");
  const [addedIds, setAddedIds] = useState<Record<number, boolean>>({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const { items } = (useCart() ?? { items: [] }) as { items: { quantity: number }[] };

  useEffect(() => {
    const count = items?.reduce((a: number, b: { quantity: number }) => a + b.quantity, 0) ?? 0;
    setCartCount(count);
  }, [items]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Source+Sans+3:wght@400;500;600&display=swap');
      :root {
        --bg: #F5EDE0;
        --surface: #A67C52;
        --primary: #8D1D1C;
        --accent: #583127;
        --text: #1A1A1A;
        --muted: #9B8B7D;
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: var(--bg); color: var(--text); font-family: 'Source Sans 3', sans-serif; }
      .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
      .reveal.visible { opacity: 1; transform: translateY(0); }
      .card-hover { transition: transform 300ms cubic-bezier(0.4,0,0.2,1), box-shadow 300ms cubic-bezier(0.4,0,0.2,1); }
      .card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(141,29,28,0.18) !important; }
      .img-zoom { transition: transform 500ms ease; }
      .img-zoom:hover { transform: scale(1.05); }
      .pill-btn { transition: background-color 180ms ease, color 180ms ease, border-color 180ms ease; }
      .btn-primary { transition: transform 180ms ease, box-shadow 180ms ease; }
      .btn-primary:hover { transform: scale(1.02); }
      .btn-primary:active { transform: scale(0.98); }
      :focus-visible { outline: 2px solid #8D1D1C; outline-offset: 3px; }
      @media (max-width: 900px) {
        .grid-3 { grid-template-columns: repeat(2, 1fr) !important; gap: 24px !important; }
      }
      @media (max-width: 560px) {
        .grid-3 { grid-template-columns: 1fr !important; gap: 16px !important; }
        .hide-mobile { display: none !important; }
        .hero-shop-inner { padding: 48px 20px !important; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add("visible"), i * 80);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const handleAddToCart = (p: typeof products[0]) => {
    addItem({ id: crypto.randomUUID(), name: p.name, price: p.price, quantity: 1, image: p.img });
    setAddedIds((prev) => ({ ...prev, [p.id]: true }));
    setTimeout(() => setAddedIds((prev) => ({ ...prev, [p.id]: false })), 1500);
  };

  const navBg = scrolled ? "#F5EDE0" : "transparent";
  const navText = scrolled ? "#1A1A1A" : "#1A1A1A";
  const navBorder = scrolled ? "1px solid #E8DDD0" : "1px solid transparent";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Source Sans 3', sans-serif" }}>

      {/* ── NAVIGATION ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        backgroundColor: navBg, borderBottom: navBorder,
        transition: "background-color 250ms ease, border-color 250ms ease",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Hamburger (mobile) */}
          <button
            className="btn-primary"
            onClick={() => setMobileOpen(true)}
            style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 8 }}
            aria-label="Open menu"
            id="hamburger-btn"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={navText} strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Logo */}
          <div style={{ padding: "4px 8px", borderRadius: 8, background: scrolled ? "transparent" : "rgba(245,237,224,0.18)" }}>
            <img
              src="/logo.png"
              alt="Zeppoli Bakers logo"
              style={{ height: 40, objectFit: "contain", cursor: "pointer" }}
              onClick={() => router.push("/")}
            />
          </div>

          {/* Desktop Nav Links */}
          <div className="hide-mobile" style={{ display: "flex", gap: 36, alignItems: "center" }}>
            {[
              { label: "Our Cakes", action: () => router.push("/shop") },
              { label: "Seasonal Specials", action: () => router.push("/shop") },
              { label: "Our Story", action: () => router.push("/") },
              { label: "Gifting", action: () => router.push("/shop") },
            ].map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: 15,
                  letterSpacing: "0.02em", color: navText,
                  transition: "color 200ms ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#8D1D1C")}
                onMouseLeave={(e) => (e.currentTarget.style.color = navText)}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right icons */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}
              aria-label="Search"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={navText} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </button>
            <button
              style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: 6 }}
              aria-label="Cart"
              onClick={() => router.push("/checkout")}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={navText} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && (
                <span style={{
                  position: "absolute", top: 0, right: 0,
                  background: "#8D1D1C", color: "#fff",
                  borderRadius: "50%", width: 16, height: 16,
                  fontSize: 10, fontWeight: 700, display: "flex",
                  alignItems: "center", justifyContent: "center",
                }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "#F5EDE0",
            display: "flex", flexDirection: "column",
            padding: "32px 32px",
            animation: "slideIn 350ms ease-out",
          }}
        >
          <button
            onClick={() => setMobileOpen(false)}
            style={{ alignSelf: "flex-end", background: "none", border: "none", cursor: "pointer", marginBottom: 40 }}
            aria-label="Close menu"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          {[
            { label: "Our Cakes", action: () => { router.push("/shop"); setMobileOpen(false); } },
            { label: "Seasonal Specials", action: () => { router.push("/shop"); setMobileOpen(false); } },
            { label: "Our Story", action: () => { router.push("/"); setMobileOpen(false); } },
            { label: "Gifting", action: () => { router.push("/shop"); setMobileOpen(false); } },
          ].map((link) => (
            <button
              key={link.label}
              onClick={link.action}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: 26,
                color: "#1A1A1A", textAlign: "left", height: 56,
                display: "flex", alignItems: "center",
                borderBottom: "1px solid #E8DDD0",
              }}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}

      {/* ── SHOP HERO BANNER ── */}
      <section
        style={{
          background: "linear-gradient(135deg, #583127 0%, #8D1D1C 60%, #A67C52 100%)",
          padding: "80px 40px 64px",
          position: "relative",
          overflow: "hidden",
        }}
        className="hero-shop-inner"
      >
        {/* Decorative circle */}
        <div style={{
          position: "absolute", top: -60, right: -60,
          width: 320, height: 320,
          borderRadius: "50%",
          background: "rgba(245,237,224,0.06)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -40, left: "30%",
          width: 180, height: 180,
          borderRadius: "50%",
          background: "rgba(245,237,224,0.04)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <span style={{
            display: "inline-block",
            fontFamily: "'Source Sans 3', sans-serif",
            fontWeight: 600, fontSize: 11,
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "#F5EDE0", opacity: 0.7,
            marginBottom: 16,
          }}>
            OUR ARTISANAL CAKES
          </span>
          <h1 style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            color: "#F5EDE0",
            marginBottom: 20,
          }}>
            Every Cake, a<br />Handcrafted Story
          </h1>
          <p style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: 18, lineHeight: 1.65,
            color: "rgba(245,237,224,0.8)",
            maxWidth: 520, margin: "0 auto 32px",
          }}>
            Freshly baked daily in our artisan kitchen — rich chocolates, dreamy cheesecakes, velvety red velvets and celebratory centrepieces.
          </p>

          {/* Trust signals */}
          <div style={{
            display: "flex", justifyContent: "center", flexWrap: "wrap",
            gap: "24px 40px", fontSize: 14, color: "rgba(245,237,224,0.75)",
            fontFamily: "'Source Sans 3', sans-serif",
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#A67C52"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              4.9 / 5 from 3,200+ orders
            </span>
            <span>Free delivery over ₹999</span>
            <span>Made in India with love</span>
            <span>Baked Fresh, Same Day</span>
          </div>
        </div>
      </section>

      {/* ── FILTER PILLS ── */}
      <section style={{ background: "var(--bg)", padding: "40px 40px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            className="reveal"
            style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}
          >
            {FILTERS.map((f) => {
              const active = activeFilter === f;
              return (
                <button
                  key={f}
                  className="pill-btn btn-primary"
                  onClick={() => setActiveFilter(f)}
                  style={{
                    padding: "0 20px",
                    height: 36,
                    borderRadius: 9999,
                    border: active ? "1px solid #8D1D1C" : "1px solid #C4B09A",
                    background: active ? "#8D1D1C" : "transparent",
                    color: active ? "#F5EDE0" : "#1A1A1A",
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontWeight: 500, fontSize: 14,
                    cursor: "pointer",
                    letterSpacing: "0.01em",
                  }}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS GRID ── */}
      <section style={{ padding: "48px 40px 96px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            className="grid-3"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 32,
            }}
          >
            {products.map((p, idx) => (
              <article
                key={p.id}
                className="reveal card-hover"
                style={{
                  background: "#FFFFFF",
                  borderRadius: 16,
                  boxShadow: "0 6px 24px rgba(141,29,28,0.07)",
                  overflow: "hidden",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  transitionDelay: `${idx * 60}ms`,
                }}
              >
                {/* Image wrapper */}
                <div
                  style={{
                    overflow: "hidden",
                    borderRadius: "16px 16px 0 0",
                    position: "relative",
                    background: "#F8F6F2",
                  }}
                  onClick={() =>
                    router.push(
                      `/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`
                    )
                  }
                >
                  <img
                    src={p.img}
                    alt={`${p.name} — artisan bakery cake by Zeppoli Bakers`}
                    className="img-zoom"
                    style={{
                      width: "100%",
                      aspectRatio: "1 / 1",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  {/* Badge */}
                  <span style={{
                    position: "absolute", top: 14, left: 14,
                    background: "#8D1D1C", color: "#F5EDE0",
                    borderRadius: 9999, padding: "4px 12px",
                    fontSize: 11, fontWeight: 700,
                    fontFamily: "'Source Sans 3', sans-serif",
                    letterSpacing: "0.06em", textTransform: "uppercase",
                  }}>
                    {p.badge}
                  </span>
                </div>

                {/* Card body */}
                <div style={{ padding: "20px 20px 24px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  {/* Tag */}
                  <span style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: 11, fontWeight: 600,
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    color: "#9B8B7D",
                  }}>
                    {p.tag}
                  </span>

                  {/* Name */}
                  <h3
                    style={{
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: 700, fontSize: 20,
                      color: "#1A1A1A", lineHeight: 1.25,
                      letterSpacing: "-0.01em",
                      textTransform: "capitalize",
                    }}
                    onClick={() =>
                      router.push(
                        `/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`
                      )
                    }
                  >
                    {p.name}
                  </h3>

                  {/* Descriptor */}
                  <p style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: 14, color: "#9B8B7D", lineHeight: 1.5,
                  }}>
                    {p.descriptor}
                  </p>

                  {/* Description excerpt */}
                  <p style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: 14, color: "#6B5B52", lineHeight: 1.6,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical" as const,
                    overflow: "hidden",
                  }}>
                    {p.description}
                  </p>

                  {/* Price */}
                  <p style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontWeight: 600, fontSize: 20,
                    color: "#8D1D1C", marginTop: 4,
                  }}>
                    ₹{p.price.toLocaleString("en-IN")}
                  </p>

                  {/* Spacer */}
                  <div style={{ flex: 1 }} />

                  {/* Buttons row */}
                  <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                    {/* View Details ghost button */}
                    <button
                      className="btn-primary"
                      onClick={() =>
                        router.push(
                          `/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`
                        )
                      }
                      style={{
                        flex: 1,
                        height: 40,
                        borderRadius: 9999,
                        border: "1px solid #C4B09A",
                        background: "transparent",
                        color: "#1A1A1A",
                        fontFamily: "'Source Sans 3', sans-serif",
                        fontWeight: 600, fontSize: 13,
                        cursor: "pointer",
                        letterSpacing: "0.01em",
                        transition: "border-color 200ms ease, color 200ms ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#8D1D1C";
                        e.currentTarget.style.color = "#8D1D1C";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#C4B09A";
                        e.currentTarget.style.color = "#1A1A1A";
                      }}
                    >
                      View Details
                    </button>

                    {/* Add to Cart */}
                    <button
                      className="btn-primary"
                      onClick={() => handleAddToCart(p)}
                      style={{
                        flex: 1,
                        height: 40,
                        borderRadius: 9999,
                        border: "none",
                        background: addedIds[p.id] ? "#583127" : "#8D1D1C",
                        color: "#F5EDE0",
                        fontFamily: "'Source Sans 3', sans-serif",
                        fontWeight: 600, fontSize: 13,
                        cursor: "pointer",
                        letterSpacing: "0.01em",
                        transition: "background-color 200ms ease",
                        boxShadow: "0 4px 14px rgba(141,29,28,0.28)",
                      }}
                    >
                      {addedIds[p.id] ? "Added ✓" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More (visual, shows count) */}
          <div className="reveal" style={{ textAlign: "center", marginTop: 64 }}>
            <p style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: 14, color: "#9B8B7D", marginBottom: 20,
            }}>
              Showing all 4 handcrafted cakes
            </p>
            <button
              className="btn-primary"
              disabled
              style={{
                padding: "0 40px", height: 48,
                borderRadius: 9999,
                border: "1px solid #C4B09A",
                background: "transparent",
                color: "#9B8B7D",
                fontFamily: "'Source Sans 3', sans-serif",
                fontWeight: 600, fontSize: 15,
                cursor: "not-allowed",
                opacity: 0.6,
              }}
            >
              All Cakes Loaded
            </button>
          </div>
        </div>
      </section>

      {/* ── CRAFT SECTION (Editorial asymmetric) ── */}
      <section
        style={{
          background: "#EDE7E1",
          padding: "96px 40px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: 1280, margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "60fr 40fr",
            gap: 64,
            alignItems: "center",
          }}
        >
          {/* Text left */}
          <div className="reveal">
            <span style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontWeight: 600, fontSize: 11,
              letterSpacing: "0.15em", textTransform: "uppercase",
              color: "#9B8B7D", display: "block", marginBottom: 16,
            }}>
              THE ZEPPOLI CRAFT
            </span>
            <h2 style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              color: "#1A1A1A",
              marginBottom: 28,
            }}>
              Made with Obsession,<br />Served with Love
            </h2>
            <p style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: 17, lineHeight: 1.7,
              color: "#5C5248", marginBottom: 20,
              maxWidth: 540,
            }}>
              We source single-origin Ecuadorian cacao, stone-ground by heritage mills, blended with fresh dairy from Pune's organic farms. Every ganache is tempered by hand — no shortcuts, no compromises.
            </p>
            <p style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: 17, lineHeight: 1.7,
              color: "#5C5248",
              maxWidth: 540,
            }}>
              Our bakers have honed their craft for over a decade. The result is a cake that doesn't just taste extraordinary — it tells the story of the hands that made it.
            </p>
          </div>

          {/* Image right with clip-path */}
          <div
            className="reveal"
            style={{
              clipPath: "polygon(0% 0%, 100% 8%, 100% 100%, 0% 92%)",
              overflow: "hidden",
              background: "#F5EDE0",
            }}
          >
            <img
              src="/product-1.jpg"
              alt="Close-up of rich chocolate ganache cake from Zeppoli Bakers showing meticulous frosting craft"
              className="img-zoom"
              style={{
                width: "100%",
                aspectRatio: "3 / 2",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        </div>
      </section>

      {/* ── SEASONAL / GIFTING SECTION ── */}
      <section style={{ background: "#F4E8E2", padding: "96px 40px" }}>
        <div
          style={{
            maxWidth: 1280, margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "60fr 40fr",
            gap: 64,
            alignItems: "center",
          }}
        >
          {/* Image left */}
          <div className="reveal" style={{ overflow: "hidden", borderRadius: 16 }}>
            <img
              src="/product-4.jpg"
              alt="Beautifully packaged celebration cake gift from Zeppoli Bakers — perfect for special occasions"
              className="img-zoom"
              style={{
                width: "100%",
                aspectRatio: "4 / 3",
                objectFit: "cover",
                display: "block",
                borderRadius: 16,
              }}
            />
          </div>

          {/* Text right */}
          <div className="reveal">
            <span style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontWeight: 600, fontSize: 11,
              letterSpacing: "0.15em", textTransform: "uppercase",
              color: "#9B8B7D", display: "block", marginBottom: 16,
            }}>
              SEASONAL & GIFTING
            </span>
            <h2 style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 3.5vw, 3.2rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              color: "#1A1A1A",
              marginBottom: 20,
            }}>
              Gift the Moment,<br />Not Just the Cake
            </h2>
            <p style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: 16, lineHeight: 1.7,
              color: "#5C5248", marginBottom: 32,
            }}>
              Our curated gift boxes pair hand-selected pastries with premium packaging and a personalised note — crafted for anniversaries, festivals, corporate gifting, and the moments that matter most.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button
                className="btn-primary"
                onClick={() => router.push("/shop")}
                style={{
                  padding: "0 28px", height: 48,
                  borderRadius: 6,
                  border: "none",
                  background: "#8D1D1C",
                  color: "#F5EDE0",
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontWeight: 600, fontSize: 15,
                  cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(141,29,28,0.28)",
                }}
              >
                Explore Gifts
              </button>
              <button
                className="btn-primary"
                onClick={() => router.push("/shop")}
                style={{
                  padding: "0 28px", height: 48,
                  borderRadius: 6,
                  border: "1px solid #8D1D1C",
                  background: "transparent",
                  color: "#8D1D1C",
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontWeight: 600, fontSize: 15,
                  cursor: "pointer",
                }}
              >
                Discover Seasonal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ background: "#DDC2A7", padding: "80px 0", overflow: "hidden" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto 40px", padding: "0 40px", textAlign: "center" }}>
          <span className="reveal" style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontWeight: 600, fontSize: 11,
            letterSpacing: "0.15em", textTransform: "uppercase",
            color: "#7A5C40", display: "block", marginBottom: 12,
          }}>
            WHAT OUR CUSTOMERS SAY
          </span>
          <h2 className="reveal" style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
            letterSpacing: "-0.03em",
            lineHeight: 1.2,
            color: "#1A1A1A",
          }}>
            Loved by Over 3,200 Families
          </h2>
        </div>

        {/* Auto-scrolling testimonials */}
        <TestimonialScroller />
      </section>

      {/* ── FULL-WIDTH CTA BANNER ── */}
      <section style={{ background: "#8D1D1C", padding: "80px 40px" }}>
        <div className="reveal" style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2rem, 3.5vw, 3rem)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            color: "#F5EDE0",
            marginBottom: 32,
          }}>
            Ready to Indulge? Explore Our Full Collection
          </h2>
          <button
            className="btn-primary"
            onClick={() => router.push("/shop")}
            style={{
              padding: "0 40px", height: 52,
              borderRadius: 9999,
              border: "2px solid #F5EDE0",
              background: "transparent",
              color: "#F5EDE0",
              fontFamily: "'Source Sans 3', sans-serif",
              fontWeight: 600, fontSize: 16,
              cursor: "pointer",
              letterSpacing: "0.01em",
            }}
          >
            Explore Our Full Collection
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#1A1A1A", color: "#fff", padding: "72px 40px 0" }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 48,
          paddingBottom: 56,
        }}>

          {/* Col 1 */}
          <div>
            <img
              src="/logo.png"
              alt="Zeppoli Bakers logo"
              style={{ height: 32, objectFit: "contain", opacity: 0.85, marginBottom: 16 }}
            />
            <p style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: 14, lineHeight: 1.6, color: "#CCCCCC", marginBottom: 24,
            }}>
              Indulgence Crafted with Love
            </p>
            <div style={{ display: "flex", gap: 16 }}>
              {[
                { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                { label: "Facebook", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                { label: "Pinterest", path: "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641 0 12.017 0z" },
              ].map((icon) => (
                <button
                  key={icon.label}
                  aria-label={icon.label}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
                    <path d={icon.path} />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Col 2: Shop */}
          <div>
            <h4 style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontWeight: 700, fontSize: 11,
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: "#fff", marginBottom: 20,
            }}>
              Shop
            </h4>
            {["Our Cakes", "Chocolate Cakes", "Seasonal Specials", "Gift Cards"].map((link) => (
              <button
                key={link}
                onClick={() => router.push("/shop")}
                style={{
                  display: "block", background: "none", border: "none", cursor: "pointer",
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: 15, color: "#CCCCCC", lineHeight: 2.2,
                  textAlign: "left", padding: 0,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#F5EDE0")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#CCCCCC")}
              >
                {link}
              </button>
            ))}
          </div>

          {/* Col 3: Learn */}
          <div>
            <h4 style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontWeight: 700, fontSize: 11,
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: "#fff", marginBottom: 20,
            }}>
              Learn
            </h4>
            {["Our Story", "The Craft", "Blog", "FAQs", "Contact Us"].map((link) => (
              <button
                key={link}
                onClick={() => router.push("/")}
                style={{
                  display: "block", background: "none", border: "none", cursor: "pointer",
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: 15, color: "#CCCCCC", lineHeight: 2.2,
                  textAlign: "left", padding: 0,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#F5EDE0")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#CCCCCC")}
              >
                {link}
              </button>
            ))}
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h4 style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 600, fontSize: 18,
              color: "#fff", marginBottom: 16,
            }}>
              Stay in the Loop
            </h4>
            <p style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: 14, color: "#CCCCCC", lineHeight: 1.6, marginBottom: 20,
            }}>
              New flavours, seasonal specials and exclusive offers — straight to your inbox.
            </p>
            {subscribed ? (
              <p style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: 14, color: "#A67C52", fontWeight: 600,
              }}>
                Thank you for subscribing! 🎂
              </p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email) setSubscribed(true);
                }}
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  style={{
                    height: 48, borderRadius: 4,
                    border: "1px solid #555",
                    background: "transparent", color: "#fff",
                    padding: "0 16px",
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: 15,
                  }}
                />
                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    height: 48, borderRadius: 4,
                    border: "none",
                    background: "#8D1D1C",
                    color: "#F5EDE0",
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontWeight: 600, fontSize: 15,
                    cursor: "pointer",
                  }}
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer bottom strip */}
        <div style={{
          borderTop: "1px solid #333",
          padding: "24px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}>
          <p style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: 13, color: "#AAAAAA",
          }}>
            © 2026 Zeppoli Bakers · Privacy Policy · Terms of Service
          </p>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            {["Visa", "MC", "UPI", "RuPay"].map((pay) => (
              <span
                key={pay}
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: 11, fontWeight: 700,
                  color: "#888", border: "1px solid #444",
                  borderRadius: 4, padding: "3px 8px",
                  letterSpacing: "0.05em",
                }}
              >
                {pay}
              </span>
            ))}
          </div>
        </div>
      </footer>

      {/* Mobile nav fix */}
      <style>{`
        @media (max-width: 768px) {
          #hamburger-btn { display: flex !important; }
          .hide-mobile { display: none !important; }
        }
        @keyframes slideIn {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ── TESTIMONIAL AUTO-SCROLLER ── */
function TestimonialScroller() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const testimonials = [
    {
      text: "Ordered the chocolate cake for my daughter's birthday and everyone was speechless. The ganache was so rich and velvety — nothing like anything we've tasted from a local bakery.",
      name: "Priya M., Mumbai",
    },
    {
      text: "The red velvet is out of this world. Moist, perfectly layered and the frosting doesn't go overboard on sweetness. Will be ordering for every celebration from now on.",
      name: "Rohan D., Pune",
    },
    {
      text: "The blueberry cheesecake was a revelation. Dense, creamy, with that perfect tartness. Gift packaging was beautiful — arrived in perfect condition.",
      name: "Ananya S., Bengaluru",
    },
    {
      text: "Five stars isn't enough. The caramel celebration cake had the most intricate decorations and tasted even better than it looked. My guests asked for the bakery name all evening.",
      name: "Deepak K., Delhi",
    },
  ];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let frame: number;
    let paused = false;
    let pos = 0;
    const speed = 0.6;

    const scroll = () => {
      if (!paused) {
        pos += speed;
        if (pos >= el.scrollWidth / 2) pos = 0;
        el.scrollLeft = pos;
      }
      frame = requestAnimationFrame(scroll);
    };

    frame = requestAnimationFrame(scroll);
    el.addEventListener("mouseenter", () => (paused = true));
    el.addEventListener("mouseleave", () => (paused = false));

    return () => cancelAnimationFrame(frame);
  }, []);

  const items = [...testimonials, ...testimonials];

  return (
    <div
      ref={scrollRef}
      style={{
        display: "flex",
        gap: 32,
        overflowX: "hidden",
        padding: "8px 40px 8px",
        cursor: "grab",
        userSelect: "none",
      }}
    >
      {items.map((t, i) => (
        <div
          key={i}
          style={{
            minWidth: 540,
            maxWidth: 540,
            minHeight: 200,
            background: "#FFFFFF",
            borderRadius: 16,
            padding: 40,
            flexShrink: 0,
            boxShadow: "0 4px 20px rgba(88,49,39,0.07)",
          }}
        >
          {/* Stars */}
          <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
            {Array.from({ length: 5 }).map((_, si) => (
              <svg key={si} width="16" height="16" viewBox="0 0 24 24" fill="#A67C52">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <p style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontStyle: "italic",
            fontSize: 17, lineHeight: 1.6,
            color: "#1A1A1A", marginBottom: 20,
          }}>
            "{t.text}"
          </p>
          <p style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontWeight: 600, fontSize: 15,
            color: "#8D1D1C",
          }}>
            — {t.name}
          </p>
        </div>
      ))}
    </div>
  );
}