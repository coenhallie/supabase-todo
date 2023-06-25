import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function useUpdateTodoOrder() {
  const updateTodoItem = async (cardItem, todos) => {
    const updatedTodos = todos.map((todo, index) => {
      if (index === cardItem.todoIndex) {
        return { item: cardItem.newItem };
      }
      return { item: todo };
    });

    const { error } = await supabase
      .from(cardItem.table)
      .upsert(updatedTodos, { onConflict: ['item'], exclude: ['item'] });

    if (error) {
      console.error(error);
      return;
    }
  };

  return {
    updateTodoItem,
  };
}
