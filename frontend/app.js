import React, { useState, useEffect } from 'react';
import {
  Users, Car, FileText, Bell, Plus, Search, Filter,
  MoreVertical, Calendar, Phone, Mail, MapPin, Wrench,
  TrendingUp, AlertCircle, CheckCircle2,
  Clock, Euro, Building, User, Settings, LogOut
} from "lucide-react";

// In a real project, these UI components would be in separate files.
const Card = ({ children, className = '' }) => <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>{children}</div>;
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

  const API_BASE_URL = "http://127.0.0.1:8000/api";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, clientsRes, vehiclesRes, devisRes, alertesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/stats`),
          fetch(`${API_BASE_URL}/clients`),
          fetch(`${API_BASE_URL}/vehicles`),
          fetch(`${API_BASE_URL}/devis`),
          fetch(`${API_BASE_URL}/alertes`),
        ]);

        if (!statsRes.ok || !clientsRes.ok || !vehiclesRes.ok || !devisRes.ok || !alertesRes.ok) {
            throw new Error('Failed to fetch data from the API.');
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
  }, []);

  const formatCurrency = (amount) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount || 0);
  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' }) : 'N/A';

  const getStatusColor = (statut) => {
    const colors = {
      'Actif': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Prospect': 'bg-blue-50 text-blue-700 border-blue-200',
      'Opérationnel': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'En panne': 'bg-red-50 text-red-700 border-red-200',
      'Maintenance préventive': 'bg-amber-50 text-amber-700 border-amber-200',
      'En attente validation': 'bg-blue-50 text-blue-700 border-blue-200',
      'Accepté': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Refusé': 'bg-red-50 text-red-700 border-red-200',
      'Critique': 'bg-red-100 text-red-800 border-red-200',
      'Haute': 'bg-orange-100 text-orange-800 border-orange-200',
      'Moyenne': 'bg-amber-100 text-amber-800 border-amber-200',
    };
    return colors[statut] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const Dashboard = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble des activités de l'entreprise</p>
        </div>
        <div className="text-sm text-gray-500">
           {new Date().toLocaleString('fr-FR')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-sm"><CardContent><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">Clients actifs</p><p className="text-2xl font-semibold text-gray-900">{data.stats.clientsActifs}</p></div><div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center"><Users className="h-6 w-6 text-blue-600" /></div></div></CardContent></Card>
          <Card className="shadow-sm"><CardContent><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">Équipements opérationnels</p><p className="text-2xl font-semibold text-gray-900">{data.stats.vehiculesOperationnels}</p></div><div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center"><Car className="h-6 w-6 text-green-600" /></div></div></CardContent></Card>
          <Card className="shadow-sm"><CardContent><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">CA Réalisé</p><p className="text-2xl font-semibold text-gray-900">{formatCurrency(data.stats.caRealise)}</p></div><div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center"><Euro className="h-6 w-6 text-purple-600" /></div></div></CardContent></Card>
          <Card className="shadow-sm"><CardContent><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">Taux de conversion</p><p className="text-2xl font-semibold text-gray-900">{data.stats.tauxConversion}%</p></div><div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center"><TrendingUp className="h-6 w-6 text-orange-600" /></div></div></CardContent></Card>
      </div>
    </div>
  );

  const ClientsTab = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredClients = data.clients.filter(client =>
        client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <div><h1 className="text-2xl font-semibold text-gray-900">Gestion des clients</h1><p className="text-gray-600 mt-1">Base de données clients et prospects</p></div>
                <Button><Plus className="w-4 h-4 mr-2" />Nouveau client</Button>
            </div>
            <Card>
                <CardContent>
                    <div className="flex gap-4 items-center py-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input type="text" placeholder="Rechercher par nom ou email..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <Button variant="outline"><Filter className="w-4 h-4 mr-2" />Filtres</Button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredClients.map(client => (
                                    <tr key={client.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4"><p className="text-sm font-medium text-gray-900">{client.nom}</p><p className="text-sm text-gray-500">{client.adresse}</p></td>
                                        <td className="px-6 py-4"><p className="text-sm font-medium text-gray-900">{client.contact}</p><p className="text-sm text-gray-500 flex items-center gap-2 mt-1"><Mail className="w-3 h-3" /> {client.email}</p></td>
                                        <td className="px-6 py-4"><Badge className={getStatusColor(client.statut)}>{client.statut}</Badge></td>
                                        <td className="px-6 py-4 text-right"><Button variant="ghost" size="sm"><MoreVertical className="w-4 h-4" /></Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
  };

  const navItems = [
    { key: 'dashboard', label: 'Tableau de bord', icon: TrendingUp },
    { key: 'clients', label: 'Clients', icon: Users },
    { key: 'vehicles', label: 'Équipements', icon: Car },
    { key: 'quotes', label: 'Devis', icon: FileText },
    { key: 'alerts', label: 'Alertes', icon: Bell }
  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p>Chargement des données...</p></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-700"><div className="text-center"><AlertCircle className="mx-auto h-12 w-12"/><h2 className="mt-4 text-lg font-semibold">Erreur de connexion</h2><p className="mt-2 text-sm">Impossible de charger les données. Vérifiez que le serveur backend est bien lancé.</p><p className="mt-1 text-xs text-red-500">({error})</p></div></div>;
  if (!data.clients || data.clients.length === 0) return <div className="min-h-screen flex items-center justify-center bg-blue-50 text-blue-700"><div className="text-center"><AlertCircle className="mx-auto h-12 w-12"/><h2 className="mt-4 text-lg font-semibold">Base de données vide</h2><p className="mt-2 text-sm">Les données n'ont pas encore été initialisées.</p><p className="mt-1 text-xs">Veuillez visiter `http://127.0.0.1:8000/seed-database` dans votre navigateur pour peupler la base de données.</p></div></div>;


  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3"><div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center"><Building className="h-5 w-5 text-white" /></div><h1 className="text-xl font-semibold text-gray-900">GestionPro</h1></div>
              <div className="hidden md:flex space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return <button key={item.key} onClick={() => setActiveTab(item.key)} className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === item.key ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}><Icon className="w-4 h-4 mr-2" />{item.label}</button>;
                })}
              </div>
            </div>
            <div className="flex items-center gap-3"><Button variant="ghost" size="sm" className="relative"><Bell className="w-5 h-5" /></Button><div className="h-6 w-px bg-gray-300"></div><Button variant="ghost" size="sm"><User className="w-4 h-4 mr-2" />Admin</Button></div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'clients' && <ClientsTab />}
        {/* Add other tab components here */}
      </main>
    </div>
  );
}

