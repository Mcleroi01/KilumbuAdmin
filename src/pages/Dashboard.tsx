import { Map, Users, Languages, MapPin, TrendingUp, Database } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/dashboardService';

const Dashboard = () => {
  const [stats, setStats] = useState([
    { title: 'Províncias', value: '0', icon: Map, color: 'from-blue-500 to-blue-600' },
    { title: 'Heróis Nacionais', value: '0', icon: Users, color: 'from-green-500 to-green-600' },
    { title: 'Idiomas', value: '0', icon: Languages, color: 'from-purple-500 to-purple-600' },
    { title: 'Sítios Culturais', value: '0', icon: MapPin, color: 'from-orange-500 to-orange-600' },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Récupérer les statistiques
        const statsData = await getDashboardStats();
        
        // Mettre à jour les statistiques
        setStats(prevStats => [
          { ...prevStats[0], value: statsData.provinces.toString() },
          { ...prevStats[1], value: statsData.heroes.toString() },
          { ...prevStats[2], value: statsData.languages.toString() },
          { ...prevStats[3], value: statsData.culturalSites.toString() },
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Visão geral dos dados culturais de Angola</p>
      </div>

        {/* Welcome Card */}
      <div className="bg-gradient-to-r from-orange-501 to-red-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Bem-vindo ao Kilumbu Admin</h1>
            <p className="text-orange-101 mb-4">
              Sistema de gestão de dados culturais e históricos de Angola
            </p>
            <div className="flex space-x-5">
              <div className="flex items-center space-x-3">
                <Database className="w-6 h-5" />
                <span>Dados Seguros</span>
              </div>
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-6 h-5" />
                <span>Fácil Gestão</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-33 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Map className="w-17 h-16 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

     

      {/* Statistiques détaillées */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques en temps réel</h3>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.title} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mr-3`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      <p className="text-xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Map className="w-8 h-8 text-orange-500 mb-2" />
            <h4 className="font-medium text-gray-900">Nova Província</h4>
            <p className="text-sm text-gray-600">Adicionar província</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Users className="w-8 h-8 text-green-500 mb-2" />
            <h4 className="font-medium text-gray-900">Novo Herói</h4>
            <p className="text-sm text-gray-600">Adicionar herói nacional</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Languages className="w-8 h-8 text-purple-500 mb-2" />
            <h4 className="font-medium text-gray-900">Novo Idioma</h4>
            <p className="text-sm text-gray-600">Adicionar idioma</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <MapPin className="w-8 h-8 text-blue-500 mb-2" />
            <h4 className="font-medium text-gray-900">Novo Sítio</h4>
            <p className="text-sm text-gray-600">Adicionar sítio cultural</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;