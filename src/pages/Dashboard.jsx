import React from 'react';
import { Users, DollarSign, ShoppingBag, MessageCircle, Activity, TrendingUp, MoreHorizontal } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const data = [
    { name: 'Mon', value: 4000 },
    { name: 'Tue', value: 3000 },
    { name: 'Wed', value: 2000 },
    { name: 'Thu', value: 2780 },
    { name: 'Fri', value: 1890 },
    { name: 'Sat', value: 2390 },
    { name: 'Sun', value: 3490 },
];

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="glass-panel"
        style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', overflow: 'hidden' }}
    >
        <div style={{
            padding: '1rem',
            borderRadius: '16px',
            background: `linear-gradient(135deg, rgba(${color}, 0.2), rgba(${color}, 0))`,
            color: `rgb(${color})`,
            boxShadow: `0 8px 16px -4px rgba(${color}, 0.2)`
        }}>
            <Icon size={28} />
        </div>
        <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{title}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em' }}>{value}</div>
        </div>
        <div style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '100px',
            height: '100px',
            background: `radial-gradient(circle, rgba(${color}, 0.15) 0%, transparent 70%)`,
            borderRadius: '50%',
            filter: 'blur(10px)'
        }} />
    </motion.div>
);

const Dashboard = () => {
    return (
        <div className="page-container">
            <header className="page-header">
                <div>
                    <h1 className="page-title">Hola, Admin <span style={{ fontSize: '1.5rem' }}>👋</span></h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Aquí está el resumen de hoy.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', fontSize: '0.875rem' }}>
                        📅 Oct 25, 2026
                    </div>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', gridAutoFlow: 'dense' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', gridColumn: 'span 2' }}>
                    {/* Stats Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.5rem' }}>
                        <StatCard title="Ventas" value="$12.4k" icon={DollarSign} color="239, 68, 68" delay={0.1} />
                        <StatCard title="Pedidos" value="18" icon={ShoppingBag} color="59, 130, 246" delay={0.2} />
                        <StatCard title="Mensajes" value="5" icon={MessageCircle} color="16, 185, 129" delay={0.3} />
                    </div>

                    {/* Chart Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="glass-panel"
                        style={{ padding: '2rem', minHeight: '400px', display: 'flex', flexDirection: 'column' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Rendimiento de Ventas</h3>
                                <div style={{ fontSize: '0.875rem', color: 'var(--accent-success)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                                    <TrendingUp size={14} />
                                    <span>+12.5% vs semana pasada</span>
                                </div>
                            </div>
                            <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '0.5rem', borderRadius: '8px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                <MoreHorizontal size={20} />
                            </button>
                        </div>

                        <div style={{ flex: 1, width: '100%', minHeight: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <YAxis stroke="var(--text-secondary)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--glass-border)', borderRadius: '12px', color: 'white' }}
                                        itemStyle={{ color: '#ef4444' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>

                {/* Right Panel - Activity / Targets */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                >
                    <div className="glass-panel" style={{ padding: '1.5rem', flex: 1 }}>
                        <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Actividad Reciente</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: '32px', height: '32px', borderRadius: '50%',
                                        background: i % 2 === 0 ? 'rgba(59, 130, 246, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <Activity size={14} color={i % 2 === 0 ? '#3b82f6' : '#10b981'} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>Nueva Orden #ORD-00{i}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Hace {i * 15} minutos</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, var(--brand-primary), #7f1d1d)', position: 'relative', overflow: 'hidden' }}>
                        <h3 style={{ margin: 0, color: 'white', position: 'relative', zIndex: 1 }}>Objetivo Mensual</h3>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white', margin: '0.5rem 0', position: 'relative', zIndex: 1 }}>85%</div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.3)', borderRadius: '3px', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
                            <div style={{ width: '85%', height: '100%', background: 'white' }} />
                        </div>
                        <div style={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.2 }}>
                            <TrendingUp size={100} color="white" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
