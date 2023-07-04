import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function useRemoveItem() {
  const removeItem = async (cardItem, todoIndex) => {
    const todos = cardItem.todos;
    const removedItem = todos.splice(todoIndex, 1)[0];

    await supabase.from(cardItem.table).delete().match({ item: removedItem });
  };

  return {
    removeItem,
  };
}
