import React, { useState, useEffect } from 'react';

import Header from '../../components/Header';

import IFoodPlateDTO from '../../dtos/IFoodPlateDTO';
import { list, create, update, del } from '../../services/foods';

import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlateDTO[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlateDTO>(
    {} as IFoodPlateDTO,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      const response = await list();
      if (response.length) {
        setFoods(response);
      }
    }

    loadFoods();
  }, []);

  async function handleAddFood(
    food: Omit<IFoodPlateDTO, 'id' | 'available'>,
  ): Promise<void> {
    try {
      const response = await create(food);
      if (response) {
        setFoods(prevState => [...prevState, response]);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(
    food: Omit<IFoodPlateDTO, 'id' | 'available'>,
  ): Promise<void> {
    const response = await update({ ...editingFood, ...food });
    if (response) {
      setFoods(prevState => {
        const state = [...prevState];
        const foodIndex = state.findIndex(({ id }) => id === response.id);
        if (foodIndex >= 0) {
          state[foodIndex] = response;
        }
        return state;
      });
    }
  }

  async function handleDeleteFood(id: number): Promise<void> {
    const response = await del(id);
    if (response) {
      setFoods(prevState => {
        const state = [...prevState];
        const foodIndex = state.findIndex(food => food.id === id);
        if (foodIndex >= 0) {
          state.splice(foodIndex, 1);
        }
        return state;
      });
    }
  }

  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal(): void {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: IFoodPlateDTO): void {
    setEditingFood(food);
    toggleEditModal();
  }

  async function handleChangeAvailability(food: IFoodPlateDTO): Promise<void> {
    const response = await update(food);
    if (response) {
      setFoods(prevState => {
        const state = [...prevState];
        const foodIndex = state.findIndex(({ id }) => id === response.id);
        if (foodIndex >= 0) {
          state[foodIndex] = response;
        }
        return state;
      });
    }
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
              handleChangeAvailability={handleChangeAvailability}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
