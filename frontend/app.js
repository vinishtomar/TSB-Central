import React, { useState, useEffect } from 'react';
import {
    Users, Car, FileText, Bell, Plus, Search, Filter,
    MoreVertical, TrendingUp, AlertCircle, Euro, Building,
    User, Wrench, Calendar, Info
} from "lucide-react";

// In a real project, these UI components would be in separate files.
const Card = ({ children, className = '' }) => <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>{children}</div>;
const CardHeader = ({ children, className = '' }) => <div className={`p-6 border-b ${className}`}>{children}</div>;
const CardTitle = ({ children, className = '' }) => <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h3>;
const CardContent = ({ children, className = '' }) => <div className={`p-6 ${className}`}>{children}</div>;
const Button = ({ children, variant = 'default', size = 'md', className = '', ...props }) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    const variants = {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        outline: "border border-gray-300 bg-transparent hover:bg-gray-100",
        ghost: "hover:bg-gray-100 hover:text-gray-900",
    };
    const sizes = { sm: "h-9 px-3", md: "h-10 px-4 py-2" };
    return <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>{children}</button>;
};
const Badge = ({ children, className = '' }) => <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}>{children}</span>;

export default function GestionProApp() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [data, setData] = useState({ stats: {}, clients: [], vehicles: [], devis: [], alertes: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ **FIX**: Use environment variable for the API URL.
    // This allows you to set a different URL in production on Render.
    // The fallback to 'http://127.0.0.1:8000' is for local development.
    const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // All endpoints now correctly use the dynamic API_BASE_URL
                const [statsRes, clientsRes, vehiclesRes, devisRes, alertesRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/stats`),
                    fetch(`${API_BASE_URL}/api/clients`),
                    fetch(`${API_BASE_URL}/api/vehicles`),
                    fetch(`${API_BASE_URL}/api/devis`),
                    fetch(`${API_BASE_URL}/api/alertes`),
                ]);

                if (!statsRes.ok || !clientsRes.ok || !vehiclesRes.ok || !devisRes.ok || !alertesRes.ok) {
                    throw new Error('Failed to fetch data from one or more API endpoints.');
                }

                const stats = await statsRes.json();
                const clients = await clientsRes.json();
                const vehicles = await vehiclesRes.json();
                const devis = await devisRes.json();
                const alertes = await alertesRes.json();

                setData({ stats, clients, vehicles, devis, alertes });
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [API_BASE_URL]); // Added API_BASE_URL as a dependency

    const formatCurrency = (amount) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount || 0);
    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateDateString('fr-FR') : 'N/A';

    const getStatusColor = (status) => {
        const colors = {
            'Actif': 'bg-emerald-50 text-emerald-700 border-emerald-200',
            'Prospect': 'bg-blue-50 text-blue-700 border-blue-200',
            'Opérationnel': 'bg-emerald-50 text-emerald-700 border-emerald-200',
            'En panne': 'bg-red-50 text-red-700 border-red-200',
            'Maintenance': 'bg-amber-50 text-amber-700 border-amber-200',
            'En attente validation': 'bg-sky-50 text-sky-700 border-sky-200',
            'Accepté': 'bg-green-50 text-green-700 border-green-200',
            'Refusé': 'bg-red-50 text-red-700 border-red-200',
            'Programmée': 'bg-blue-50 text-blue-700 border-blue-200',
            'Haute': 'bg-orange-100 text-orange-800 border-orange-200',
            'Moyenne': 'bg-amber-100 text-amber-800 border-amber-200',
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    // --- Tab Components ---

    const DashboardTab = () => (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
                    <p className="text-gray-600 mt-1">Vue d'ensemble des activités de l'entreprise</p>
                </div>
                <div className="text-sm text-gray-500">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card><CardContent><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">Clients actifs</p><p className="text-2xl font-semibold text-gray-900">{data.stats.clientsActifs}</p></div><div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center"><Users className="h-6 w-6 text-blue-600" /></div></div></CardContent></Card>
                <Card><CardContent><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">Équipements op.</p><p className="text-2xl font-semibold text-gray-900">{data.stats.vehiculesOperationnels}</p></div><div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center"><Car className="h-6 w-6 text-green-600" /></div></div></CardContent></Card>
                <Card><CardContent><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">CA Réalisé</p><p className="text-2xl font-semibold text-gray-900">{formatCurrency(data.stats.caRealise)}</p></div><div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center"><Euro className="h-6 w-6 text-purple-600" /></div></div></CardContent></Card>
                <Card><CardContent><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">Taux conversion</p><p className="text-2xl font-semibold text-gray-900">{data.stats.tauxConversion}%</p></div><div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center"><TrendingUp className="h-6 w-6 text-orange-600" /></div></div></CardContent></Card>
            </div>
        </div>
    );

    const TableView = ({ title, description, buttonText, children }) => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div><h1 className="text-2xl font-semibold text-gray-900">{title}</h1><p className="text-gray-600 mt-1">{description}</p></div>
                <Button><Plus className="w-4 h-4 mr-2" />{buttonText}</Button>
            </div>
            <Card>
                <CardContent>
                    {children}
                </CardContent>
            </Card>
        </div>
    );

    const ClientsTab = () => (
        <TableView title="Gestion des Clients" description="Base de données des clients et prospects" buttonText="Nouveau client">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50"><tr><th className="th">Client</th><th className="th">Contact</th><th className="th">Statut</th><th className="th-action">Actions</th></tr></thead>
                    <tbody className="divide-y divide-gray-200">
                        {data.clients.map(client => (
                            <tr key={client.id} className="hover:bg-gray-50">
                                <td className="td"><p className="font-medium">{client.nom}</p><p className="text-gray-500">{client.secteur}</p></td>
                                <td className="td"><p className="font-medium">{client.contact}</p><p className="text-gray-500">{client.email}</p></td>
                                <td className="td"><Badge className={getStatusColor(client.statut)}>{client.statut}</Badge></td>
                                <td className="td-action"><Button variant="ghost" size="sm"><MoreVertical className="w-4 h-4" /></Button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </TableView>
    );

    const VehiclesTab = () => (
        <TableView title="Parc d'Équipements" description="Suivi de la flotte de véhicules et engins" buttonText="Nouvel équipement">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50"><tr><th className="th">Équipement</th><th className="th">Localisation</th><th className="th">Prochain Entretien</th><th className="th">Statut</th><th className="th-action">Actions</th></tr></thead>
                    <tbody className="divide-y divide-gray-200">
                        {data.vehicles.map(v => (
                            <tr key={v.id} className="hover:bg-gray-50">
                                <td className="td"><p className="font-medium">{v.nom}</p><p className="text-gray-500">{v.immatriculation || `S/N: ${v.numeroSerie}`}</p></td>
                                <td className="td">{v.localisation}</td>
                                <td className="td">{formatDate(v.prochainEntretien)}</td>
                                <td className="td"><Badge className={getStatusColor(v.statut)}>{v.statut}</Badge></td>
                                <td className="td-action"><Button variant="ghost" size="sm"><MoreVertical className="w-4 h-4" /></Button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </TableView>
    );

    const DevisTab = () => (
        <TableView title="Gestion des Devis" description="Liste des devis créés, en attente et validés" buttonText="Nouveau devis">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50"><tr><th className="th">Projet</th><th className="th">Client</th><th className="th">Montant TTC</th><th className="th">Date</th><th className="th">Statut</th><th className="th-action">Actions</th></tr></thead>
                    <tbody className="divide-y divide-gray-200">
                        {data.devis.map(d => (
                            <tr key={d.id} className="hover:bg-gray-50">
                                <td className="td"><p className="font-medium">{d.id}</p><p className="text-gray-500 truncate max-w-xs">{d.projet}</p></td>
                                <td className="td">{d.client}</td>
                                <td className="td font-mono">{formatCurrency(d.montantTTC)}</td>
                                <td className="td">{formatDate(d.dateCreation)}</td>
                                <td className="td"><Badge className={getStatusColor(d.statut)}>{d.statut}</Badge></td>
                                <td className="td-action"><Button variant="ghost" size="sm"><MoreVertical className="w-4 h-4" /></Button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </TableView>
    );
    
    const AlertesTab = () => (
        <TableView title="Centre d'Alertes" description="Notifications de maintenance et autres avertissements" buttonText="Nouvelle alerte">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50"><tr><th className="th">Titre de l'alerte</th><th className="th">Équipement Concerné</th><th className="th">Échéance</th><th className="th">Priorité</th><th className="th-action">Actions</th></tr></thead>
                    <tbody className="divide-y divide-gray-200">
                        {data.alertes.map(a => (
                            <tr key={a.id} className="hover:bg-gray-50">
                                <td className="td"><p className="font-medium">{a.titre}</p><p className="text-gray-500">{a.type}</p></td>
                                <td className="td">{a.equipement}</td>
                                <td className="td">{formatDate(a.echeance)}</td>
                                <td className="td"><Badge className={getStatusColor(a.priorite)}>{a.priorite}</Badge></td>
                                <td className="td-action"><Button variant="ghost" size="sm"><MoreVertical className="w-4 h-4" /></Button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </TableView>
    );

    const navItems = [
        { key: 'dashboard', label: 'Tableau de bord', icon: TrendingUp },
        { key: 'clients', label: 'Clients', icon: Users },
        { key: 'vehicles', label: 'Équipements', icon: Car },
        { key: 'devis', label: 'Devis', icon: FileText },
        { key: 'alertes', label: 'Alertes', icon: Bell }
    ];

    // --- Loading and Error States ---
    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p>Chargement des données...</p></div>;
    if (error) return <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-700 p-4"><div className="text-center"><AlertCircle className="mx-auto h-12 w-12" /><h2 className="mt-4 text-lg font-semibold">Erreur de connexion</h2><p className="mt-2 text-sm">Impossible de charger les données. Vérifiez que le serveur backend est en ligne et accessible.</p><p className="mt-1 text-xs text-red-600 font-mono">({error})</p></div></div>;
    if (!data.clients || data.clients.length === 0) return <div className="min-h-screen flex items-center justify-center bg-blue-50 text-blue-700 p-4"><div className="text-center"><Info className="mx-auto h-12 w-12" /><h2 className="mt-4 text-lg font-semibold">Base de données vide</h2><p className="mt-2 text-sm">Aucune donnée n'a été trouvée. Il est peut-être nécessaire de peupler la base de données.</p><p className="mt-1 text-xs font-mono">Visitez <a href={`${API_BASE_URL}/seed-database`} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">{`${API_BASE_URL}/seed-database`}</a> pour initialiser.</p></div></div>;

    // --- Main App Layout ---
    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-20">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-3"><div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center"><Building className="h-5 w-5 text-white" /></div><h1 className="text-xl font-bold text-gray-900">GestionPro</h1></div>
                            <div className="hidden md:flex space-x-1">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    return <button key={item.key} onClick={() => setActiveTab(item.key)} className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === item.key ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}><Icon className="w-4 h-4 mr-2" />{item.label}</button>;
                                })}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="sm" className="relative">
                                <Bell className="w-5 h-5" />
                                {data.alertes.length > 0 && <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />}
                            </Button>
                            <div className="h-6 w-px bg-gray-200"></div>
                            <Button variant="ghost" size="sm"><User className="w-4 h-4 mr-2" />Admin</Button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'dashboard' && <DashboardTab />}
                {activeTab === 'clients' && <ClientsTab />}
                {activeTab === 'vehicles' && <VehiclesTab />}
                {activeTab === 'devis' && <DevisTab />}
                {activeTab === 'alertes' && <AlertesTab />}
            </main>

            {/* Simple CSS-in-JS for table styles to keep it single-file */}
            <style jsx global>{`
                .th { padding: 12px 24px; text-align: left; font-size: 0.75rem; font-weight: 500; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; }
                .th-action { padding: 12px 24px; text-align: right; font-size: 0.75rem; font-weight: 500; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; }
                .td { padding: 16px 24px; vertical-align: middle; font-size: 0.875rem; color: #374151; }
                .td-action { padding: 16px 24px; vertical-align: middle; text-align: right; }
                .td .font-medium { font-weight: 500; color: #111827; }
                .td .text-gray-500 { color: #6B7280; }
            `}</style>
        </div>
    );
}
