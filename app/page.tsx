"use client";
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "../components/CartContext"

const products = [
  { id: 1, img: "/product-1.jpg", name: "Classic Chocolate Cake", description: "Decadent whole chocolate cake with rich ganache frosting and lavish chocolate shavings.", price: 899 },
  { id: 2, img: "/product-2.jpg", name: "Blueberry Cheesecake", description: "Meticulously crafted blueberry cheesecake, perfectly round and irresistibly creamy.", price: 299 },
  { id: 3, img: "/product-3.jpg", name: "Red Velvet Layer Cake", description: "Multi-layered red velvet cake with a wedge-shaped slice revealing stunning crimson layers.", price: 399 },
  { id: 4, img: "/product-4.jpg", name: "Caramel Celebration Cake", description: "Premium single-tier caramel toffee cake, the perfect centrepiece for every celebration.", price: 499 },
]

const testimonials = [
  { name: "Priya Sharma", text: "The chocolate cake was absolutely divine — every bite was pure indulgence. My family couldn't stop raving about it!", stars: 5 },
  { name: "Ankit Mehta", text: "Ordered the Red Velvet for my wife's birthday. The layers were perfect and the frosting was silken smooth. 10/10!", stars: 5 },
  { name: "Sunita Rao", text: "Zeppoli Bakers delivered sheer magic. The blueberry cheesecake looked and tasted straight out of a patisserie.", stars: 5 },
  { name: "Rahul Verma", text: "The caramel celebration cake was the highlight of our anniversary. Worth every rupee — we'll be back!", stars: 5 },
]

export default function HomePage() {
  const router = useRouter()
  const { addItem } = useCart()
  const [navScrolled, setNavScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [addedStates, setAddedStates] = useState<Record<number, boolean>>({})
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const featuredRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 100)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed")
          }
        })
      },
      { threshold: 0.15 }
    )
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const handleAddToCart = (p: typeof products[0]) => {
    addItem({ id: crypto.randomUUID(), name: p.name, price: p.price, quantity: 1, image: p.img })
    setAddedStates((prev) => ({ ...prev, [p.id]: true }))
    setTimeout(() => setAddedStates((prev) => ({ ...prev, [p.id]: false })), 1500)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return
    isDragging.current = true
    startX.current = e.pageX - carouselRef.current.offsetLeft
    scrollLeft.current = carouselRef.current.scrollLeft
    carouselRef.current.style.cursor = "grabbing"
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !carouselRef.current) return
    e.preventDefault()
    const x = e.pageX - carouselRef.current.offsetLeft
    const walk = (x - startX.current) * 1.5
    carouselRef.current.scrollLeft = scrollLeft.current - walk
  }
  const handleMouseUp = () => {
    isDragging.current = false
    if (carouselRef.current) carouselRef.current.style.cursor = "grab"
  }

  const navLinks = [
    { label: "Our Cakes", action: () => router.push("/shop") },
    { label: "Seasonal Specials", action: () => router.push("/shop") },
    { label: "Our Story", action: () => document.getElementById("craft-section")?.scrollIntoView({ behavior: "smooth" }) },
    { label: "Gifting", action: () => router.push("/shop") },
  ]

  return (
    <>
      <style>{`
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
        body { background: var(--bg); color: var(--text); font-family: 'Source Sans 3', sans-serif; overflow-x: hidden; }
        h1,h2,h3,h4 { font-family: 'Nunito', sans-serif; }
        .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
        .reveal.revealed { opacity: 1; transform: translateY(0); }
        .reveal-d1 { transition-delay: 0.1s; }
        .reveal-d2 { transition-delay: 0.2s; }
        .reveal-d3 { transition-delay: 0.3s; }
        .reveal-d4 { transition-delay: 0.4s; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .marquee-track { display: flex; animation: marquee 40s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }
        .carousel-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        .carousel-scroll::-webkit-scrollbar { display: none; }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-img-col { display: none !important; }
          .hero-text-col { padding: 64px 24px !important; }
          .welcome-grid { grid-template-columns: 1fr !important; }
          .craft-grid { grid-template-columns: 1fr !important; }
          .seasonal-grid { grid-template-columns: 1fr !important; flex-direction: column-reverse !important; }
          .footer-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .nav-links-desktop { display: none !important; }
          .nav-mobile-trigger { display: flex !important; }
          .hero-trust { flex-wrap: wrap !important; gap: 8px !important; }
        }
        @media (min-width: 769px) {
          .nav-mobile-trigger { display: none !important; }
        }
        button:focus-visible, a:focus-visible { outline: 3px solid var(--primary); outline-offset: 2px; border-radius: 4px; }
      `}</style>

      {/* NAVIGATION */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        backgroundColor: navScrolled ? "#F5EDE0" : "transparent",
        borderBottom: navScrolled ? "1px solid #EDE7E1" : "none",
        transition: "background-color 250ms ease, border-color 250ms ease",
        padding: "0 48px",
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Mobile hamburger */}
          <button
            className="nav-mobile-trigger"
            onClick={() => setMobileMenuOpen(true)}
            style={{ background: "none", border: "none", cursor: "pointer", display: "none", flexDirection: "column", gap: "5px", padding: "8px" }}
            aria-label="Open menu"
          >
            {[0,1,2].map(i => (
              <span key={i} style={{ display: "block", width: "24px", height: "2px", background: navScrolled ? "var(--text)" : "#fff", borderRadius: "2px", transition: "background 250ms" }} />
            ))}
          </button>

          {/* Logo */}
          <div style={{ padding: "4px 8px", borderRadius: "8px", background: navScrolled ? "transparent" : "rgba(255,255,255,0.08)" }}>
            <img src="/logo.png" alt="Zeppoli Bakers logo" style={{ height: "40px", objectFit: "contain", cursor: "pointer" }} onClick={() => router.push("/")} />
          </div>

          {/* Desktop nav links */}
          <div className="nav-links-desktop" style={{ display: "flex", gap: "40px" }}>
            {navLinks.map(link => (
              <button key={link.label} onClick={link.action} style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: "16px",
                letterSpacing: "0.02em", color: navScrolled ? "var(--text)" : "#fff",
                transition: "color 250ms", padding: "4px 0"
              }}>{link.label}</button>
            ))}
          </div>

          {/* Cart + Search */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <button aria-label="Search" style={{ background: "none", border: "none", cursor: "pointer" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={navScrolled ? "var(--text)" : "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
            <button onClick={() => router.push("/checkout")} aria-label="Cart" style={{ background: "none", border: "none", cursor: "pointer", position: "relative" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={navScrolled ? "var(--text)" : "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200,
          backgroundColor: "#F8F5F1",
          display: "flex", flexDirection: "column", padding: "24px 32px"
        }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={() => setMobileMenuOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }} aria-label="Close menu">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div style={{ marginTop: "48px", display: "flex", flexDirection: "column", gap: "0" }}>
            {navLinks.map(link => (
              <button key={link.label} onClick={() => { link.action(); setMobileMenuOpen(false); }} style={{
                background: "none", border: "none", borderBottom: "1px solid #EDE7E1", cursor: "pointer",
                fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: "26px",
                color: "var(--text)", textAlign: "left", padding: "0", height: "72px",
                display: "flex", alignItems: "center"
              }}>{link.label}</button>
            ))}
          </div>
        </div>
      )}

      {/* HERO SECTION — Split 55/45 */}
      <section style={{ minHeight: "100vh", background: "var(--accent)", position: "relative", overflow: "hidden" }}>
        <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "55fr 45fr", minHeight: "100vh" }}>
          {/* Left text column */}
          <div className="hero-text-col" style={{
            display: "flex", flexDirection: "column", justifyContent: "center",
            padding: "120px 64px 96px 80px",
            background: "#3A241F",
            position: "relative", zIndex: 2
          }}>
            <span style={{
              fontSize: "0.688rem", textTransform: "uppercase", letterSpacing: "0.18em",
              fontWeight: 600, color: "#B56A3C", marginBottom: "16px",
              fontFamily: "'Source Sans 3', sans-serif"
            }}>Freshly Baked · Handcrafted in India</span>
            <h1 style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: "clamp(3.2rem, 5.5vw, 5.2rem)",
              fontWeight: 800, lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "#F5EDE0",
              marginBottom: "24px"
            }}>Moments of Pure<br />Indulgence,<br />Crafted Daily</h1>
            <p style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "1.125rem", lineHeight: 1.7,
              color: "#CCBBAA", maxWidth: "440px", marginBottom: "40px"
            }}>Artisanal cakes baked with premium ingredients — every ganache swirl, every chocolate shaving, placed with intention. Made for your celebrations and everyday joy.</p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "32px" }}>
              <button
                onClick={() => document.getElementById("featured-cakes")?.scrollIntoView({ behavior: "smooth" })}
                style={{
                  padding: "16px 36px", borderRadius: "4px", border: "none", cursor: "pointer",
                  background: "#B56A3C", color: "#fff",
                  fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: "18px",
                  transition: "transform 150ms ease, box-shadow 150ms ease",
                  boxShadow: "0 10px 30px -8px rgba(181,106,60,0.5)"
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 14px 36px -8px rgba(181,106,60,0.6)" }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 10px 30px -8px rgba(181,106,60,0.5)" }}
                onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
                onMouseUp={e => e.currentTarget.style.transform = "scale(1.02)"}
              >Order Your Cake Now</button>
              <button
                onClick={() => router.push("/shop")}
                style={{
                  padding: "16px 36px", borderRadius: "4px",
                  border: "2px solid rgba(245,237,224,0.4)", background: "transparent",
                  cursor: "pointer", color: "#F5EDE0",
                  fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: "18px",
                  transition: "border-color 200ms ease, transform 150ms ease"
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(245,237,224,0.8)"; e.currentTarget.style.transform = "scale(1.02)" }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(245,237,224,0.4)"; e.currentTarget.style.transform = "scale(1)" }}
                onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
                onMouseUp={e => e.currentTarget.style.transform = "scale(1.02)"}
              >Explore All Cakes</button>
            </div>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "14px", color: "#9B8B7D", marginBottom: "32px" }}>
              Freshly Baked Daily · Handcrafted with Love
            </p>
            {/* Trust signals */}
            <div className="hero-trust" style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
              {[
                { icon: "⭐", text: "4.9 / 5 Rating" },
                { icon: null, text: "12,000+ Happy Customers" },
                { icon: null, text: "Free Shipping over ₹799" },
                { icon: null, text: "Made in India" },
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {i === 0 && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#B56A3C" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  )}
                  {i === 2 && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9B8B7D" strokeWidth="2" strokeLinecap="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                  )}
                  {i === 3 && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9B8B7D" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                  )}
                  <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "13px", color: "#CCBBAA" }}>{t.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right image column */}
          <div className="hero-img-col" style={{ position: "relative", overflow: "hidden" }}>
            <img
              src="/product-1.jpg"
              alt="Classic whole chocolate cake with rich ganache and chocolate shavings — signature cake by Zeppoli Bakers"
              style={{
                width: "100%", height: "100%", objectFit: "cover",
                objectPosition: "center",
                transition: "transform 300ms ease-out"
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to right, rgba(58,36,31,0.15) 0%, transparent 40%)"
            }} />
          </div>
        </div>
      </section>

      {/* WARM WELCOME & BRAND ETHOS */}
      <section style={{ backgroundColor: "#F8F5F1", padding: "96px 48px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div className="reveal" style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", marginBottom: "64px" }}>
            <span style={{
              display: "block", fontSize: "0.688rem", textTransform: "uppercase",
              letterSpacing: "0.15em", fontWeight: 600, color: "var(--muted)",
              fontFamily: "'Source Sans 3', sans-serif", marginBottom: "16px"
            }}>OUR ARTISANAL PHILOSOPHY</span>
            <h2 style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: "clamp(2rem, 4vw, 3.4rem)",
              fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.2,
              color: "#3A241F", marginBottom: "24px"
            }}>Where Every Cake Tells a Story</h2>
            <p style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "18px", lineHeight: 1.7, color: "#5C5C5C", maxWidth: "660px", margin: "0 auto"
            }}>At Zeppoli Bakers, we believe the finest celebrations deserve the finest cakes. We source only the richest Belgian cocoa, the creamiest dairy, and the freshest seasonal fruits — then give each creation the time and attention it deserves. Every ganache is poured warm, every sponge is tasted, every shaving is placed with care.</p>
          </div>
          <div className="welcome-grid reveal reveal-d2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
            <div style={{ overflow: "hidden", borderRadius: "8px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", aspectRatio: "1/1" }}>
              <img
                src="/product-2.jpg"
                alt="Artisan baker carefully frosting a blueberry cheesecake by hand"
                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              />
            </div>
            <div style={{ overflow: "hidden", borderRadius: "8px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", aspectRatio: "1/1" }}>
              <img
                src="/product-3.jpg"
                alt="Premium red velvet cake layers with cocoa and fresh ingredients"
                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CAKES CAROUSEL */}
      <section id="featured-cakes" style={{ backgroundColor: "#FFFFFF", padding: "96px 0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px", marginBottom: "48px" }}>
          <div className="reveal" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <span style={{
                display: "block", fontSize: "0.688rem", textTransform: "uppercase",
                letterSpacing: "0.15em", fontWeight: 600, color: "var(--muted)",
                fontFamily: "'Source Sans 3', sans-serif", marginBottom: "12px"
              }}>OUR BEST-LOVED CREATIONS</span>
              <h2 style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: "clamp(2rem, 3.5vw, 3rem)",
                fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.2, color: "#3A241F"
              }}>Featured Cakes</h2>
            </div>
            <button
              onClick={() => router.push("/shop")}
              style={{
                background: "none", border: "1px solid #B56A3C", color: "#B56A3C",
                borderRadius: "9999px", padding: "10px 24px",
                fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: "15px",
                cursor: "pointer", transition: "background 200ms ease, color 200ms ease",
                whiteSpace: "nowrap"
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#B56A3C"; e.currentTarget.style.color = "#fff" }}
              onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#B56A3C" }}
            >View All</button>
          </div>
        </div>
        <div
          ref={carouselRef}
          className="carousel-scroll"
          style={{
            display: "flex", gap: "40px",
            overflowX: "auto", paddingLeft: "48px", paddingRight: "48px", paddingBottom: "16px",
            cursor: "grab", userSelect: "none"
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {products.map((p, i) => (
            <article
              key={p.id}
              className={`reveal reveal-d${i + 1}`}
              style={{
                minWidth: "300px", maxWidth: "300px", borderRadius: "12px",
                background: "#FFFFFF", flexShrink: 0,
                boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
                transition: "transform 300ms cubic-bezier(0.4,0,0.2,1), box-shadow 300ms cubic-bezier(0.4,0,0.2,1)"
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-8px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px rgba(141,29,28,0.12)" }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 30px rgba(0,0,0,0.05)" }}
            >
              <div style={{ overflow: "hidden", borderRadius: "12px 12px 0 0" }}>
                <img
                  src={p.img}
                  alt={`${p.name} — artisan cake by Zeppoli Bakers`}
                  style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", display: "block", transition: "transform 400ms ease" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                />
              </div>
              <div style={{ padding: "20px 24px 24px" }}>
                <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "22px", color: "#3A241F", marginBottom: "6px" }}>{p.name}</h3>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "14px", color: "#7B7B7B", marginBottom: "12px", lineHeight: 1.5 }}>
                  {p.description.slice(0, 60)}…
                </p>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: "20px", color: "#B56A3C", marginBottom: "16px" }}>
                  ₹{p.price.toLocaleString("en-IN")}
                </p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
                    style={{
                      flex: 1, padding: "8px 14px", borderRadius: "9999px",
                      border: "1px solid #DDC2A7", background: "transparent",
                      fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: "14px",
                      color: "#3A241F", cursor: "pointer",
                      transition: "background 200ms ease, color 200ms ease"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#3A241F"; e.currentTarget.style.color = "#fff" }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#3A241F" }}
                  >View Details</button>
                  <button
                    onClick={() => handleAddToCart(p)}
                    style={{
                      flex: 1, padding: "8px 14px", borderRadius: "9999px",
                      border: "1px solid #B56A3C", background: addedStates[p.id] ? "#B56A3C" : "transparent",
                      fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: "14px",
                      color: addedStates[p.id] ? "#fff" : "#B56A3C", cursor: "pointer",
                      transition: "background 200ms ease, color 200ms ease, transform 150ms ease"
                    }}
                    onMouseEnter={e => { if (!addedStates[p.id]) { e.currentTarget.style.background = "#B56A3C"; e.currentTarget.style.color = "#fff" } }}
                    onMouseLeave={e => { if (!addedStates[p.id]) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#B56A3C" } }}
                    onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
                    onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                  >{addedStates[p.id] ? "✓ Added" : "Add to Cart"}</button>
                </div>
              </div>
            </article>
          ))}
          {/* Overflow hint ghost card */}
          <div style={{ minWidth: "32px", flexShrink: 0 }} />
        </div>
      </section>

      {/* OUR CRAFT & INGREDIENTS */}
      <section id="craft-section" style={{ backgroundColor: "#EDE7E1", padding: "96px 48px", overflow: "hidden" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div className="craft-grid" style={{ display: "grid", gridTemplateColumns: "60fr 40fr", gap: "80px", alignItems: "center" }}>
            {/* Text */}
            <div className="reveal">
              <span style={{
                display: "block", fontSize: "0.688rem", textTransform: "uppercase",
                letterSpacing: "0.15em", fontWeight: 600, color: "var(--muted)",
                fontFamily: "'Source Sans 3', sans-serif", marginBottom: "16px"
              }}>THE ZEPPOLI DIFFERENCE</span>
              <h2 style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: "clamp(2.2rem, 4vw, 3.6rem)",
                fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15, color: "#3A241F",
                marginBottom: "32px"
              }}>Ingredients as Premium<br />as the Occasion</h2>
              <p style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "17px", lineHeight: 1.75, color: "#5C5C5C", marginBottom: "20px"
              }}>We source single-origin Belgian cocoa from farms that prioritise sustainability and flavour complexity. Our dairy comes from grass-fed herds in the Nilgiris, delivering a creaminess you can taste in every slice. No artificial colours, no preservatives — just honest, exceptional ingredients treated with the respect they deserve.</p>
              <p style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "17px", lineHeight: 1.75, color: "#5C5C5C"
              }}>Our bakers have trained in classical French patisserie and adapted those techniques to Indian sensibilities — knowing that a celebratory cake must satisfy both the eye and the palate. Each tier is baked in small batches, ensuring consistent texture and flavour in every single order.</p>
              <div style={{ display: "flex", gap: "40px", marginTop: "40px" }}>
                {[["100%", "Belgian Cocoa"], ["0g", "Artificial Colour"], ["Daily", "Fresh Baked"]].map(([val, label]) => (
                  <div key={label}>
                    <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: "2rem", color: "#B56A3C" }}>{val}</div>
                    <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "14px", color: "var(--muted)", marginTop: "4px" }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image with clip-path */}
            <div className="reveal reveal-d2" style={{
              overflow: "hidden",
              clipPath: "polygon(0% 0%, 100% 8%, 100% 100%, 0% 92%)",
              aspectRatio: "3/2"
            }}>
              <img
                src="/product-4.jpg"
                alt="Close-up of premium caramel cake showcasing rich ganache texture and artisan baking craft"
                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              />
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS AUTO-SCROLL */}
      <section style={{ backgroundColor: "#DDC2A7", padding: "80px 0", overflow: "hidden" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px", marginBottom: "48px" }}>
          <div className="reveal" style={{ textAlign: "center" }}>
            <span style={{
              display: "block", fontSize: "0.688rem", textTransform: "uppercase",
              letterSpacing: "0.15em", fontWeight: 600, color: "#7B5C3E",
              fontFamily: "'Source Sans 3', sans-serif", marginBottom: "12px"
            }}>CUSTOMER FAVORITES</span>
            <h2 style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
              fontWeight: 700, letterSpacing: "-0.03em", color: "#3A241F"
            }}>What Our Customers Say</h2>
          </div>
        </div>
        <div style={{ overflow: "hidden" }}>
          <div className="marquee-track">
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={i} style={{
                minWidth: "520px", maxWidth: "520px", marginRight: "32px",
                background: "#FFFFFF", borderRadius: "16px",
                padding: "40px", minHeight: "200px"
              }}>
                <div style={{ display: "flex", gap: "4px", marginBottom: "16px" }}>
                  {[...Array(t.stars)].map((_, si) => (
                    <svg key={si} width="16" height="16" viewBox="0 0 24 24" fill="#B56A3C" stroke="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
                <p style={{
                  fontFamily: "'Source Sans 3', sans-serif", fontSize: "18px",
                  fontStyle: "italic", lineHeight: 1.6, color: "#3A241F", marginBottom: "20px"
                }}>"{t.text}"</p>
                <span style={{
                  fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600,
                  fontSize: "15px", color: "#B56A3C"
                }}>— {t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEASONAL & GIFTING */}
      <section style={{ backgroundColor: "#F4E8E2", padding: "96px 48px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div className="seasonal-grid reveal" style={{ display: "grid", gridTemplateColumns: "60fr 40fr", gap: "64px", alignItems: "center" }}>
            {/* Image */}
            <div style={{ overflow: "hidden", borderRadius: "16px", aspectRatio: "4/3" }}>
              <img
                src="/product-1.jpg"
                alt="Beautifully presented Zeppoli Bakers gift box featuring a classic chocolate cake — perfect for celebrations"
                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              />
            </div>
            {/* Text */}
            <div>
              <span style={{
                display: "block", fontSize: "0.688rem", textTransform: "uppercase",
                letterSpacing: "0.15em", fontWeight: 600, color: "var(--muted)",
                fontFamily: "'Source Sans 3', sans-serif", marginBottom: "16px"
              }}>SPECIAL OCCASIONS & GIFTING</span>
              <h2 style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: "clamp(2rem, 3.5vw, 3.2rem)",
                fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15, color: "#3A241F",
                marginBottom: "20px"
              }}>The Gift of Indulgence</h2>
              <p style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "16px", lineHeight: 1.75, color: "#5C5C5C", marginBottom: "32px"
              }}>Mark every milestone with a cake as memorable as the moment. Our curated gift boxes and bespoke celebration cakes are crafted to order, wrapped in signature packaging, and delivered fresh. From intimate birthdays to grand corporate gifting — Zeppoli Bakers is your partner in making every event unforgettable.</p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <button
                  onClick={() => router.push("/shop")}
                  style={{
                    padding: "14px 28px", borderRadius: "4px", border: "none",
                    background: "#B56A3C", color: "#fff",
                    fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: "16px",
                    cursor: "pointer", transition: "transform 150ms ease, box-shadow 150ms ease",
                    boxShadow: "0 8px 24px -6px rgba(181,106,60,0.4)"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 12px 32px -6px rgba(181,106,60,0.5)" }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 8px 24px -6px rgba(181,106,60,0.4)" }}
                  onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
                  onMouseUp={e => e.currentTarget.style.transform = "scale(1.02)"}
                >Explore Gifts</button>
                <button
                  onClick={() => router.push("/shop")}
                  style={{
                    padding: "14px 28px", borderRadius: "4px",
                    border: "2px solid #B56A3C", background: "transparent",
                    color: "#B56A3C", fontFamily: "'Source Sans 3', sans-serif",
                    fontWeight: 600, fontSize: "16px", cursor: "pointer",
                    transition: "background 200ms ease, color 200ms ease, transform 150ms ease"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#B56A3C"; e.currentTarget.style.color = "#fff" }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#B56A3C" }}
                  onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
                  onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                >Discover Seasonal</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FULL-WIDTH CTA BANNER */}
      <section style={{ backgroundColor: "#B56A3C", padding: "96px 48px", textAlign: "center" }}>
        <div className="reveal" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: "clamp(2rem, 3.5vw, 3rem)",
            fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2,
            color: "#FFFFFF", marginBottom: "36px"
          }}>Ready to Indulge? Explore Our Full Collection</h2>
          <button
            onClick={() => router.push("/shop")}
            style={{
              padding: "14px 40px", borderRadius: "9999px",
              border: "2px solid #FFFFFF", background: "transparent",
              color: "#FFFFFF", fontFamily: "'Source Sans 3', sans-serif",
              fontWeight: 600, fontSize: "18px", cursor: "pointer",
              transition: "background 200ms ease, color 200ms ease, transform 150ms ease"
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#FFFFFF"; e.currentTarget.style.color = "#B56A3C" }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#FFFFFF" }}
            onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
            onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
          >Shop Now</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: "#3A241F", padding: "80px 48px 0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1.3fr", gap: "56px", marginBottom: "64px" }}>
            {/* Col 1: Brand */}
            <div>
              <div style={{ padding: "4px 8px", borderRadius: "8px", background: "rgba(255,255,255,0.06)", display: "inline-block", marginBottom: "16px" }}>
                <img src="/logo.png" alt="Zeppoli Bakers logo" style={{ height: "32px", objectFit: "contain", opacity: 0.9 }} />
              </div>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "14px", color: "#CCCCCC", lineHeight: 1.7, marginBottom: "24px", maxWidth: "240px" }}>
                Indulgence Crafted with Love — baked fresh daily in the heart of India.
              </p>
              <div style={{ display: "flex", gap: "16px" }}>
                {/* Instagram */}
                <button aria-label="Instagram" style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </button>
                {/* Facebook */}
                <button aria-label="Facebook" style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </button>
                {/* Pinterest */}
                <button aria-label="Pinterest" style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFFFFF" stroke="none">
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Col 2: Shop */}
            <div>
              <h4 style={{ fontFamily: "'Source Sans 3', sans-serif", textTransform: "uppercase", fontSize: "12px", letterSpacing: "0.1em", fontWeight: 600, color: "#FFFFFF", marginBottom: "20px" }}>Shop</h4>
              {["Our Cakes", "Chocolate Cakes", "Seasonal Specials", "Gift Cards"].map(link => (
                <button key={link} onClick={() => router.push("/shop")} style={{
                  display: "block", background: "none", border: "none", cursor: "pointer", padding: "0", marginBottom: "0",
                  fontFamily: "'Source Sans 3', sans-serif", fontSize: "15px", lineHeight: "2.2",
                  color: "#CCCCCC", textAlign: "left",
                  transition: "color 200ms ease"
                }}
                  onMouseEnter={e => e.currentTarget.style.color = "#FFFFFF"}
                  onMouseLeave={e => e.currentTarget.style.color = "#CCCCCC"}
                >{link}</button>
              ))}
            </div>

            {/* Col 3: Learn */}
            <div>
              <h4 style={{ fontFamily: "'Source Sans 3', sans-serif", textTransform: "uppercase", fontSize: "12px", letterSpacing: "0.1em", fontWeight: 600, color: "#FFFFFF", marginBottom: "20px" }}>Learn</h4>
              {[
                { label: "Our Story", action: () => document.getElementById("craft-section")?.scrollIntoView({ behavior: "smooth" }) },
                { label: "The Craft", action: () => document.getElementById("craft-section")?.scrollIntoView({ behavior: "smooth" }) },
                { label: "Blog", action: () => router.push("/shop") },
                { label: "FAQs", action: () => router.push("/shop") },
                { label: "Contact Us", action: () => router.push("/shop") },
              ].map(link => (
                <button key={link.label} onClick={link.action} style={{
                  display: "block", background: "none", border: "none", cursor: "pointer", padding: "0",
                  fontFamily: "'Source Sans 3', sans-serif", fontSize: "15px", lineHeight: "2.2",
                  color: "#CCCCCC", textAlign: "left",
                  transition: "color 200ms ease"
                }}
                  onMouseEnter={e => e.currentTarget.style.color = "#FFFFFF"}
                  onMouseLeave={e => e.currentTarget.style.color = "#CCCCCC"}
                >{link.label}</button>
              ))}
            </div>

            {/* Col 4: Newsletter */}
            <div>
              <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: "18px", color: "#FFFFFF", marginBottom: "16px" }}>Stay in the Loop</h3>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "14px", color: "#CCCCCC", lineHeight: 1.6, marginBottom: "20px" }}>
                Fresh recipes, new launches, and sweet surprises — delivered to your inbox.
              </p>
              {subscribed ? (
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "15px", color: "#B56A3C", fontWeight: 600 }}>
                  Thank you for subscribing! 🎂
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Your email address"
                    style={{
                      height: "48px", padding: "0 16px",
                      border: "1px solid #CCCCCC", borderRadius: "4px",
                      background: "transparent", color: "#FFFFFF",
                      fontFamily: "'Source Sans 3', sans-serif", fontSize: "15px",
                      outline: "none"
                    }}
                  />
                  <button
                    onClick={() => { if (email.includes("@")) setSubscribed(true) }}
                    style={{
                      height: "48px", borderRadius: "4px", border: "none",
                      background: "#B56A3C", color: "#FFFFFF",
                      fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: "15px",
                      cursor: "pointer", transition: "transform 150ms ease, opacity 150ms ease"
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                    onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
                    onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                  >Subscribe</button>
                </div>
              )}
            </div>
          </div>

          {/* Bottom strip */}
          <div style={{ borderTop: "1px solid #5C5C5C", padding: "24px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              {["© 2026 Zeppoli Bakers", "Privacy Policy", "Terms of Service"].map((item, i) => (
                <button key={item} onClick={i > 0 ? () => router.push("/shop") : undefined} style={{
                  background: "none", border: "none", cursor: i > 0 ? "pointer" : "default",
                  fontFamily: "'Source Sans 3', sans-serif", fontSize: "13px", color: "#AAAAAA",
                  padding: 0,
                  transition: i > 0 ? "color 200ms ease" : "none"
                }}
                  onMouseEnter={i > 0 ? e => e.currentTarget.style.color = "#FFFFFF" : undefined}
                  onMouseLeave={i > 0 ? e => e.currentTarget.style.color = "#AAAAAA" : undefined}
                >{item}{i < 2 ? " ·" : ""}</button>
              ))}
            </div>
            {/* Payment icons */}
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              {/* Visa */}
              <svg width="38" height="24" viewBox="0 0 38 24" fill="none" style={{ opacity: 0.7 }}>
                <rect width="38" height="24" rx="4" fill="#1A1F71"/>
                <text x="6" y="16" fontFamily="Arial" fontSize="11" fontWeight="bold" fill="white">VISA</text>
              </svg>
              {/* Mastercard */}
              <svg width="38" height="24" viewBox="0 0 38 24" fill="none" style={{ opacity: 0.7 }}>
                <rect width="38" height="24" rx="4" fill="#252525"/>
                <circle cx="14" cy="12" r="7" fill="#EB001B"/>
                <circle cx="24" cy="12" r="7" fill="#F79E1B"/>
                <path d="M19 7.1a7 7 0 0 1 0 9.8A7 7 0 0 1 19 7.1z" fill="#FF5F00"/>
              </svg>
              {/* UPI */}
              <svg width="38" height="24" viewBox="0 0 38 24" fill="none" style={{ opacity: 0.7 }}>
                <rect width="38" height="24" rx="4" fill="#FFFFFF" fillOpacity="0.1"/>
                <text x="5" y="16" fontFamily="Arial" fontSize="10" fontWeight="bold" fill="white">UPI</text>
              </svg>
              {/* RuPay */}
              <svg width="38" height="24" viewBox="0 0 38 24" fill="none" style={{ opacity: 0.7 }}>
                <rect width="38" height="24" rx="4" fill="#005691"/>
                <text x="3" y="16" fontFamily="Arial" fontSize="9" fontWeight="bold" fill="white">RuPay</text>
              </svg>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}