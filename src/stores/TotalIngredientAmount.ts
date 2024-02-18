import { defineStore } from 'pinia';

interface TotalAmount {
  id: string;
  amount: number;
}

 export const useTotalIngredientAmount = defineStore({
  id: 'TotalIngredientAmount',
  state: (): { amount: TotalAmount | null } => ({
    amount: JSON.parse(localStorage.getItem('TotalIngredientAmount') || 'null'),
  }),
  actions: {
    totalAmount(amount: TotalAmount) {
      this.amount = amount;
      localStorage.setItem('TotalIngredientAmount', JSON.stringify(amount));
    },
  },
});
