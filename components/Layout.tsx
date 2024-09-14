'use client'

import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function Layout({ children, page }: { children: React.ReactNode, page: string }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar
                collapsed={sidebarCollapsed}
                // setCollapsed={setSidebarCollapsed}
                page={page}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

                <main className="flex-1 overflow-auto p-4">
                    {children}
                </main>
            </div>

        </div>
    )
}