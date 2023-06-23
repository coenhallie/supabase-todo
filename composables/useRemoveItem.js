import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function useRemoveItem() {
  const removeItem = async (cardItem, todoIndex) => {
    if (todoIndex > -1) {
      const removedTodo = cardItem.todos.splice(todoIndex, 1)[0];

      const { data, error } = await supabase
        .from(cardItem.table)
        .delete()
        .match({ item: removedTodo });

      if (error) {
        console.error(error);
      } else {
        console.log(data);
      }
    }
  };
  return {
    removeItem,
  };
}
