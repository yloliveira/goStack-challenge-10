import api from './api';
import IFoodPlateDTO from '../dtos/IFoodPlateDTO';
import ICreateFoodDTO from '../dtos/ICreateFoodDTO';

export const list = async (): Promise<IFoodPlateDTO[]> => {
  try {
    const response = await api.get('/foods');
    return response.data;
  } catch (error) {
    return [];
  }
};

export const create = async (
  food: ICreateFoodDTO,
): Promise<IFoodPlateDTO | undefined> => {
  try {
    const response = await api.post('/foods', { ...food, available: true });
    return response.data;
  } catch (error) {
    return undefined;
  }
};

export const update = async (
  food: IFoodPlateDTO,
): Promise<IFoodPlateDTO | undefined> => {
  try {
    const response = await api.put(`/foods/${food.id}`, food);
    return response.data;
  } catch (error) {
    return undefined;
  }
};
