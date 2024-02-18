import { defineStore } from 'pinia';

interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
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
