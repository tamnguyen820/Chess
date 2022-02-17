<template>
  <div class="slider">
    <input
      type="range"
      :id="`slider-${id}`"
      :min="range.min.value"
      :max="range.max.value"
      v-model="sliderValue"
      :steps="range.steps"
      :disabled="disable"
    />
    <div class="range">
      <div>{{ range.min.name }}</div>
      <div>{{ range.max.name }}</div>
    </div>
  </div>
</template>

<script>
import { uniqueId } from "lodash";

export default {
  data() {
    return {
      sliderValue: 100,
    };
  },
  props: {
    id: {
      type: String,
      default: () => uniqueId(),
    },
    range: {
      type: Object,
      required: true,
    },
    disable: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
$width: clamp(10rem, 18vw, 18rem);
$toggle-width: clamp(2.75rem, 3.25vw, 3.5rem);
$thumb-height: calc(calc($toggle-width / 2) * 1.05);

.slider {
  width: 100%;
  min-height: max-content;
  aspect-ratio: 4.5/1;
  display: flex;
  flex-direction: column;
  justify-content: center;

  input[type="range"] {
    appearance: none;
    -webkit-appearance: none;
    width: 100%;
    height: calc($thumb-height / 4);
    background: #388fe7;
    border-radius: 2.5px;
    outline: none;
    border: none;
    cursor: pointer;
    &:focus-visible {
      outline: 2px solid #388fe7;
      outline-offset: calc($thumb-height / 3);
    }

    &::-webkit-slider-thumb {
      appearance: none;
      -webkit-appearance: none;
      height: $thumb-height;
      width: $thumb-height;
      border-radius: 50%;
      background: white;
      border: 1px solid #dad7d5;
      box-shadow: 0 0 0.1rem rgba(0, 0, 0, 0.5);
      cursor: pointer;
    }
    &:disabled {
      pointer-events: none;
      background-color: #dbd9d7;
    }
  }

  .range {
    position: relative;
    font-size: calc(0.8 * var(--modal-content-font-size));
    div {
      position: absolute;
      top: calc($thumb-height / 2);
      &:last-child {
        right: 0;
      }
    }
  }
}
</style>