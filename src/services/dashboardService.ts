import { collection, getDocs, query, getCountFromServer } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface DashboardStats {
  provinces: number;
  heroes: number;
  languages: number;
  culturalSites: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Get counts for each collection
    const [provincesSnapshot, heroesSnapshot, languagesSnapshot, sitesSnapshot] = await Promise.all([
      getCountFromServer(collection(db, 'provincias')),
      getCountFromServer(collection(db, 'heroes')),
      getCountFromServer(collection(db, 'linguasNacionais')),
      getCountFromServer(collection(db, 'parcs')),
      getCountFromServer(collection(db, 'presidents')),
    ]);

    return {
      provinces: provincesSnapshot.data().count,
      heroes: heroesSnapshot.data().count,
      languages: languagesSnapshot.data().count,
      culturalSites: sitesSnapshot.data().count
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}

export const getCulturalSitesByProvince = async (): Promise<{ [key: string]: number }> => {
  try {
    const sitesSnapshot = await getDocs(collection(db, 'culturalSites'));
    const sitesByProvince: { [key: string]: number } = {};
    
    sitesSnapshot.forEach((doc) => {
      const data = doc.data();
      const province = data.province || 'Unknown';
      sitesByProvince[province] = (sitesByProvince[province] || 0) + 1;
    });
    
    return sitesByProvince;
  } catch (error) {
    console.error('Error fetching cultural sites by province:', error);
    throw error;
  }
};
