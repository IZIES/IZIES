"use client";

import { useEffect, useLayoutEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Brain,
  Globe,
  Smartphone,
  Cloud,
  Workflow,
  Cpu,
  Server,
  Database,
  ShieldCheck,
  Code,
  Binary,
  Terminal,
  Layers,
  Zap,
  X,
  Tag,
  ChevronRight,
  Monitor,
  Gamepad,
  Coins,
  BarChart3,
  Shield,
  Cog,
  BookOpen,
  Microchip,
  Briefcase,
} from "lucide-react";

interface HeroSectionProps {
  onScrollTo?: (id: string) => void;
}

const ICON_MAP: Record<string, any> = {
  Brain,
  Globe,
  Smartphone,
  Cloud,
  Workflow,
  Cpu,
  Server,
  Database,
  ShieldCheck,
  Code,
  Sparkles,
  Terminal,
  Layers,
  Zap,
  Gamepad,
  Coins,
  BarChart3,
  Cog,
  Shield,
};

interface TechDomain {
  id: string;
  title: string;
  shortTitle: string;
  slug: string;
  icon: string;
  color: string;
  position: string;
  description?: string | null;
  technologies: string[];
  isActive: boolean;
}

const FALLBACK_DOMAINS: TechDomain[] = [
  {
    id: "ai-agents",
    title: "AI Agents & Intelligence",
    shortTitle: "AI Agents",
    slug: "ai-agents",
    icon: "Brain",
    color: "purple",
    position: "top",
    description:
      "Autonomous agent architectures, RAG pipelines, fine-tuned foundational models & real-time inference engines.",
    technologies: [
      "OpenAI & GPT-4o",
      "Anthropic Claude 3.5",
      "LangChain & LangGraph",
      "Llama 3 & DeepSeek",
      "CrewAI & AutoGen",
      "PyTorch & Transformers",
      "Pinecone & Qdrant",
      "vLLM & Ollama",
      "HuggingFace",
      "DSPy & Semantic Kernel",
      "Vector RAG Systems",
      "Whisper Audio AI",
    ],
    isActive: true,
  },
  {
    id: "web-saas",
    title: "Web & SaaS Platforms",
    shortTitle: "Web & SaaS",
    slug: "web-saas",
    icon: "Globe",
    color: "blue",
    position: "top-right",
    description:
      "High-throughput modern web applications, distributed APIs, micro-frontends, and real-time collaborative state.",
    technologies: [
      "Next.js 15 (App Router)",
      "React 19 & TypeScript",
      "Node.js & NestJS",
      "Tailwind CSS & Shadcn UI",
      "PostgreSQL & Prisma ORM",
      "Redis & Upstash Cache",
      "GraphQL & RESTful APIs",
      "Turbopack & Vite",
      "WebSockets & SSE",
      "TanStack Query",
      "Docker & Microservices",
      "Zustand & Redux Toolkit",
      "PHP & Laravel Framework",
      "Symfony & CodeIgniter",
      "WordPress & WooCommerce",
      "CakePHP & Yii2",
      "Zend Framework & Laminas",
      ".NET 8 & ASP.NET Core",
      "C# & Blazor WebAssembly",
      "Entity Framework Core & Dapper",
      "Java & Spring Boot",
      "Spring MVC & Spring Data",
      "Hibernate & JPA",
      "Jakarta EE & MicroProfile",
      "Python & Django Framework",
      "Django REST Framework & FastAPI",
      "Flask & Pyramid",
      "Go & Gin Framework",
      "Go & Echo & Fiber",
      "Rust & Actix Web & Axum",
      "Ruby & Ruby on Rails",
      "Sinatra & Hanami",
      "Lua & OpenResty",
      "Perl & Dancer & Mojolicious",
      "SvelteKit & SolidJS",
      "Vue.js 3 & Nuxt",
      "Angular & Ionic",
      "Lit & Stencil Web Components",
      "Astro & Qwik",
      "Meteor & RedwoodJS",
      "AdonisJS & FeathersJS",
      "Strapi & Directus CMS",
      "Contentful & Sanity.io",
      "Markdown & MDX & Gatsby",
      "JAMstack & Static Generation",
      "Cloudflare Workers & Deno",
      "Bun & ESM Runtime",
    ],
    isActive: true,
  },
  {
    id: "mobile",
    title: "Mobile Engineering",
    shortTitle: "Mobile",
    slug: "mobile",
    icon: "Smartphone",
    color: "cyan",
    position: "bottom-right",
    description:
      "Native performance cross-platform mobile apps with fluid animations, offline-first sync, and biometric security.",
    technologies: [
      "React Native & Expo",
      "Flutter & Dart",
      "Swift & SwiftUI (iOS)",
      "Kotlin & Jetpack Compose (Android)",
      "SwiftUI & UIKit (Legacy iOS)",
      "Xamarin & .NET MAUI",
      "Ionic & Capacitor",
      "NativeScript & Vue Native",
      "Qt & QML (C++)",
      "C++ & SDL Mobile",
      "Java & Android SDK (Legacy)",
      "Objective-C & Cocoa Touch",
      "SQLite & WatermelonDB",
      "Realm & Core Data",
      "Firebase & AWS Amplify",
      "Push Notifications (FCM / APNs)",
      "WebRTC Live Video/Audio",
      "Biometric Auth (FaceID / Fingerprint)",
      "In-App Purchases (RevenueCat)",
      "Fastlane CI/CD",
      "Native Modules & JSI",
      "React Native Paper & NativeBase",
      "RN Navigation & React Navigation",
      "Redux Toolkit & MobX-State-Tree",
      "Apollo Client & GraphQL Mobile",
      "Socket.io & MQTT Realtime",
      "Background Fetch & Geofencing",
      "Camera & Image Picker",
      "Maps & Location Services",
      "Offline First & Drizzle ORM",
      "App Distribution & TestFlight",
      "App Store & Google Play Deployment",
      "Dynamic Links & Deep Linking",
      "Crashlytics & Sentry Mobile",
      "Performance Monitoring & App Metrics",
      "Onboarding & Tutorial SDKs",
      "In-App Messaging & Braze",
      "Payments & Adyen SDK",
    ],
    isActive: true,
  },
  {
    id: "cloud",
    title: "Cloud & Distributed Systems",
    shortTitle: "Cloud",
    slug: "cloud",
    icon: "Cloud",
    color: "amber",
    position: "bottom-left",
    description:
      "Zero-downtime serverless & containerized infrastructure, multi-region edge networks, and resilient orchestration.",
    technologies: [
      "Amazon Web Services (AWS)",
      "Google Cloud Platform (GCP)",
      "Microsoft Azure",
      "Oracle Cloud Infrastructure (OCI)",
      "Docker & Kubernetes (K8s)",
      "Terraform & IaC",
      "Pulumi & Crossplane",
      "Ansible & Chef & Puppet",
      "Cloudflare Workers & CDN",
      "Fastly & Akamai CDN",
      "CI/CD & GitHub Actions",
      "GitLab CI & Jenkins",
      "CircleCI & Travis CI",
      "Apache Kafka & RabbitMQ",
      "Redis & Memcached",
      "Prometheus & Grafana",
      "ELK Stack & Splunk",
      "Datadog & New Relic",
      "Sentry & Rollbar",
      "Nginx & HAProxy",
      "Apache & IIS Web Servers",
      "Caddy & Envoy Proxy",
      "Neon Serverless Postgres",
      "Supabase & Firebase",
      "PlanetScale & CockroachDB",
      "MongoDB Atlas & DynamoDB",
      "Cassandra & ScyllaDB",
      "Elasticsearch & OpenSearch",
      "Vault & Secrets Management",
      "AWS Lambda & Google Cloud Functions",
      "Azure Functions & Cloudflare Workers",
      "Knative & OpenFaaS",
      "Serverless Framework & SAM",
      "Istio & Linkerd Service Mesh",
      "Helm & Kustomize",
      "ArgoCD & Flux CD",
      "Flux & Spinnaker",
      "AWS EKS & GKE & AKS",
      "DigitalOcean Kubernetes",
      "Linode & Vultr Cloud",
      "OVHcloud & Scaleway",
      "Alibaba Cloud & Tencent Cloud",
      "IBM Cloud & Cloudflare",
      "Vercel & Render Edge",
      "Netlify & Cloudflare Pages",
      "Fly.io & Railway & Supabase",
      "Heroku & Platform.sh",
      "AWS Route53 & Cloud DNS",
      "SSL/TLS & ACM Certificates",
      "Backup & DR & Snapshots",
      "Observability & SRE Playbooks",
    ],
    isActive: true,
  },
  {
    id: "automation",
    title: "Automation & Workflows",
    shortTitle: "Automation",
    slug: "automation",
    icon: "Workflow",
    color: "emerald",
    position: "mid-top-right",
    description:
      "Event-driven process orchestration, continuous data pipelines, API integrations, and autonomous background jobs.",
    technologies: [
      "n8n & Zapier Automations",
      "Temporal.io & Inngest",
      "BullMQ & Redis Queues",
      "Apache Kafka & RabbitMQ",
      "Celery & RQ (Python)",
      "Sidekiq & GoodJob (Ruby)",
      "Go-Job & Asynq (Go)",
      "Bull & Bee-Queue (Node.js)",
      "Puppeteer & Playwright",
      "Selenium & WebdriverIO",
      "Cron & Distributed Schedulers",
      "Airflow & Dagster & Prefect",
      "Prefect & Dagster Workflows",
      "Apache NiFi & StreamSets",
      "AWS Step Functions & Google Workflows",
      "Azure Logic Apps & Power Automate",
      "Webhook Event Relays",
      "ETL Data Pipelines",
      "Stripe & Razorpay Billing",
      "PayPal & Square & Adyen",
      "Python & Bash Scripting",
      "Go & Rust Scripting",
      "Segment & PostHog Analytics",
      "Amplitude & Mixpanel & Heap",
      "Segment CDP & Rudderstack",
      "Zapier & Make (Integromat)",
      "Workato & Tray.io",
      "MuleSoft & Boomi & Talend",
      "Informatica & SSIS",
      "Dialer & Twilio & MessageBird",
      "Email & SendGrid & Mailgun",
      "SMS & Vonage & Plivo",
      "Chat & Slack & Discord Bots",
      "CRM & HubSpot & Salesforce",
      "ERP & Odoo & SAP Integration",
      "HRIS & BambooHR & Greenhouse",
      "ITSM & Jira Service Management",
      "Backup & DR Automation",
      "Recovery & Ransomware Mitigation",
    ],
    isActive: true,
  },
  {
    id: "gaming",
    title: "Gaming & Interactive Experiences",
    shortTitle: "Gaming",
    slug: "gaming",
    icon: "Gamepad",
    color: "rose",
    position: "top-left",
    description:
      "Real-time multiplayer engines, WebGL/OpenGL rendering, game server hosting, and interactive 3D web experiences.",
    technologies: [
      "Unity & C#",
      "Unreal Engine & C++",
      "Godot & GDScript",
      "Three.js & WebGL",
      "Babylon.js & PlayCanvas",
      "Node.js & Socket.io Multiplayer",
      "Redis & Pub/Sub Game State",
      "Firebase & PlayFab Backend",
      "SpatialOS & Nakama",
      "Steam & Epic Store SDK",
      "Procedural Generation & Blender",
      "Game Analytics & Mixpanel",
    ],
    isActive: true,
  },
  {
    id: "web3",
    title: "Blockchain, Web3 & DeFi",
    shortTitle: "Web3",
    slug: "web3",
    icon: "Coins",
    color: "amber",
    position: "left",
    description:
      "Smart contract development, decentralized finance protocols, NFT infrastructure, wallet integrations, and layer-2 scaling solutions.",
    technologies: [
      "Solidity & EVM",
      "Rust & Anchor (Solana)",
      "Cairo & Starknet",
      "Hardhat & Foundry",
      "Ethers.js & Viem",
      "Web3.js & Wagmi",
      "IPFS & Arweave Storage",
      "The Graph & Subgraph Indexing",
      "Uniswap & Aave Protocols",
      "Chainlink Oracles",
      "MetaMask & WalletConnect",
      "Ethereum & Polygon L2",
    ],
    isActive: true,
  },
  {
    id: "data-analytics",
    title: "Data, Analytics & BI",
    shortTitle: "Data & Analytics",
    slug: "data-analytics",
    icon: "BarChart3",
    color: "indigo",
    position: "bottom",
    description:
      "Real-time analytics pipelines, data warehousing, ETL orchestration, business intelligence dashboards, and ML feature engineering.",
    technologies: [
      "Python & Pandas",
      "SQL & dbt Transformations",
      "Apache Spark & Databricks",
      "Snowflake & BigQuery",
      "Apache Airflow & Dagster",
      "Fivetran & Stitch ETL",
      "Looker & Power BI",
      "Tableau & Metabase",
      "Segment & Rudderstack",
      "Kafka & Redpanda Streams",
      "MLflow & Feast Features",
      "Grafana & Supabase Studio",
    ],
    isActive: true,
  },
  {
    id: "devops",
    title: "DevOps, SRE & Infrastructure",
    shortTitle: "DevOps / SRE",
    slug: "devops",
    icon: "Cog",
    color: "cyan",
    position: "right",
    description:
      "Site reliability engineering, infrastructure-as-code, observability, container orchestration, and zero-downtime deployment pipelines.",
    technologies: [
      "Docker & Kubernetes",
      "Terraform & Pulumi IaC",
      "Ansible & Chef Configuration",
      "GitHub Actions & GitLab CI",
      "Jenkins & CircleCI",
      "Prometheus & Grafana",
      "ELK Stack & Splunk",
      "Datadog & New Relic",
      "Sentry & Rollbar Error Tracking",
      "PagerDuty & Opsgenie On-Call",
      "Helm & Kustomize",
      "Cloudflare & Fastly CDN",
    ],
    isActive: true,
  },
  {
    id: "qa-testing",
    title: "Quality Assurance & Testing",
    shortTitle: "QA & Testing",
    slug: "qa-testing",
    icon: "Shield",
    color: "emerald",
    position: "mid-bottom-left",
    description:
      "Automated end-to-end testing, performance/load testing, manual QA workflows, cross-browser validation, and CI quality gates.",
    technologies: [
      "Jest & Vitest Unit Testing",
      "Cypress & Playwright E2E",
      "Selenium & WebdriverIO",
      "Pytest & unittest (Python)",
      "JUnit & TestNG (Java)",
      "K6 & Artillery Load Testing",
      "Lighthouse & WebPageTest",
      "BrowserStack & Sauce Labs",
      "Appium & Detox Mobile",
      "SonarQube & Codecov",
      "Cucumber & BDD Frameworks",
      "Mabl & Testim AI Testing",
    ],
    isActive: true,
  },
];

const RING_RADIUS = "38%";
const RING_RADIUS_SM = "42%";

const POSITION_STYLES: Record<
  string,
  { wrapper: string; hoverOffset: string; popoverAlign: string }
> = {
  top: {
    wrapper: "top-2 sm:top-6 left-1/2 -translate-x-1/2",
    hoverOffset: "hover:-translate-y-1",
    popoverAlign: "top-12 sm:top-14 left-1/2 -translate-x-1/2",
  },
  "top-right": {
    wrapper: "top-24 sm:top-24 right-0 sm:right-4",
    hoverOffset: "hover:translate-x-1 hover:-translate-y-1",
    popoverAlign: "top-28 right-0 sm:right-2 sm:-translate-x-0",
  },
  right: {
    wrapper: "top-1/2 right-2 sm:right-8 -translate-y-1/2",
    hoverOffset: "hover:translate-x-1",
    popoverAlign: "top-1/2 right-24 sm:right-28 -translate-y-1/2",
  },
  "bottom-right": {
    wrapper: "bottom-16 sm:bottom-20 right-2 sm:right-8",
    hoverOffset: "hover:translate-x-1 hover:translate-y-1",
    popoverAlign: "bottom-24 right-0 sm:right-2",
  },
  bottom: {
    wrapper: "bottom-2 sm:bottom-6 left-1/2 -translate-x-1/2",
    hoverOffset: "hover:translate-y-1",
    popoverAlign: "bottom-12 sm:bottom-14 left-1/2 -translate-x-1/2",
  },
  "bottom-left": {
    wrapper: "bottom-16 sm:bottom-20 left-2 sm:left-8",
    hoverOffset: "hover:-translate-x-1 hover:translate-y-1",
    popoverAlign: "bottom-24 left-0 sm:left-2",
  },
  left: {
    wrapper: "top-1/2 left-2 sm:left-8 -translate-y-1/2",
    hoverOffset: "hover:-translate-x-1",
    popoverAlign: "top-1/2 left-24 sm:left-28 -translate-y-1/2",
  },
  "top-left": {
    wrapper: "top-24 sm:top-24 left-0 sm:left-4",
    hoverOffset: "hover:-translate-x-1 hover:-translate-y-1",
    popoverAlign: "top-28 left-0 sm:left-2",
  },
  "mid-top-right": {
    wrapper: "top-12 sm:top-16 right-0 sm:right-2",
    hoverOffset: "hover:translate-x-1 hover:-translate-y-1",
    popoverAlign: "top-20 right-0 sm:right-2",
  },
  "mid-bottom-left": {
    wrapper: "bottom-12 sm:bottom-16 left-0 sm:left-2",
    hoverOffset: "hover:-translate-x-1 hover:translate-y-1",
    popoverAlign: "bottom-20 left-0 sm:left-2",
  },
};

function getRingStyle(ring: number, total: number, offset: number = 0) {
    const w = typeof window !== "undefined" ? window.innerWidth : 1024;
    let radius = 0.38;
    if (w < 480) radius = 0.32;
    else if (w < 640) radius = 0.34;
    else if (w < 768) radius = 0.36;
    else if (w < 1024) radius = 0.38;
    else if (w < 1280) radius = 0.4;
    else radius = 0.42;
    const angle = (ring / total) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(angle) * (radius + offset);
    const y = Math.sin(angle) * (radius + offset);
    return {
      position: "absolute" as const,
      top: `calc(50% + ${y * 100}%)`,
      left: `calc(50% + ${x * 100}%)`,
      transform: "translate(-50%, -50%)",
      transformOrigin: "center",
    };
  }

const COLOR_STYLES: Record<
  string,
  {
    border: string;
    glow: string;
    text: string;
    bg: string;
    badge: string;
    accent: string;
  }
> = {
  purple: {
    border: "border-purple-500/30 hover:border-purple-400",
    glow: "shadow-[0_4px_25px_rgba(168,85,247,0.25)]",
    text: "text-purple-400",
    bg: "bg-purple-500/10",
    badge: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    accent: "from-purple-500/20 to-indigo-500/10",
  },
  blue: {
    border: "border-blue-500/30 hover:border-blue-400",
    glow: "shadow-[0_4px_25px_rgba(59,130,246,0.25)]",
    text: "text-blue-400",
    bg: "bg-blue-500/10",
    badge: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    accent: "from-blue-500/20 to-cyan-500/10",
  },
  cyan: {
    border: "border-cyan-500/30 hover:border-cyan-400",
    glow: "shadow-[0_4px_25px_rgba(6,182,212,0.25)]",
    text: "text-cyan-400",
    bg: "bg-cyan-500/10",
    badge: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    accent: "from-cyan-500/20 to-blue-500/10",
  },
  amber: {
    border: "border-amber-500/30 hover:border-amber-400",
    glow: "shadow-[0_4px_25px_rgba(245,158,11,0.25)]",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    accent: "from-amber-500/20 to-orange-500/10",
  },
  emerald: {
    border: "border-emerald-500/30 hover:border-emerald-400",
    glow: "shadow-[0_4px_25px_rgba(16,185,129,0.25)]",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    accent: "from-emerald-500/20 to-teal-500/10",
  },
  rose: {
    border: "border-rose-500/30 hover:border-rose-400",
    glow: "shadow-[0_4px_25px_rgba(244,63,94,0.25)]",
    text: "text-rose-400",
    bg: "bg-rose-500/10",
    badge: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    accent: "from-rose-500/20 to-pink-500/10",
  },
  indigo: {
    border: "border-indigo-500/30 hover:border-indigo-400",
    glow: "shadow-[0_4px_25px_rgba(99,102,241,0.25)]",
    text: "text-indigo-400",
    bg: "bg-indigo-500/10",
    badge: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    accent: "from-indigo-500/20 to-purple-500/10",
  },
};

export function HeroSection({ onScrollTo }: HeroSectionProps = {}) {
  const [domains, setDomains] = useState<TechDomain[]>(FALLBACK_DOMAINS);
  const [activeDomainId, setActiveDomainId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    fetch("/api/hero-tech")
      .then((res) => res.json())
      .then((data) => {
        if (
          data.success &&
          Array.isArray(data.domains) &&
          data.domains.length > 0
        ) {
          const activeOnes = data.domains.filter(
            (d: TechDomain) => d.isActive !== false,
          );
          if (activeOnes.length > 0) {
            const dbSlugs = new Set(activeOnes.map((d: TechDomain) => d.slug));
            const merged = [
              ...activeOnes,
              ...FALLBACK_DOMAINS.filter((d) => !dbSlugs.has(d.slug)),
            ];
            setDomains(merged);
          }
        }
      })
      .catch(() => {
        // use fallback gracefully
      });
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setActiveDomainId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleScroll = (id: string) => {
    if (onScrollTo) {
      onScrollTo(id);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const activeDomain = domains.find((d) => d.id === activeDomainId);
  const activeColorTheme = activeDomain
    ? COLOR_STYLES[activeDomain.color] || COLOR_STYLES.purple
    : COLOR_STYLES.purple;
  const ActiveIcon = activeDomain
    ? ICON_MAP[activeDomain.icon] || Brain
    : Brain;
  useLayoutEffect(() => {
    if (!activeDomainId) return;

    const updatePosition = () => {
      const trigger = activeTriggerRef.current;
      if (!trigger) return;

      const margin = 16;
      const gap = 12;
      const viewport = window.visualViewport;
      const viewportLeft = viewport?.offsetLeft ?? 0;
      const viewportTop = viewport?.offsetTop ?? 0;
      const viewportWidth = viewport?.width ?? window.innerWidth;
      const viewportHeight = viewport?.height ?? window.innerHeight;
      const headerBottom = document.querySelector("header")?.getBoundingClientRect().bottom ?? 80;
      const minTop = Math.max(viewportTop + margin, headerBottom + gap);
      const availableHeight = Math.max(0, viewportTop + viewportHeight - margin - minTop);
      const width = Math.min(420, Math.max(0, viewportWidth - margin * 2));
      const height = Math.min(560, availableHeight);
      const rect = trigger.getBoundingClientRect();
      const maxTop = minTop + availableHeight - height;
      const preferredTop = rect.bottom + gap + height <= viewportTop + viewportHeight - margin
        ? rect.bottom + gap
        : rect.top - gap - height;
      const left = Math.max(viewportLeft + margin, Math.min(
        rect.left + rect.width / 2 - width / 2,
        viewportLeft + viewportWidth - margin - width,
      ));

      setPopoverStyle({
        position: "fixed",
        width,
        height,
        left,
        top: Math.max(minTop, Math.min(preferredTop, maxTop)),
        zIndex: 100,
      });
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveDomainId(null);
        activeTriggerRef.current?.focus();
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    window.visualViewport?.addEventListener("resize", updatePosition);
    window.visualViewport?.addEventListener("scroll", updatePosition);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      window.visualViewport?.removeEventListener("resize", updatePosition);
      window.visualViewport?.removeEventListener("scroll", updatePosition);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activeDomainId]);

  return (
    <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 px-6 max-w-7xl mx-auto z-10">
      {/* Background Grid & Gradient */}
      <div className="absolute inset-0 -z-20 bg-grid-pattern opacity-[0.03] [mask-image:linear-gradient(to_bottom,white,transparent)]" />

      {/* Floating Ambient Background Micro-Glyphs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10 select-none">
        <div className="absolute top-36 left-12 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-slate-500/40 font-mono text-xs hidden lg:flex items-center gap-2 backdrop-blur-xs">
          <Code className="w-3.5 h-3.5 text-indigo-400/40" />
          <span>const izies = new DigitalOS();</span>
        </div>

        <div className="absolute top-28 right-20 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-slate-500/30 font-mono text-[10px] hidden xl:flex items-center gap-1.5">
          <Binary className="w-3.5 h-3.5 text-purple-400/40" />
          <span>01101001 01011010</span>
        </div>

        <div className="absolute top-[500px] left-8 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-slate-500/40 font-mono text-xs hidden md:flex items-center gap-2">
          <Brain className="w-3.5 h-3.5 text-purple-400/40" />
          <span>embeddings: 1536-dim vector</span>
        </div>

        <div className="absolute top-[600px] right-12 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-slate-500/40 font-mono text-xs hidden md:flex items-center gap-2">
          <Server className="w-3.5 h-3.5 text-cyan-400/40" />
          <span>edge-mesh: tokyo-sfo-fra</span>
        </div>

        <span className="absolute top-48 left-1/4 text-white/15 font-mono text-xs">
          +
        </span>
        <span className="absolute top-96 right-1/3 text-white/15 font-mono text-xs">
          +
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
        {/* Left Hero Content */}
        <div className="lg:col-span-6 space-y-7 text-center lg:text-left">
          {/* Small Kicker Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold shadow-inner shadow-indigo-500/10 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Websites • Apps • AI • Automation</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.06]">
            Digital Engineering for Your{" "}
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(129,140,248,0.3)]">
              Business
            </span>
            .
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed font-normal">
            IZIES provides digital engineering and software development for businesses
            in India and international teams. From SaaS products and AI integrations
            to workflow automation, we help you plan, build and improve the tools
            your business needs.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
            <button
              onClick={() => handleScroll("contact")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold shadow-xl shadow-indigo-600/30 text-sm transition-all active:scale-[0.98] cursor-pointer"
            >
              <span className="hidden sm:inline">Start a Project</span>
              <span className="sm:hidden">Start Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleScroll("capabilities")}
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3.5 rounded-2xl text-sm text-slate-300 border border-white/10 hover:bg-white/[0.05] hover:text-white transition-all cursor-pointer backdrop-blur-xl"
            >
              <span className="hidden sm:inline">Explore Capabilities</span>
              <span className="sm:hidden">Capabilities</span>
            </button>

            <button
              onClick={() => handleScroll("models")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-bold text-indigo-300 border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 transition-all cursor-pointer"
            >
              <span className="hidden sm:inline">How We Partner</span>
              <span className="sm:hidden">Partner Models</span>
            </button>
          </div>

          {/* Supporting Micro-Proof */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>From the first idea to a production-ready solution.</span>
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Clear Scope & Direct Team Communication</span>
            </span>
          </div>
        </div>

        {/* Right Hero Visual: Large Cinematic Abstract Animated Ecosystem Centered on IZIES Logo */}
        <div className="lg:col-span-6 flex justify-center" ref={containerRef}>
          <div className="relative w-full max-w-[540px] sm:max-w-[600px] aspect-square flex items-center justify-center p-2 sm:p-8">
            {/* Dynamic Ambient Background Glows */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-blue-500/5 to-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />

            {/* Concentric Orbital Rings (SVG with glowing gradients) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 500 500"
              fill="none"
            >
              <circle
                cx="250"
                cy="250"
                r="220"
                stroke="rgba(255, 255, 255, 0.04)"
                strokeWidth="1"
                strokeDasharray="4 6"
              />
              <circle
                cx="250"
                cy="250"
                r="160"
                stroke="url(#heroOrbitGradLg)"
                strokeWidth="1.5"
                strokeDasharray="6 8"
                className="animate-[spin_40s_linear_infinite] opacity-40"
              />
              <circle
                cx="250"
                cy="250"
                r="110"
                stroke="rgba(168, 85, 247, 0.2)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />

              <defs>
                <linearGradient
                  id="heroOrbitGradLg"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.7" />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.7" />
                </linearGradient>
              </defs>
            </svg>

            {/* Central Prominent IZIES Logo (Premium Circular Orb) */}
            <div className="relative z-20 flex flex-col items-center justify-center">
              <div className="relative group flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-[30px] group-hover:bg-cyan-400/30 transition-all duration-1000 animate-pulse" />
                <div className="relative z-10 transition-transform duration-700 group-hover:scale-105 flex items-center justify-center">
                  <Image
                    src="/brand/izies-logo-transparent.png"
                    alt="IZIES Core Logo"
                    width={120}
                    height={120}
                    priority
                    className="object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.15)]"
                  />
                </div>
              </div>
            </div>

            {/* Orbiting Satellite Pills with Click Popover */}
            {domains.map((domain, index) => {
              const IconComponent = ICON_MAP[domain.icon] || Brain;
              const colorConfig =
                COLOR_STYLES[domain.color] || COLOR_STYLES.purple;
              const isCurrentActive = activeDomainId === domain.id;
              const ringStyle = getRingStyle(index, domains.length);

              return (
                <div
                  key={domain.id}
                  className="absolute z-20"
                  style={ringStyle}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      activeTriggerRef.current = e.currentTarget;
                      setActiveDomainId(isCurrentActive ? null : domain.id);
                    }}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#070A14]/90 border backdrop-blur-md transition-all duration-300 cursor-pointer select-none group ${
                      isCurrentActive
                        ? `${colorConfig.border} ${colorConfig.glow} scale-105 ring-2 ring-white/10`
                        : `${colorConfig.border} ${colorConfig.glow}`
                    }`}
                  >
                    <IconComponent
                      className={`w-4 h-4 ${colorConfig.text} transition-transform group-hover:scale-110`}
                    />
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                      {domain.shortTitle}
                    </span>
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${colorConfig.bg} border ${colorConfig.border} animate-pulse`}
                    />
                  </button>
                </div>
              );
            })}

            {/* Backdrop Overlay - closes on outside click */}
            {activeDomain && (
              <div
                className="fixed inset-0 z-30 animate-in fade-in duration-200"
                onClick={() => setActiveDomainId(null)}
              />
            )}

            {/* INTERACTIVE TECH STACK POPOVER CARD */}
            {activeDomain && (
              <div
                className="animate-in fade-in zoom-in-95 duration-200"
                style={popoverStyle}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className={`h-full min-h-0 overflow-hidden flex flex-col p-5 sm:p-6 rounded-3xl bg-[#090D1C]/95 backdrop-blur-2xl border ${activeColorTheme.border} ${activeColorTheme.glow} shadow-2xl text-left relative`}
                >
                  {/* Subtle Top Ambient Gradient */}
                  <div
                    className={`absolute top-0 inset-x-0 h-24 bg-gradient-to-b ${activeColorTheme.accent} pointer-events-none rounded-3xl`}
                  />

                  {/* Header - pinned top */}
                  <div className="relative z-10 flex items-start justify-between gap-3 border-b border-white/[0.08] pb-3 shrink-0">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2.5 rounded-2xl ${activeColorTheme.bg} border ${activeColorTheme.border} ${activeColorTheme.text} shadow-inner`}
                      >
                        <ActiveIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-white text-base leading-tight">
                          {activeDomain.title}
                        </h4>
                        <span className="text-[11px] font-mono text-slate-400">
                          {activeDomain.technologies.length} Technologies
                          Included
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveDomainId(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                      aria-label="Close tech stack popup"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Scrollable Middle Content */}
                  <div className="relative z-10 flex-1 min-h-0 overflow-y-auto pr-1 space-y-3">
                    {/* Description */}
                    {activeDomain.description && (
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {activeDomain.description}
                      </p>
                    )}

                    {/* Tech Tags Pool */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Core Stack & Frameworks
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeDomain.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border ${activeColorTheme.badge} transition-all duration-200 hover:scale-105 select-none`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer - pinned bottom */}
                  <div className="relative z-10 pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveDomainId(null);
                        handleScroll("capabilities");
                      }}
                      className={`font-semibold ${activeColorTheme.text} hover:underline inline-flex items-center gap-1 cursor-pointer`}
                    >
                      <span>
                        Explore {activeDomain.shortTitle} Capabilities
                      </span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Live Stack
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Floating Telemetry Strip */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-20 w-max pointer-events-none">
              <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-indigo-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  <span>Systems Online</span>
                </span>
                <span className="text-white/20">|</span>
                <span>Hover / Tap to inspect tech stacks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
