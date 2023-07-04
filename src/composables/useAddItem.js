import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function useAddItem() {
  const addItem = async (cardItem, newItem) => {
    cardItem.todos.push(newItem);

    const { error } = await supabase
      .from(cardItem.table)
      .insert({ item: newItem });

    if (error) {
      console.error(error);
    } else {
      cardItem.showInput = false;
    }
  };

  return {
    addItem,
  };
}
