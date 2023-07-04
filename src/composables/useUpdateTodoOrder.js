import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function useUpdateTodoOrder() {
  const updateTodoItem = async (cardItem, index) => {
    const updatedTodos = cardItem.todos.map((todo) => {
      return { item: todo };
    });

    const { data: existingTodos, error } = await supabase
      .from(cardItem.table)
      .select('item');

    if (error) {
      console.error(error);
      return;
    }

    const sourceItems = existingTodos.map((row) => row.item);
    const removedItem = sourceItems[index];

    if (removedItem) {
      const { error: deleteError } = await supabase
        .from(cardItem.table)
        .delete()
        .match({ item: removedItem });

      if (deleteError) {
        console.error(deleteError);
        return;
      }
    }

    const { error: upsertError } = await supabase
      .from(cardItem.table)
      .upsert(updatedTodos, { onConflict: ['item'] });

    if (upsertError) {
      console.error(upsertError);
      return;
    }
  };

  return {
    updateTodoItem,
  };
}
