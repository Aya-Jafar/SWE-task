<script setup lang="ts">

/**
 * Modal for creating new tree nodes
 * @prop {string|null} [parentId] - Parent node ID
 * @emits close - When modal closes
 * @emits submit - When form submits ({label, parentId, description, numberOfEmployees})
 * 
 * @example <CreateNodeModal @submit="handleCreate" @close="handleClose"/>
 */


import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  parentId: {
    type: [String, null],
    default: null,
  },
});

// Reactive states and emits
const modalRef = ref<HTMLElement | null>(null);
const emit = defineEmits(["close", "submit"]);
const newNodeLabel = ref("");
const description = ref("");
const numberOfEmployees = ref<number | null>(null);
const isInputValid = ref(true);
const errorMessages = ref<Record<string, string>>({});

/**
 *  Reset and emit new node data
 **/
const resetAndEmit = (newNode: {
  label: string;
  parentId: string | null;
  description: string;
  numberOfEmployees: number | null;
}) => {
  emit("submit", newNode);
  newNodeLabel.value = "";
  description.value = "";
  numberOfEmployees.value = null;
  emit("close");
};

/**
 *  Validate the form
 **/
const validateForm = () => {
  const errors: Record<string, string> = {};

  // Validate label
  if (!newNodeLabel.value.trim()) {
    errors.label = "empty_node_label";
  }

  // Validate description
  if (!description.value.trim()) {
    errors.description = "empty_description";
  }

  // Validate number of employees
  if (numberOfEmployees.value === null || numberOfEmployees.value < 0) {
    errors.numberOfEmployees = "invalid_employee_count";
  }

  // Update error messages
  errorMessages.value = errors;

  // Return true if there are no errors
  return Object.keys(errors)?.length === 0;
};

/**
 * Handle form submission
 **/
const handleSubmit = () => {
  // Validate the form
  if (!validateForm()) {
    isInputValid.value = false;
    return; // Stop submission if the form is invalid
  }

  // If the form is valid, proceed with submission
  isInputValid.value = true;

  const newNode = {
    label: newNodeLabel.value,
    parentId: props.parentId,
    description: description.value,
    numberOfEmployees: numberOfEmployees.value,
  };

  resetAndEmit(newNode);
};

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  if (modalRef.value && !modalRef.value.contains(event.target as Node)) {
    emit("close");
  }
};

// Add event listener when the component is mounted
onMounted(() => {
  // Use a slight delay to ensure the modal is fully rendered before adding the event listener
  setTimeout(() => {
    document.addEventListener("click", handleClickOutside);
  }, 0);
});

// Remove event listener when the component is unmounted
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50"
  >
    <div class="bg-slate-900 rounded-lg p-6 w-96" ref="modalRef">
      <h2 class="text-xl font-semibold mb-4 text-white">
        {{ $t("createNewDepartment") }}
      </h2>

      <!-- Form for Creating a New Node -->
      <form @submit.prevent="handleSubmit">
        <!-- Node Label Input -->
        <input
          v-model="newNodeLabel"
          type="text"
          :placeholder="$t('enterNodeLabel')"
          class="w-full p-2 rounded-md bg-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-2"
          :class="{ 'border-red-400': errorMessages.label }"
          aria-label="Node label input"
        />
        <!-- Error message for label -->
        <p v-if="errorMessages.label" class="text-red-400 text-sm mb-4">
          {{ $t(errorMessages.label) }}
        </p>

        <!-- Number of Employees Input -->
        <input
          v-model.number="numberOfEmployees"
          type="number"
          :placeholder="$t('enterNumberOfEmployees')"
          class="w-full p-2 rounded-md bg-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-2"
          :class="{ 'border-red-400': errorMessages.numberOfEmployees }"
          aria-label="Number of employees input"
        />
        <!-- Error message for number of employees -->
        <p
          v-if="errorMessages.numberOfEmployees"
          class="text-red-400 text-sm mb-4"
        >
          {{ $t(errorMessages.numberOfEmployees) }}
        </p>

        <!-- Description Input -->
        <textarea
          v-model="description"
          :placeholder="$t('enterDescription')"
          class="w-full p-2 rounded-md bg-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-2"
          :class="{ 'border-red-400': errorMessages.description }"
          aria-label="Description input"
        ></textarea>
        <!-- Error message for description -->
        <p v-if="errorMessages.description" class="text-red-400 text-sm mb-4">
          {{ $t(errorMessages.description) }}
        </p>

        <!-- Buttons -->
        <div class="flex justify-end">
          <button
            type="button"
            @click="emit('close')"
            :aria-label="$t('cancel')"
            class="mr-2 px-4 py-2 bg-slate-700 text-white rounded hover:bg-gray-500"
          >
            {{ $t("cancel") }}
          </button>
          <button
            type="submit"
            :aria-label="$t('createNode')"
            class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            {{ $t("create") }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
