'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { LayoutDashboard, Mail, Ban } from 'lucide-react';

export default function NavigationSidebar() {
    const pathname = usePathname();

    const navItems = [
        { href: '/', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/mail-management', label: 'Mail Management', icon: Mail },
        { href: '/suppressed', label: 'Suppressed Mail IDs', icon: Ban },
    ];

    return (
        <aside className="navigation-sidebar">
            <div className="sidebar-header">
                <Image
                    src="/leadify-logo.png"
                    alt="Leadify"
                    width={120}
                    height={40}
                    className="sidebar-logo"
                    priority
                />
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
