import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, MessageSquare, MapPin, Menu, Bell, User, X, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './../styles/index.css';

const SidebarLink = ({ to, icon, label, onClick }) => (
    <NavLink
        to={to}
        onClick={onClick}
        style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            textDecoration: 'none',
            color: isActive ? 'white' : 'var(--text-secondary)',
            background: isActive ? 'linear-gradient(90deg, rgba(239, 68, 68, 0.2), transparent)' : 'transparent',
            borderLeft: isActive ? '3px solid var(--brand-primary)' : '3px solid transparent',
            transition: 'all var(--transition-fast)',
            margin: '0.25rem 0'
        })}
    >
        {icon}
        <span>{label}</span>
    </NavLink>
);

const SidebarContent = ({ onClose }) => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ padding: '2rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ margin: 0, color: 'var(--brand-primary)', fontSize: '1.5rem' }}>GestiAdmin</h1>
            {onClose && (
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                    <X size={24} />
                </button>
            )}
        </div>

        <nav style={{ flex: 1, padding: '1rem' }}>
            <SidebarLink to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={onClose} />
            <SidebarLink to="/products" icon={<Package size={20} />} label="Productos" onClick={onClose} />
            <SidebarLink to="/orders" icon={<ShoppingCart size={20} />} label="Órdenes" onClick={onClose} />
            <SidebarLink to="/communication" icon={<MessageSquare size={20} />} label="Comunicación" onClick={onClose} />
            <SidebarLink to="/meeting-points" icon={<MapPin size={20} />} label="Puntos Encuentro" onClick={onClose} />
            <SidebarLink to="/users" icon={<Users size={20} />} label="Usuarios" onClick={onClose} />
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--glass-bg)' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={16} color="white" />
                </div>
                <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Admin User</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>admin@gesti.com</div>
                </div>
            </div>
        </div>
    </div>
);

const Layout = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) setIsSidebarOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Desktop Sidebar */}
            {!isMobile && (
                <aside style={{
                    width: '280px',
                    background: 'linear-gradient(to bottom, rgba(5,5,5,0.9), rgba(5,5,5,0.6))',
                    backdropFilter: 'blur(12px)',
                    borderRight: '1px solid var(--glass-border)',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    zIndex: 20
                }}>
                    <SidebarContent />
                </aside>
            )}

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobile && isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 40, backdropFilter: 'blur(4px)' }}
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                bottom: 0,
                                width: '280px',
                                background: 'var(--bg-secondary)',
                                zIndex: 50,
                                borderRight: '1px solid var(--glass-border)'
                            }}
                        >
                            <SidebarContent onClose={() => setIsSidebarOpen(false)} />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            <main style={{
                flex: 1,
                marginLeft: isMobile ? 0 : '280px',
                display: 'flex',
                flexDirection: 'column',
                width: '100%'
            }}>
                <header style={{
                    height: 'var(--header-height)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: isMobile ? '0 1rem' : '0 3rem',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    backdropFilter: 'blur(10px)',
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {isMobile && (
                            <button onClick={() => setIsSidebarOpen(true)} style={{ background: 'none', border: 'none', color: 'white', padding: 0 }}>
                                <Menu size={24} />
                            </button>
                        )}
                        {isMobile && <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>GestiAdmin</span>}
                        {!isMobile && <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Panel de Control</h2>}
                    </div>

                    <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        <Bell size={20} />
                    </button>
                </header>

                <div style={{ flex: 1, padding: isMobile ? '1rem' : '2rem', overflowY: 'auto' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
