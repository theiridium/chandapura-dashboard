"use client"
import { SessionProvider } from "next-auth/react";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';

const Wrapper = ({
    children, session
}: Readonly<{
    children: React.ReactNode, session: any
}>) => {
    return (
        <SessionProvider session={session}>
            <ThemeProvider>
                <SidebarProvider>{children}</SidebarProvider>
            </ThemeProvider>
        </SessionProvider>
    )
}

export default Wrapper