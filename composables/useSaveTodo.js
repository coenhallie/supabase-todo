import { ref } from 'vue';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function useSaveTodo() {
  const editTodoIndex = ref(-1);

  const saveTodo = async (cardItem, todoIndex) => {
    const originalItem = cardItem.todos[todoIndex];
    const newItem = cardItem.todos[todoIndex];

    const { data: deleteData, deleteError } = await supabase
      .from(cardItem.table)
      .delete()
      .eq('item', originalItem);

    if (deleteError) {
      console.error(deleteError);
      return;
    }

    const { data: insertData, insertError } = await supabase
      .from(cardItem.table)
      .insert([{ item: newItem }]);

    if (insertError) {
      console.error(insertError);
      return;
    }

    editTodoIndex.value = -1;
  };

  return {
    saveTodo,
    editTodoIndex,
  };
}
