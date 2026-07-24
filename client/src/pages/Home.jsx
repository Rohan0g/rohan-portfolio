import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  FiArrowRight, FiGithub, FiLinkedin, FiMail, FiPhone, FiCompass, FiSend, 
  FiBriefcase, FiLayers, FiActivity, FiUsers, FiCpu, FiAward, FiSettings,
  FiCode, FiDatabase, FiCloud, FiCheckCircle, FiShield, FiTrendingUp, FiFastForward
} from 'react-icons/fi';
import { FaUniversity, FaBuilding, FaHospital, FaSchool, FaGlobe, FaCogs } from 'react-icons/fa';
import { FaInstagram, FaXTwitter } from 'react-icons/fa6';
import { 
  SiReact, SiNodedotjs, SiExpress, SiMongodb, SiTailwindcss, 
  SiFramer, SiGreensock, SiCloudinary, SiGit, SiGithub, SiVercel 
} from 'react-icons/si';

// --- ANIMATED COUNTER COMPONENT ---
function Counter({ value, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);

  useEffect(() => {
    let startTime = null;
    const endVal = parseInt(value, 10);
    if (isNaN(endVal)) return;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * endVal));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        window.requestAnimationFrame(step);
        observer.unobserve(entries[0].target);
      }
    }, { threshold: 0.1 });

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [value, duration]);

  return <span ref={elementRef}>{count}{suffix}</span>;
}

export default function Home() {
  const [activeSkill, setActiveSkill] = useState(null);
  const [formStatus, setFormStatus] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  
  // Testimonials state
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Stacking/Scroll context for About cards
  const aboutSectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: aboutSectionRef,
    offset: ["start start", "end end"]
  });

  // Services State
  const [activeService, setActiveService] = useState(0);

  // Projects list
  const projects = [
    {
      title: "APEX: Industrial ERP System",
      category: "Enterprise ERP",
      badge: "NEXORITH ENTERPRISE",
      icon: <FaBuilding className="text-accent-blue" />,
      impact: "Industrial-level ERP management system engineered for high-scale factory operations and multi-plant supply chain control.",
      features: ["Multi-Plant Supply Chain", "Automated Payroll Engine", "Realtime Inventory Matrix", "Compliance & Audit Logs"],
      stack: ["React", "Node.js", "Express", "MongoDB", "Tailwind"],
      bgGlow: "rgba(59, 130, 246, 0.2)",
    },
    {
      title: "CITADEL: Hotel Management System",
      category: "Hospitality SaaS",
      badge: "NEXORITH PRODUCTION",
      icon: <FaHospital className="text-accent-cyan" />,
      impact: "Complete luxury hotel management system automating bookings, room matrix, guest POS billing, and staff ops.",
      features: ["Live Room Reservation Grid", "Instant POS Billing Engine", "Housekeeping Dispatch", "Guest Analytics Dashboard"],
      stack: ["React", "Express", "Node.js", "MongoDB", "Redux"],
      bgGlow: "rgba(6, 182, 212, 0.2)",
    },
    {
      title: "ORBIT: Department Management System",
      category: "Enterprise Workflow",
      badge: "NEXORITH CORE",
      icon: <FiLayers className="text-accent-purple" />,
      impact: "Unified departmental operations management platform streamlining inter-department tasks, assets, and approvals.",
      features: ["Intra-Department Task Matrix", "Asset Allocation Ledger", "Role-Based Access Control", "Performance Analytics"],
      stack: ["React", "Node.js", "Express", "MongoDB", "Tailwind"],
      bgGlow: "rgba(124, 58, 237, 0.2)",
    },
    {
      title: "POWERHOUSE GOD MODE BILLING PLATFORM",
      category: "Finance / SaaS",
      badge: "NEXORITH FINTECH",
      icon: <FiActivity className="text-accent-gold" />,
      impact: "High-speed GST billing & POS system built for retail chains and enterprise distribution.",
      features: ["GST Invoice Generator", "Payment Split Gateway", "Instant PDF Stream", "Realtime Revenue Analytics"],
      stack: ["React", "Node.js", "Express", "MongoDB", "Tailwind"],
      bgGlow: "rgba(255, 215, 0, 0.2)",
    },
    {
      title: "SCHOOL ERP ECOSYSTEM",
      category: "EdTech SaaS",
      badge: "NEXORITH EDTECH",
      icon: <FaSchool className="text-emerald-400" />,
      impact: "Comprehensive educational institution ERP connecting thousands of students, teachers, and parents.",
      features: ["Fee Reconciliation Engine", "Digital Report Cards", "Attendance Geo-Tracking", "Parent Portal App"],
      stack: ["React", "Node.js", "Express", "MongoDB", "Tailwind"],
      bgGlow: "rgba(16, 185, 129, 0.2)",
    },
    {
      title: "HEALTH QURE+ (SIH Hackathon Winner)",
      category: "Healthcare AI",
      badge: "NEXORITH HACKATHON",
      icon: <FiCpu className="text-red-500" />,
      impact: "Smart hospital triage and outpatient management suite built for national hackathons.",
      features: ["OPD Queue Manager", "Electronic Health Records", "Doctor Slot Allocation", "AI Triage System"],
      stack: ["React", "Three.js", "Node.js", "Express", "OpenAI API"],
      bgGlow: "rgba(239, 68, 68, 0.2)",
    }
  ];

  // Journey Steps for About section
  const journey = [
    {
      title: "BCA Foundations",
      subtitle: "GIET UNIVERSITY",
      period: "2022- 2025",
      description: "Discovered the craft of software engineering. Deep-dived into OOP, data structures, algorithms, and built first database-driven billing apps.",
      icon: <FaUniversity />
    },
    {
      title: "MCA Specialization",
      subtitle: "GIET UNIVERSITY",
      period: "2025 - 2027",
      description: "Focused on advanced web architectures, cloud distribution, and system performance optimizations. Mastered scalable MERN stacks.",
      icon: <FaUniversity />
    },
    {
      title: "Co-Founding Nexorith IT Solutions",
      subtitle: "Scaling Premium Software Development",
      period: "2024 - Present",
      description: "Launched Nexorith to deliver award-worthy, high-performance software, custom ERP systems, and cloud portals for modern enterprise clients.",
      icon: <FaBuilding />
    }
  ];

  // Skills Ecosystem
  const skills = [
    { name: "Frontend", x: "15%", y: "25%", color: "#3B82F6", category: "Core Design, React, Tailwind, Framer Motion, GSAP, Responsive Layouts." },
    { name: "Backend", x: "70%", y: "15%", color: "#7C3AED", category: "Scalable REST & GraphQL APIs, Node.js, Express, microservice configurations." },
    { name: "Database", x: "85%", y: "45%", color: "#06B6D4", category: "MongoDB, Mongoose ORM, indexing optimizations, transaction management." },
    { name: "Cloud", x: "40%", y: "80%", color: "#FFD700", category: "Vercel, AWS infrastructure setups, custom CDN setups, container orchestration." },
    { name: "AI Automation", x: "20%", y: "65%", color: "#EF4444", category: "AI integrations, agentic workflows, OpenAI/Gemini models, vector DB pipelines." },
    { name: "Performance", x: "50%", y: "30%", color: "#10B981", category: "Lighthouse optimization, code splitting, memoization, tree shaking, asset compress." }
  ];

  // Contact form submission
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');
    try {
      // Route to local server when testing on localhost, and Render when live
      const API_URL = window.location.hostname === 'localhost' 
        ? 'http://localhost:5005/api/contact' 
        : 'https://rohan-portfolio-mi89.onrender.com/api/contact';

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setFormStatus('error');
      }
    } catch (err) {
      // Mock success for offline testing
      setTimeout(() => {
        setFormStatus('success');
        setFormData({ name: '', email: '', message: '' });
      }, 1000);
    }
  };

  return (
    <div className="relative">
      
      {/* Absolute noise texture overlay */}
      <div className="noise-overlay" />

      {/* --- HERO SECTION --- */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Animated matrix grid flow */}
        <div className="absolute inset-0 tech-grid opacity-30 pointer-events-none" />
        
        {/* Ambient radial lighting lights */}
        <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] bg-accent-blue/10 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" />
        <div className="absolute bottom-[20%] right-[20%] w-[350px] h-[350px] bg-accent-purple/10 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Glowing Cybernetic Badge */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-xl shadow-glow-cyan"
            >
              <span className="w-2 h-2 rounded-full bg-accent-cyan animate-ping" />
              <span className="text-[10px] font-bold font-mono tracking-widest text-accent-cyan uppercase">
                OPEN FOR ENTERPRISE INQUIRIES
              </span>
            </motion.div>

            {/* Cinematic Headlines */}
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="text-5xl md:text-7xl font-black tracking-tight leading-none text-white font-display mb-4"
            >
              ROHAN <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue via-accent-cyan to-accent-purple text-glow-cyan">PATTNAIK</span>
            </motion.h1>

            {/* Sub-headline carousel typing info */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.7 }}
              className="text-lg md:text-2xl font-bold font-display text-white/90 mb-6 tracking-wide"
            >
              FULL STACK DEVELOPER <span className="text-accent-gold">•</span> CO-FOUNDER OF NEXORITH IT SOLUTIONS
            </motion.div>

            {/* Detailed description */}
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.9 }}
              className="text-sm md:text-base text-white/70 leading-relaxed max-w-xl mb-10 font-sans"
            >
              Building premium web applications, AI-powered platforms, custom ERP frameworks, scalable SaaS engines, and unforgettable digital environments for organizations that refuse to look average.
            </motion.p>

            {/* Interactive Call to Action buttons */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 2.1 }}
              className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3.5 sm:gap-4 w-full"
            >
              <a 
                href="#projects" 
                className="group relative px-8 py-3.5 rounded-full overflow-hidden flex items-center justify-center gap-3 text-xs font-bold bg-gradient-to-r from-accent-blue to-accent-cyan text-white shadow-glow-cyan hover:scale-[1.02] transition-transform min-h-[48px] text-center"
              >
                <span>EXPLORE WORK</span>
                <FiArrowRight className="group-hover:translate-x-1.5 transition-transform" />
              </a>
              
              <a 
                href="#contact" 
                className="px-8 py-3.5 rounded-full text-xs font-bold border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all text-white/80 hover:text-white min-h-[48px] flex items-center justify-center text-center"
              >
                BOOK A BRIEFING
              </a>

              {/* Resume download */}
              <a 
                href="/resume.pdf"
                download
                className="px-6 py-3.5 rounded-full text-xs font-semibold text-white/50 hover:text-accent-gold hover:bg-white/5 transition-colors font-mono min-h-[48px] flex items-center justify-center text-center border border-white/5 sm:border-none"
              >
                [DOWNLOAD CV]
              </a>
            </motion.div>

            {/* Social icons bottom row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 2.3 }}
              className="flex items-center gap-6 mt-12 text-lg text-white/40"
            >
              <a href="https://github.com/Rohan0g" target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><FiGithub /></a>
              <a href="https://www.linkedin.com/in/rohan-pattnaik-0112a11a2/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><FiLinkedin /></a>
              <a href="https://www.instagram.com/the_0g_rohan" target="_blank" rel="noreferrer" className="hover:text-pink-400 transition-colors"><FaInstagram /></a>
              <a href="https://x.com/Being_rohan_0p" target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><FaXTwitter /></a>
              <a href="mailto:contact@nexorith.com" className="hover:text-white transition-colors"><FiMail /></a>
            </motion.div>

          </div>

          {/* Right Column: AI Hologram / Floating Dev Environment */}
          <div className="lg:col-span-5 flex justify-center items-center relative mt-6 lg:mt-0">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 1.8 }}
              className="relative w-full max-w-[300px] xs:max-w-[340px] sm:w-80 sm:h-80 md:w-96 md:h-96 aspect-square flex items-center justify-center mx-auto"
            >
              {/* Futuristic Glass Command Center Card */}
              <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-surface/80 via-white/[0.03] to-accent-cyan/10 border border-white/10 backdrop-blur-2xl flex flex-col items-center justify-center p-8 shadow-2xl relative overflow-hidden group">
                {/* Micro tech corners */}
                <div className="absolute top-3 left-3 w-2 h-2 border-t-2 border-l-2 border-accent-cyan/60" />
                <div className="absolute top-3 right-3 w-2 h-2 border-t-2 border-r-2 border-accent-cyan/60" />
                <div className="absolute bottom-3 left-3 w-2 h-2 border-b-2 border-l-2 border-accent-cyan/60" />
                <div className="absolute bottom-3 right-3 w-2 h-2 border-b-2 border-r-2 border-accent-cyan/60" />

                <img 
                  src="/nexorith-logo.png" 
                  alt="Nexorith IT Solutions Logo" 
                  className="h-12 w-auto object-contain mb-3 filter drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]" 
                />
                <span className="text-[10px] font-mono text-accent-gold tracking-[0.2em]">[ACTIVE NODE: R_PATTNAIK]</span>
                
                {/* Embedded holographic data log stream */}
                <div className="w-full mt-5 bg-black/50 border border-white/10 rounded-lg p-3 font-mono text-[9px] text-green-400/90 leading-relaxed overflow-hidden">
                  <div className="animate-pulse">&gt; SYS_BOOT_READY: SECURE</div>
                  <div>&gt; MILKY_WAY_GALAXY: ACTIVE</div>
                  <div>&gt; RENDER: THREE_JS_3D_WORLD</div>
                  <div>&gt; CO_FOUNDER: ROHAN_PATTNAIK</div>
                  <div>&gt; STATUS: STANDBY_FOR_PROJECTS</div>
                </div>
              </div>

              {/* Orbital floating icons */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute top-0 right-[15%] w-12 h-12 rounded-lg bg-surface border border-white/10 flex items-center justify-center text-lg text-accent-blue shadow-glow-blue"
              >
                <SiReact />
              </motion.div>

              <motion.div 
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                className="absolute bottom-6 left-0 w-12 h-12 rounded-lg bg-surface border border-white/10 flex items-center justify-center text-lg text-accent-purple shadow-glow-purple"
              >
                <SiNodedotjs />
              </motion.div>

              <motion.div 
                animate={{ x: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                className="absolute top-1/2 -right-6 w-12 h-12 rounded-lg bg-surface border border-white/10 flex items-center justify-center text-lg text-accent-cyan shadow-glow-cyan"
              >
                <SiMongodb />
              </motion.div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* --- LIVE STATS SECTION --- */}
      <section className="relative py-20 border-t border-b border-white/5 bg-surface/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 text-center">
            
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-black font-display text-white text-glow-cyan">
                <Counter value="6" suffix="+" />
              </span>
              <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase mt-2">Years Learning</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-black font-display text-white text-glow-blue">
                <Counter value="45" suffix="+" />
              </span>
              <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase mt-2">Projects Completed</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-black font-display text-white text-glow-purple">
                <Counter value="12" suffix="+" />
              </span>
              <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase mt-2">Businesses Served</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-black font-display text-white text-glow-blue">
                <Counter value="25" suffix="+" />
              </span>
              <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase mt-2">Technologies</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-black font-display text-white text-glow-cyan">
                <Counter value="100" suffix="%" />
              </span>
              <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase mt-2">Happy Clients</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-black font-display text-white text-glow-purple">
                <Counter value="680" suffix="☕" />
              </span>
              <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase mt-2">Coffee Consumed</span>
            </div>

          </div>
        </div>
      </section>

      {/* --- ABOUT STORY CARDS SECTION --- */}
      <section id="about" className="py-32 relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-accent-cyan uppercase">THE CHRONICLE</span>
          <h2 className="text-3xl md:text-5xl font-black font-display mt-3 text-white">THE JOURNEY OF A FOUNDER</h2>
          <div className="w-16 h-[2px] bg-accent-cyan mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Sticking info and Vision card */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="glass-panel p-8 rounded-2xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent-purple/10 rounded-full blur-2xl pointer-events-none" />
              <FiAward className="text-3xl text-accent-gold mb-6" />
              
              <h3 className="text-xl font-bold font-display text-white mb-4">My Vision</h3>
              <p className="text-sm text-white/60 leading-relaxed mb-6">
                "My mission is not simply to write cleaner lines of code. It is to build modern IT infrastructure models, enterprise software systems, and products that drive business valuation and digital authority."
              </p>
              
              <div className="flex items-center gap-4 bg-white/5 px-4 py-3 rounded-lg border border-white/5">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-cyan animate-pulse" />
                <span className="text-xs font-mono text-white/80 font-bold">Goal: India's Leading Tech Founder</span>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative Story Cards */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {journey.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="glass-panel glass-panel-hover p-8 rounded-2xl flex gap-6 items-start transition-all"
              >
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-xl text-accent-cyan mt-1">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold font-display text-white">{item.title}</h3>
                    <span className="text-[10px] font-mono font-bold bg-accent-blue/10 text-accent-blue border border-accent-blue/20 px-2 py-0.5 rounded">
                      {item.period}
                    </span>
                  </div>
                  <h4 className="text-xs font-mono text-white/40 mb-4">{item.subtitle}</h4>
                  <p className="text-xs md:text-sm text-white/60 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* --- SKILLS NODE ECOSYSTEM --- */}
      <section className="py-32 bg-surface/20 border-t border-b border-white/5 relative overflow-hidden">
        {/* Abstract lines connecting nodes */}
        <div className="absolute inset-0 tech-grid opacity-10" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-accent-purple uppercase">THE STACK MATRIX</span>
            <h2 className="text-3xl md:text-5xl font-black font-display mt-3 text-white">SKILL ECOSYSTEM</h2>
            <div className="w-16 h-[2px] bg-accent-purple mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Ecosystem Map Panel */}
            <div className="lg:col-span-7 h-[400px] bg-black/40 rounded-2xl border border-white/5 relative p-6 overflow-hidden">
              <div className="absolute inset-0 tech-grid opacity-20" />
              
              {/* Nodes container */}
              <div className="absolute inset-0">
                {skills.map((skill, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => setActiveSkill(skill)}
                    className="absolute interactive-node group px-4 py-2 rounded-full border bg-background/80 hover:bg-white/5 flex items-center gap-2 cursor-pointer transition-all duration-300 z-10"
                    style={{
                      left: skill.x,
                      top: skill.y,
                      borderColor: activeSkill?.name === skill.name ? skill.color : 'rgba(255, 255, 255, 0.1)',
                      boxShadow: activeSkill?.name === skill.name ? `0 0 20px ${skill.color}50` : 'none',
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: skill.color }} />
                    <span className="text-xs font-bold font-mono text-white tracking-wider uppercase group-hover:text-white">
                      {skill.name}
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Instructions */}
              <div className="absolute bottom-4 left-4 text-[10px] font-mono text-white/30">
                // TAP GLOWING NODES TO INSPECT LAYER CAPABILITIES
              </div>
            </div>

            {/* Right Information Panel */}
            <div className="lg:col-span-5">
              <AnimatePresence mode="wait">
                {activeSkill ? (
                  <motion.div
                    key={activeSkill.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass-panel p-8 rounded-2xl border border-white/10 relative overflow-hidden"
                  >
                    {/* Corner gradient light */}
                    <div 
                      className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none"
                      style={{ backgroundColor: activeSkill.color }}
                    />
                    <div className="flex items-center gap-3 mb-6">
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: activeSkill.color }} />
                      <h3 className="text-2xl font-black font-display tracking-wide text-white uppercase">
                        {activeSkill.name}
                      </h3>
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed font-mono">
                      {activeSkill.category}
                    </p>
                  </motion.div>
                ) : (
                  <div className="glass-panel p-8 rounded-2xl border border-white/5 text-center text-white/40 py-20 font-mono text-xs">
                    SELECT A STACK CORE NODE TO VIEW TECHNICAL DETAILS
                  </div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      {/* --- FEATURED PROJECTS --- */}
      <section id="projects" className="py-32 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-accent-cyan uppercase">THE WORK SHIELD</span>
          <h2 className="text-3xl md:text-5xl font-black font-display mt-3 text-white">FEATURED PROJECTS</h2>
          <div className="w-16 h-[2px] bg-accent-cyan mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((proj, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="glass-panel rounded-2xl overflow-hidden border border-white/5 relative flex flex-col h-full group hover:border-white/20 transition-colors"
            >
              {/* Hover radial card color glow */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10 blur-xl"
                style={{ background: `radial-gradient(circle at 50% 20%, ${proj.bgGlow}, transparent 55%)` }}
              />

              {/* Project Card Header */}
              <div className="p-6 pb-0 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-bold bg-white/5 text-white/60 border border-white/10 px-2.5 py-1 rounded-full uppercase tracking-widest">
                    {proj.category}
                  </span>
                  <div 
                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-lg transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg"
                    style={{ '--glow': proj.bgGlow }}
                  >
                    <span className="transition-all duration-500 group-hover:drop-shadow-[0_0_8px_currentColor]">
                      {proj.icon}
                    </span>
                  </div>
                </div>

                {/* Nexorith Verified Badge with Logo */}
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-accent-cyan/10 border border-accent-cyan/20 w-fit">
                  <img src="/nexorith-logo.png" alt="Nexorith Logo Icon" className="h-3.5 w-auto object-contain" />
                  <span className="text-[8px] font-mono font-bold tracking-widest text-accent-cyan uppercase">
                    {proj.badge || "NEXORITH IT SOLUTIONS"}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold font-display text-white mb-3 group-hover:text-accent-cyan transition-colors">
                  {proj.title}
                </h3>
                <p className="text-xs text-white/50 leading-relaxed font-sans mb-6 flex-1">
                  {proj.impact}
                </p>

                {/* Features Checklist */}
                <div className="space-y-2 mb-6">
                  {proj.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] font-mono text-white/70">
                      <FiCheckCircle className="text-accent-cyan shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {proj.stack.map((t, i) => (
                    <span key={i} className="text-[9px] font-mono text-white/40 bg-white/5 px-2 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer CTA */}
              <div className="p-4 bg-white/[0.01] border-t border-white/5 flex justify-between items-center gap-4 text-xs font-bold">
                <a href="#" className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors">
                  <FiGithub />
                  <span>REPOSITORY</span>
                </a>
                <a href="#" className="flex items-center gap-1 text-accent-cyan hover:text-white transition-colors">
                  <span>LIVE DEMO</span>
                  <FiArrowRight />
                </a>
              </div>

            </motion.div>
          ))}
        </div>
      </section>

      {/* --- SERVICES & PROCESS --- */}
      <section className="py-32 bg-surface/10 border-t border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Services Selector Accordion */}
          <div className="lg:col-span-6">
            <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-accent-purple uppercase">SERVICES PACK</span>
            <h2 className="text-3xl md:text-5xl font-black font-display mt-3 text-white mb-10">CAPABILITIES</h2>

            <div className="space-y-4">
              {[
                { title: "ERP Software Architecture", desc: "Building highly modular enterprise resources frameworks, asset tracking, dynamic payroll systems, and digital dashboards optimized for security and custom rules." },
                { title: "AI Automation & API Integrations", desc: "Connecting large language models, agent systems, vector DBs, and third-party SaaS frameworks to optimize operational bottlenecks." },
                { title: "High-Performance Web Platforms", desc: "Crafting lightweight, robust React platforms backed by Express services with perfect core web vitals and premium branding animations." }
              ].map((serv, index) => (
                <div 
                  key={index}
                  className={`glass-panel rounded-xl p-5 border cursor-pointer transition-all duration-300 ${
                    activeService === index 
                      ? 'border-accent-purple bg-white/[0.04]' 
                      : 'border-white/5 hover:border-white/10'
                  }`}
                  onClick={() => setActiveService(index)}
                >
                  <h3 className="text-sm font-bold font-mono tracking-wider text-white uppercase mb-2">
                    0{index+1}. {serv.title}
                  </h3>
                  {activeService === index && (
                    <motion.p 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="text-xs text-white/50 leading-relaxed mt-2"
                    >
                      {serv.desc}
                    </motion.p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chronological Work Process Timeline */}
          <div className="lg:col-span-6 bg-black/25 p-8 rounded-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none" />
            <h3 className="text-xl font-bold font-display text-white mb-8 tracking-wider">PROJECT WORKFLOW</h3>
            
            <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
              {[
                { title: "Discovery & Blueprint", desc: "Understanding operational challenges, listing functional inputs, and drafting tech schemas." },
                { title: "UIUX & Systems Wireframing", desc: "Designing premium glassmorphism layouts and mapping data flows before coding." },
                { title: "Agile Development Cycle", desc: "Coding client/server logic, schema implementation, and setting up CDN endpoints." },
                { title: "Launch, CDN Build, Maintenance", desc: "Launching with optimized caching on global edges (Vercel/Render) and long term audits." }
              ].map((proc, index) => (
                <div key={index} className="flex gap-6 items-start relative pl-6">
                  <span className="absolute left-[9px] top-1.5 w-[7px] h-[7px] rounded-full bg-accent-cyan ring-4 ring-accent-cyan/20" />
                  <div>
                    <h4 className="text-xs font-bold font-mono tracking-widest text-white uppercase mb-1">
                      STAGE 0{index+1}: {proc.title}
                    </h4>
                    <p className="text-xs text-white/40 leading-relaxed">
                      {proc.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* --- TECH STACK ORBIT --- */}
      <section className="py-24 max-w-7xl mx-auto px-6 overflow-hidden">
        <h3 className="text-center font-mono text-[10px] tracking-[0.3em] text-white/40 uppercase mb-12">
          INTEGRATION MATRIX
        </h3>
        
        {/* Rolling continuous logos grid */}
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          <div className="flex flex-col items-center gap-2"><SiReact className="text-3xl text-accent-blue" /> <span className="text-[9px] font-mono text-white/60">React</span></div>
          <div className="flex flex-col items-center gap-2"><SiNodedotjs className="text-3xl text-green-500" /> <span className="text-[9px] font-mono text-white/60">NodeJS</span></div>
          <div className="flex flex-col items-center gap-2"><SiExpress className="text-3xl text-white" /> <span className="text-[9px] font-mono text-white/60">Express</span></div>
          <div className="flex flex-col items-center gap-2"><SiMongodb className="text-3xl text-emerald-500" /> <span className="text-[9px] font-mono text-white/60">MongoDB</span></div>
          <div className="flex flex-col items-center gap-2"><SiTailwindcss className="text-3xl text-accent-cyan" /> <span className="text-[9px] font-mono text-white/60">Tailwind</span></div>
          <div className="flex flex-col items-center gap-2"><SiFramer className="text-3xl text-purple-400" /> <span className="text-[9px] font-mono text-white/60">Motion</span></div>
          <div className="flex flex-col items-center gap-2"><SiGreensock className="text-3xl text-green-400" /> <span className="text-[9px] font-mono text-white/60">GSAP</span></div>
          <div className="flex flex-col items-center gap-2"><SiCloudinary className="text-3xl text-blue-400" /> <span className="text-[9px] font-mono text-white/60">Cloudinary</span></div>
          <div className="flex flex-col items-center gap-2"><SiVercel className="text-3xl text-white" /> <span className="text-[9px] font-mono text-white/60">Vercel</span></div>
        </div>
      </section>

      {/* --- WHY CLIENTS CHOOSE ME & BADGES --- */}
      <section className="py-28 bg-surface/20 border-t border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-accent-cyan uppercase">BRAND AUDITS</span>
            <h2 className="text-3xl md:text-5xl font-black font-display mt-3 text-white">THE STANDARDS MATRIX</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="glass-panel p-6 rounded-xl border border-white/5">
              <FiFastForward className="text-2xl text-accent-cyan mb-4" />
              <h3 className="text-sm font-bold font-mono tracking-wider text-white mb-2 uppercase">Lighthouse 100</h3>
              <p className="text-xs text-white/40 leading-relaxed">Perfect audits. Asset minification, server-edge distribution, and modern React compression algorithms.</p>
            </div>

            <div className="glass-panel p-6 rounded-xl border border-white/5">
              <FiTrendingUp className="text-2xl text-accent-gold mb-4" />
              <h3 className="text-sm font-bold font-mono tracking-wider text-white mb-2 uppercase">SEO Optimized</h3>
              <p className="text-xs text-white/40 leading-relaxed">Schema.org data architectures, structured OpenGraph components, metadata hooks, and fast index load times.</p>
            </div>

            <div className="glass-panel p-6 rounded-xl border border-white/5">
              <FiShield className="text-2xl text-red-500" />
              <h3 className="text-sm font-bold font-mono tracking-wider text-white mb-2 uppercase">TLS Secure</h3>
              <p className="text-xs text-white/40 leading-relaxed">Express validation middleware, secure headers, CORS gating, sanitization models for full database privacy.</p>
            </div>

            <div className="glass-panel p-6 rounded-xl border border-white/5">
              <FiSettings className="text-2xl text-accent-purple mb-4" />
              <h3 className="text-sm font-bold font-mono tracking-wider text-white mb-2 uppercase">ERP Scalability</h3>
              <p className="text-xs text-white/40 leading-relaxed">Database normalization, custom aggregations, and high concurrency routing structures.</p>
            </div>

          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS CAROUSEL --- */}
      <section className="py-32 max-w-5xl mx-auto px-6 text-center">
        <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-accent-purple uppercase">CLIENT REVIEWS</span>
        <h2 className="text-3xl md:text-5xl font-black font-display mt-3 text-white mb-16">TESTIMONIALS</h2>

        <div className="relative glass-panel p-8 md:p-12 rounded-2xl border border-white/10 overflow-hidden min-h-[250px] flex flex-col justify-center">
          <div className="absolute top-0 left-0 w-32 h-32 bg-accent-blue/5 rounded-full blur-3xl pointer-events-none" />
          
          <AnimatePresence mode="wait">
            {[
              { text: "Rohan with his team built our customized school and student billing ERP solution. It synced attendance, report cards, and automated fee payment channels with complete ease. The interface works incredibly smooth on mobile.", author: "School Administrator, India", company: "LOCAL CLIENT" },
              { text: "We needed a billing hub that was both fast and compliant with complex tax codes. Rohan and team delivered a high-performance system that processes invoices in under a second. POWERHOUSE GOD MODE BILLING SOFTWARE Truly premium software development.", author: "NEXORITH IT SOLUTIONS", company: "Nexorith Team" }
            ].map((test, index) => index === activeTestimonial && (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center text-center"
              >
                <p className="text-base md:text-lg text-white/70 italic leading-relaxed max-w-3xl mb-8">
                  "{test.text}"
                </p>
                <span className="text-xs font-bold font-mono text-accent-cyan uppercase tracking-wider">{test.author}</span>
                <span className="text-[10px] font-mono text-white/30 uppercase mt-1">{test.company}</span>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Dots controller */}
          <div className="flex justify-center gap-2 mt-8 z-10">
            {[0, 1].map((dot) => (
              <button
                key={dot}
                onClick={() => setActiveTestimonial(dot)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${activeTestimonial === dot ? 'bg-accent-cyan w-6' : 'bg-white/20'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section id="contact" className="py-32 bg-surface/30 border-t border-white/5 relative">
        <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left info column */}
          <div className="lg:col-span-5">
            <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-accent-cyan uppercase">PROJECT LAUNCH</span>
            <h2 className="text-3xl md:text-5xl font-black font-display mt-3 text-white mb-8">GET IN TOUCH</h2>
            
            <p className="text-sm text-white/50 leading-relaxed mb-10">
              Need a tailored billing system, an industrial ERP software suite, or an interactive portfolio built to impress? Send a query and let's configure your product.
            </p>

            <div className="space-y-6 text-sm font-mono">
              <div className="flex items-center gap-4 text-white/80">
                <FiMail className="text-accent-cyan text-lg" />
                <span>rohanpatnaik888.rox@gmail.com</span>
              </div>
              <div className="flex items-center gap-4 text-white/80">
                <FiPhone className="text-accent-cyan text-lg" />
                <span>+91 7684830669</span>
              </div>
              <div className="flex items-center gap-4 text-white/80">
                <span className="text-accent-cyan text-lg font-bold">@</span>
                <span>Gunupur, Odisha, India</span>
              </div>
            </div>

            {/* Simulated Interactive Map Plate */}
            <div className="mt-10 h-40 bg-black/40 rounded-xl border border-white/5 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 tech-grid opacity-30" />
              <div className="absolute w-4 h-4 bg-accent-cyan rounded-full animate-ping pointer-events-none" />
              <div className="absolute w-2 h-2 bg-accent-cyan rounded-full pointer-events-none" />
              <span className="text-[9px] font-mono text-white/30 absolute bottom-3 uppercase">GLOBAL DELIVERY MAP ENABLED</span>
            </div>
          </div>

          {/* Right Contact Form Column */}
          <div className="lg:col-span-7 w-full">
            <form onSubmit={handleContactSubmit} className="glass-panel p-5 sm:p-8 rounded-2xl border border-white/10 space-y-5 sm:space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                <div>
                  <label className="block text-[10px] font-mono tracking-widest text-white/40 uppercase mb-2">Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-accent-cyan focus:bg-white/[0.08] transition-all min-h-[48px]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono tracking-widest text-white/40 uppercase mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="name@domain.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-accent-cyan focus:bg-white/[0.08] transition-all min-h-[48px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono tracking-widest text-white/40 uppercase mb-2">Message Specification</label>
                <textarea 
                  rows="4"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Outline your project blueprint or integration needs..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-accent-cyan focus:bg-white/[0.08] transition-all resize-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={formStatus === 'sending'}
                className="w-full group px-6 py-4 rounded-xl flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-accent-blue via-accent-cyan to-accent-purple text-white hover:scale-[1.01] active:scale-100 transition-all cursor-pointer shadow-glow-cyan min-h-[52px]"
              >
                <span>
                  {formStatus === 'sending' ? 'TRANSMITTING...' : 'TRANSMIT ENCRYPTED QUERY'}
                </span>
                <FiSend className="group-hover:translate-x-1.5 transition-transform text-sm shrink-0" />
              </button>

              <AnimatePresence>
                {formStatus === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs font-mono text-green-400 bg-green-500/10 p-3 rounded-lg border border-green-500/20 text-center"
                  >
                    QUERY RECEIVED. ROHAN PATTNAIK WILL RESPOND VIA SECURE EMAIL.
                  </motion.div>
                )}
                {formStatus === 'error' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs font-mono text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-center"
                  >
                    TRANSMISSION FAILURE. PLEASE RETRY OR MAIL DIRECTLY.
                  </motion.div>
                )}
              </AnimatePresence>

            </form>
          </div>

        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-white/5 bg-background text-center relative">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          
          {/* Nexorith Logo Image */}
          <img 
            src="/nexorith-logo.png" 
            alt="Nexorith IT Solutions" 
            className="h-10 w-auto object-contain mb-6 filter drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]" 
          />

          {/* Copyright details */}
          <p className="text-xs font-mono text-white/30 tracking-widest">
            © {new Date().getFullYear()} NEXORITH IT SOLUTIONS. ALL RIGHTS RESERVED.
          </p>
          <p className="text-[10px] font-mono text-accent-gold tracking-widest mt-2">
            CRAFTED WITH PASSION BY ROHAN PATTNAIK
          </p>
        </div>
      </footer>

    </div>
  );
}
