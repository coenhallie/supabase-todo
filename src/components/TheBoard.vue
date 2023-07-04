<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import draggable from 'vuedraggable';
import CardItem from './CardItem.vue';
import { PencilSquareIcon } from '@heroicons/vue/24/outline';
import { TrashIcon } from '@heroicons/vue/24/outline';
import useSaveTodo from '@/composables/useSaveTodo.js';
import useUpdateTodoOrder from '@/composables/useUpdateTodoOrder';
import useFetchItems from '@/composables/useFetchItems';
import useAddItem from '@/composables/useAddItem';
import useRemoveItem from '@/composables/useRemoveItem';

import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const todoItems = ref(['']);
const inProgressItems = ref(['']);
const doneItems = ref(['']);
const originalItem = ref('');

const cardItems = [
  reactive({
    heading: 'To do',
    todos: todoItems,
    showInput: false,
    table: 'todos',
    backgroundColor: '#a080a3',
  }),
  reactive({
    heading: 'In Progress',
    todos: inProgressItems,
    showInput: false,
    table: 'inprogress',
    backgroundColor: '#eec88c',
  }),
  reactive({
    heading: 'Done',
    todos: doneItems,
    showInput: false,
    table: 'done',
    backgroundColor: '#87a4a4',
  }),
];

const { addItem } = useAddItem();
const { removeItem } = useRemoveItem();
const { fetchItems } = useFetchItems(cardItems);
const { updateTodoItem } = useUpdateTodoOrder();

const hoverIndex = ref({ cardIndex: -1, todoIndex: -1 });

const setHoverIndex = (cardIndex, todoIndex) => {
  hoverIndex.value = { cardIndex, todoIndex };
};

const toggleInput = (cardItem) => {
  cardItem.showInput = !cardItem.showInput;
};

const editTodo = (cardIndex, todoIndex) => {
  const cardItem = cardItems[cardIndex];
  const tableName = cardItem.todos;

  originalItem.value = tableName[todoIndex];
  editTodoIndex.value = { cardIndex, todoIndex };
};

const { saveTodo, editTodoIndex } = useSaveTodo(originalItem);

const isEditingTodo = (cardIndex, todoIndex) => {
  return (
    editTodoIndex.value.cardIndex === cardIndex &&
    editTodoIndex.value.todoIndex === todoIndex
  );
};

onMounted(() => {
  fetchItems();
});
</script>

<template>
  <div class="grid lg:grid-cols-3 gap-4 px-40 p-6">
    <CardItem
      v-if="!loading"
      v-for="(cardItem, index) in cardItems"
      :key="index"
      :style="{ backgroundColor: cardItem.backgroundColor }"
    >
      <template #heading>{{ cardItem.heading }}</template>
      <draggable
        v-model="cardItem.todos"
        tag="ul"
        group="todos"
        :animation="400"
        :itemKey="(item, index) => index"
        @change="updateTodoItem(cardItem, index)"
      >
        <template
          v-for="(todo, todoIndex) in cardItem.todos"
          #item="{ element: todo, index: todoIndex }"
        >
          <li
            @mouseover="setHoverIndex(index, todoIndex)"
            @mouseleave="setHoverIndex(-1, -1)"
            class="justify-between flex align-middle items-center p-2 m-2 h-12 text-middle cursor-grab text-xs border rounded border-light-400"
            :style="{ backgroundColor: cardItem.backgroundColor }"
          >
            <p v-if="!isEditingTodo(index, todoIndex)">
              {{ todo }}
            </p>
            <div class="button-container">
              <button
                v-if="
                  hoverIndex.cardIndex === index &&
                  hoverIndex.todoIndex === todoIndex &&
                  !isEditingTodo(index, todoIndex)
                "
                @click="removeItem(cardItem, todoIndex)"
              >
                <TrashIcon
                  class="w-4 mx-1 my-0 text-white hover:text-gray-200"
                />
              </button>
              <button
                v-if="!isEditingTodo(index, todoIndex)"
                @click="editTodo(index, todoIndex)"
              >
                <PencilSquareIcon
                  v-if="
                    hoverIndex.cardIndex === index &&
                    hoverIndex.todoIndex === todoIndex &&
                    !isEditingTodo(index, todoIndex)
                  "
                  class="w-4 mx-1 my-0 text-white hover:text-gray-200"
                />
              </button>
              <div class="flex h-8 mx-2" v-else>
                <input
                  class="border border-sky-500 px-2 rounded text-black font-bold text-xs"
                  v-model="cardItem.todos[todoIndex]"
                />
                <button
                  class="bg-gray-500 hover:bg-gray-600 rounded mx-1 p-2 text-white font-bold text-xs"
                  @click="saveTodo(cardItem, todoIndex)"
                >
                  Save
                </button>
              </div>
            </div>
          </li>
        </template>
      </draggable>
      <button
        v-if="!cardItem.showInput"
        class="text-xs h-8 bg-gray-500 hover:bg-gray-600 rounded text-white px-3 py-1 m-2 font-bold"
        @click="toggleInput(cardItem)"
      >
        + Add a card
      </button>
      <div class="mx-2">
        <input
          class="border border-sky-500 px-2 rounded text-black py-1 w-fit font-bold text-xs"
          v-if="cardItem.showInput"
          v-model="cardItem.newItem"
          placeholder="Enter a title for this card..."
          @keyup.enter="addItem(cardItem, cardItem.newItem)"
        />
        <button
          :disabled="!cardItem.newItem"
          v-if="cardItem.showInput"
          @click="addItem(cardItem, cardItem.newItem)"
          class="bg-gray-500 hover:bg-gray-600 rounded text-white p-1 mx-2 font-bold text-xs"
        >
          Add card
        </button>
      </div>
    </CardItem>
  </div>
</template>

<style>
html {
  font-size: 1.5rem;
  font-family: 'Open Sans', sans-serif;
}

p,
h1 {
  font-family: 'Open Sans', sans-serif;
}

h1 {
  margin-bottom: 0;
}
ul {
  margin-top: 0;
}
</style>
