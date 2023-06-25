import { ref } from 'vue';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function useFetchItems(cardItems) {
  const loading = ref(true);
  const fetchItems = async () => {
    loading.value = true;

    try {
      const requests = cardItems.map(async (cardItem) => {
        const { data, error } = await supabase
          .from(cardItem.table)
          .select('*', { order: 'order' });

        if (error) {
          console.error(error);
        } else {
          cardItem.todos = data.map((item) => item.item);
        }
      });

      await Promise.all(requests);
    } catch (error) {
      console.error(error);
    }

    loading.value = false;
  };
  return {
    fetchItems,
  };
}
