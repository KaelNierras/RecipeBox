import { defineStore } from 'pinia';

interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
}

interface TotalAmount {
  id: string;
  amount: number;
}

 export const useSelectedRecipeStore = defineStore({
  id: 'selectedRecipe',
  state: (): { item: Recipe | null } => ({
    item: JSON.parse(localStorage.getItem('selectedRecipe') || 'null'),
  }),
  actions: {
    selectItem(item: Recipe) {
      this.item = item;
      localStorage.setItem('selectedRecipe', JSON.stringify(item));
    },
  },
});

 export const useTotalIngredientAmount = defineStore({
  id: 'TotalIngredientAmount',
  state: (): { item: TotalAmount | null } => ({
    item: JSON.parse(localStorage.getItem('TotalIngredientAmount') || 'null'),
  }),
  actions: {
    selectItem(item: TotalAmount) {
      this.item = item;
      localStorage.setItem('TotalIngredientAmount', JSON.stringify(item));
    },
  },
});
