<template>
  <label
    class="toggle"
    :for="`input-toggle-${id}`"
    :tabindex="tabIndex"
    @keyup="handleKeyUp"
    :class="{ disabled: disable }"
  >
    <input
      class="input-toggle"
      v-model="on"
      :value="value"
      type="checkbox"
      :id="`input-toggle-${id}`"
    />
    <div class="toggle-fill"></div>
  </label>
</template>

<script>
import { uniqueId } from "lodash";

export default {
  props: {
    id: {
      type: String,
      default: () => uniqueId(),
    },
    value: {
      type: Boolean,
      required: true,
    },
    disable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      on: null,
    };
  },
  computed: {
    tabIndex() {
      return this.disable ? -1 : 0;
    },
  },
  watch: {
    value(newValue) {
      this.on = newValue;
    },
    on(newValue) {
      this.$emit("change-input-toggle-" + this.id, newValue);
    },
  },
  mounted() {
    this.on = this.value;
  },
  methods: {
    handleKeyUp(e) {
      const code = e.keyCode;
      if (code === 13 || code === 32) {
        this.on = !this.on;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$width: clamp(2.75rem, 3.25vw, 3.5rem);
$height: calc($width / 2);
$border-radius: calc($height / 2);

.disabled {
  pointer-events: none;
  user-select: none;
}

.toggle {
  display: inline-block;
  cursor: pointer;
  .input-toggle {
    display: none;
    &:checked ~ .toggle-fill {
      background: #388fe7;
      &::after {
        transform: translateX($height);
      }
    }
  }
  .toggle-fill {
    position: relative;
    width: $width;
    height: $height;
    border-radius: $border-radius;
    background: #dddddd;
    transition: background 0.2s ease;
    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      aspect-ratio: 1;
      height: $height;
      background: white;
      border: 1px solid #dad7d5;
      border-radius: 50%;
      transition: transform 0.2s ease;
      margin: calc(-0.04 * $height);
      box-shadow: 0 0 0.1rem rgba(0, 0, 0, 0.5);
    }
  }
}
</style>