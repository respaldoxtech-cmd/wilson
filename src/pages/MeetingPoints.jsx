import React, { useState } from 'react';
import { MapPin, Plus, Trash2 } from 'lucide-react';

const MeetingPoints = () => {
    const [points, setPoints] = useState([
        { id: 1, name: 'Centro Comercial Las Américas', address: 'Av. Principal 123', active: true },
        { id: 2, name: 'Plaza Bolívar', address: 'Centro, Frente a la catedral', active: true },
    ]);

    return (
        <div className="page-container">
            <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="page-title">Puntos de Encuentro</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Gestiona los lugares de entrega.</p>
                </div>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} />
                    Nuevo Punto
                </button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {points.map(point => (
                    <div key={point.id} className="glass-panel" style={{ padding: '1.5rem', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                            <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ padding: '0.75rem', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-danger)' }}>
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.125rem' }}>{point.name}</h3>
                                <div style={{ fontSize: '0.75rem', color: 'var(--accent-success)', marginTop: '0.25rem' }}>Activo</div>
                            </div>
                        </div>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            {point.address}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MeetingPoints;
