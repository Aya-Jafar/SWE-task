<script setup lang="ts">
/**
 * Reusable button with states and click handler
 * @prop {Boolean} [disabled=false] - Disables button
 * @prop {Boolean} [loading=false] - Shows loading state
 * @prop {Function} action - Click handler
 * @slot default - Button content
 *
 * @example <Button :action="submit" :loading="busy">Save</Button>
 */

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  action: {
    type: Function,
    required: true,
  },
});

const handleClick = () => {
  if (!props.disabled && !props.loading) {
    props.action();
  }
};
</script>

<template>
  <button
    :disabled="props.disabled"
    @click="handleClick"
    class="!font-bold py-2 bg-slate-800 text-white rounded-md hover:bg-gray-700"
  >
    <span v-if="props.loading">Loading...</span>
    <span><slot /></span>
  </button>
</template>
