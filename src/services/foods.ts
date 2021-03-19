import api from './api';
import IFoodPlateDTO from '../dtos/IFoodPlateDTO';

export const list = async (): Promise<IFoodPlateDTO[]> => {
  try {
    const response = await api.get('/foods');
    return response.data;
  } catch (error) {
    return [];
  }
};
