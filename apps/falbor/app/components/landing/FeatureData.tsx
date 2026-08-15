import React from 'react';
import type { FeatureData } from './FeatureCard';

export const featuresData: FeatureData[] = [
    {
        id: "website-builder",
        number: "01",
        backgroundColor: "bg-[#0a0a0a]",
        glowColor: "#FF5800",
        title: "Build stunning websites with AI.",
        description: "Transform your ideas into fully functional, responsive websites instantly. Our agentic AI writes production-ready code so you can focus on growing your business.",
        imageSrc: "/landing/FeatureWebsiteBuilder.png",
        imageAlt: "Website Builder",
        primaryCta: { text: "Start Building", href: "/docs/builder" },
    },
    {
        id: "database",
        number: "02",
        backgroundColor: "bg-black",
        glowColor: "#0A35F1",
        badgeText: "Built-in Database",
        badgeContainerClass: "border-[#0A35F1]/40 text-[#6d8ef7] bg-[#0A35F1]/10",
        badgeDotClass: "bg-[#6d8ef7]",
        title: <React.Fragment>Every site gets a<br />powerful database.</React.Fragment>,
        description: "No external services to wire up. The moment you create a chat or deploy a site, Falbor automatically provisions a private, scalable Postgres-compatible database. Store user data, content, transactions anything your app needs. Backups happen automatically every 24 hours.",
        imageSrc: "/landing/FeatureDatabase.png",
        imageAlt: "Integrated Database",
        statPills: [
            { text: "Auto-backups every 24h" },
            { text: "Scales to 100GB+" },
        ],
        subFeatures: [
            {
                icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C6.48 2 2 4.02 2 6.5v11C2 19.98 6.48 22 12 22s10-2.02 10-4.5v-11C22 4.02 17.52 2 12 2z" /><path d="M2 6.5C2 8.98 6.48 11 12 11s10-2.02 10-4.5" /><path d="M2 12c0 2.48 4.48 4.5 10 4.5S22 14.48 22 12" /></svg>,
                label: "Auto-Provisioned",
                desc: "A database spins up automatically for every new project. Zero configuration.",
            },
            {
                icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18M3 9h6M3 15h6" /></svg>,
                label: "Postgres-Compatible",
                desc: "Standard SQL you already know. Migrate your existing data with no friction.",
            },
            {
                icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
                label: "Encrypted at Rest",
                desc: "AES-256 encryption protects your data. SOC 2 compliant infrastructure.",
            },
        ],
        subFeatureIconClass: "text-[#6d8ef7]",
        primaryCta: { text: "Explore Database", href: "/signup" },
        secondaryCta: { text: "View Docs", href: "/docs/database" },
    },
    {
        id: "organizations",
        number: "03",
        backgroundColor: "bg-black",
        glowColor: "#8B5CF6",
        badgeText: "Organizations",
        badgeContainerClass: "border-[#8B5CF6]/40 text-[#a78bfa] bg-[#8B5CF6]/10",
        badgeDotClass: "bg-[#a78bfa]",
        title: <React.Fragment>Manage projects and<br />issues in one place.</React.Fragment>,
        description: "Scale your workflow with built-in organization tools. Create multiple workspaces, invite your team with the right permissions, track issues across every deployed project, and get real-time notifications when something needs your attention all from a single unified dashboard.",
        imageSrc: "/landing/FeatureOrganizations.png",
        imageAlt: "Organizations Dashboard",
        statPills: [
            { text: "Unlimited projects" },
            { text: "Up to 50 members" },
        ],
        subFeatures: [
            {
                icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>,
                label: "Multi-Project Workspace",
                desc: "Manage unlimited projects under one org. Switch context instantly.",
            },
            {
                icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
                label: "Role-Based Access",
                desc: "Owners, admins, editors — granular permissions so the right people access the right things.",
            },
            {
                icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>,
                label: "Issue Tracking",
                desc: "Catch, log, and resolve runtime errors directly from your dashboard. No Jira needed.",
            },
        ],
        subFeatureIconClass: "text-[#a78bfa]",
        primaryCta: { text: "Explore Organizations", href: "/signup" },
        secondaryCta: { text: "View Docs", href: "/docs/organizations" },
    },
    {
        id: "workflow",
        number: "04",
        backgroundColor: "bg-[#050505]",
        glowColor: "#10B981",
        badgeText: "Workflows",
        badgeContainerClass: "border-[#10B981]/40 text-[#34d399] bg-[#10B981]/10",
        badgeDotClass: "bg-[#34d399]",
        title: <React.Fragment>Automate every task<br />with smart workflows.</React.Fragment>,
        description: "Every Falbor chat ships with a powerful workflow engine. Build visual automation pipelines, chain AI agents together to tackle complex tasks, and schedule recurring runs all without writing a single line of infrastructure code. Think Zapier, but for AI agents.",
        imageSrc: "/landing/FeatureWorkflow.png",
        imageAlt: "Custom Workflows",
        statPills: [
            { text: "50+ trigger types" },
            { text: "Webhook & cron support" },
        ],
        subFeatures: [
            {
                icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>,
                label: "Visual Pipeline Builder",
                desc: "Drag-and-drop interface to design multi-step agent workflows without code.",
            },
            {
                icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>,
                label: "Agent Chaining",
                desc: "Connect multiple specialized AI agents — each output feeds into the next step.",
            },
            {
                icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
                label: "Scheduled Runs",
                desc: "Trigger workflows on a cron schedule or from external webhooks. Fully automated.",
            },
        ],
        subFeatureIconClass: "text-[#34d399]",
        primaryCta: { text: "View Workflow", href: "/signup" },
        secondaryCta: { text: "View Docs", href: "/docs/workflow" },
    },
    // {
    //     id: "darknet",
    //     number: "05",
    //     backgroundColor: "bg-[#050505]",
    //     glowColor: "#EF4444",
    //     badgeText: "Darknet Intel",
    //     badgePulse: true,
    //     badgeContainerClass: "border-[#EF4444]/40 text-[#f87171] bg-[#EF4444]/10",
    //     badgeDotClass: "bg-[#f87171]",
    //     title: <React.Fragment>Darknet data checking<br />&amp; security insights.</React.Fragment>,
    //     description: "Go beyond the surface web. Falbor's advanced agents continuously scan darknet sources — forums, paste sites, and underground markets — to verify whether your organization's data, credentials, or IP has been compromised. Get actionable security intelligence, not raw noise.",
    //     imageSrc: "/landing/FeatureDarknet.png",
    //     imageAlt: "Darknet Security Interface",
    //     statPills: [
    //         { text: "500k+ sources indexed", className: "bg-red-950/60 border-red-900/60 text-red-300" },
    //         { text: "< 15 min detection" },
    //     ],
    //     subFeatures: [
    //         {
    //             icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    //             label: "Breach Monitoring",
    //             desc: "Continuously scan darknet marketplaces and paste sites for your organization's exposed credentials.",
    //         },
    //         {
    //             icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
    //             label: "Real-Time Alerts",
    //             desc: "Instant notifications the moment your data surfaces anywhere on the dark web.",
    //         },
    //         {
    //             icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,
    //             label: "Zero Personal Exposure",
    //             desc: "Falbor's agents operate through anonymized proxies. You get the intel, not the risk.",
    //         },
    //     ],
    //     subFeatureIconClass: "text-[#f87171]",
    //     primaryCta: { text: "Discover More", href: "/signup" },
    //     secondaryCta: { text: "View Docs", href: "/docs/darknet" },
    //     customEffect: (
    //         <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
    //             {Array.from({ length: 12 }).map((_, i) => (
    //                 <div key={i} className="absolute w-full h-px bg-red-500" style={{ top: `${8 + i * 8}%` }} />
    //             ))}
    //         </div>
    //     )
    // },
];
