import { defineStore } from 'pinia';

interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  // add other properties as needed
}

export const useSelectedRecipeStore = defineStore({
  id: 'selectedRecipe',
  state: (): { item: Recipe | null } => ({
    item: null,
  }),
  actions: {
    selectItem(item: Recipe) {
      this.item = item;
    },
  },
});