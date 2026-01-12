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
        { href: '/suppressed', label: 'Suppressed Mail ID\'s', icon: Ban },
    ];

    return (
        <aside className="navigation-sidebar">
            <div className="sidebar-header">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                        <Mail className="text-white fill-current" size={20} />
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">Leadify</span>
                </div>
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
