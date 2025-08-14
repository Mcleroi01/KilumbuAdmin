import { useState } from 'react';
import { Province } from '../types';
import ProvinceList from '../components/provinces/ProvinceList';
import ProvinceForm from '../components/provinces/ProvinceForm';
import { updateProvince, createProvince } from '../components/provinces/service/provinceService';

const Provinces = () => {
  const [currentProvince, setCurrentProvince] = useState<Province | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const handleEdit = (province: Province) => {
    setCurrentProvince(province);
    setShowForm(true);
  };

  const handleSubmit = async (provinceData: Province) => {
    try {
      setFormLoading(true);

      if (currentProvince?.id) {
        // Update existing province
        // Convertir les dates au format Date avant l'envoi
        const { createdAt, updatedAt, ...dataWithoutDates } = provinceData;
        await updateProvince(currentProvince.id, {
          ...dataWithoutDates,
          updatedAt: new Date()
        });
      } else {
        // Add new province
        const { id, ...newData } = provinceData;
        await createProvince({
          ...newData,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      setShowForm(false);
      setCurrentProvince(null);
    } catch (error) {
      console.error('Erro ao salvar província:', error);
      alert('Erro ao salvar província. Tente novamente.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {showForm ? (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {currentProvince ? 'Editar Província' : 'Nova Província'}
          </h2>
          <ProvinceForm
            province={currentProvince || undefined}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setCurrentProvince(null);
            }}
            loading={formLoading}
          />
        </div>
      ) : (
        <ProvinceList
          onEdit={handleEdit}
          onAdd={() => {
            setCurrentProvince(null);
            setShowForm(true);
          }}
        />
      )}
    </div>
  );
};

export default Provinces;