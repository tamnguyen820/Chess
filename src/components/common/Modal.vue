<template>
  <div v-if="!close" class="modal-container" :id="`modal-container-${id}`">
    <div
      class="modal-background"
      :id="`modal-background-${id}`"
      @click="closeModal()"
    ></div>
    <div
      class="modal"
      :id="`modal-${id}`"
      tabindex="0"
      @keyup="handleKeyUpModal"
    >
      <div class="modal-top">
        <div role="heading" class="modal-heading">
          <slot name="modalHeading"> Modal heading </slot>
        </div>
        <button class="close-button" @click="closeModal()">
          <img src="../../assets/images/icon/close-icon-round.svg" />
        </button>
      </div>
      <div role="content" class="modal-content">
        <slot name="modalContent">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Alias
          accusantium temporibus blanditiis delectus, in quae earum, explicabo
          eius necessitatibus ipsam dolorum deleniti assumenda eum perspiciatis
          maiores error doloribus laboriosam. Quia praesentium ea iure quo
          molestiae voluptatum esse, ut exercitationem nisi!
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import { uniqueId } from "lodash";

export default {
  data() {
    return {
      close: true,
    };
  },
  props: {
    id: {
      type: String,
      default: () => uniqueId(),
    },
  },
  methods: {
    closeModal() {
      const modalContainer = document.getElementById(
        "modal-container-" + this.id
      );
      modalContainer.style.animation = "modalOut 0.3s forwards";
      const modalClose = () => {
        this.close = true;
        modalContainer.removeEventListener("animationend", modalClose);

        // Z-index stacking works weird
        const controlButton = document.getElementById("navigation-control");
        controlButton.style.zIndex = 1001;

        this.$emit("closed-modal-" + this.id);
      };
      modalContainer.addEventListener("animationend", modalClose);
    },
    openModal() {
      this.close = false;
      this.$nextTick(() => {
        const modalContainer = document.getElementById(
          "modal-container-" + this.id
        );
        modalContainer.style.animation = "modalIn 0.3s forwards";
      });
    },
    handleKeyUpModal(e) {
      const code = e.keyCode;
      if (code === 27) {
        this.closeModal();
      }
    },
  },
};
</script>

<style lang="scss">
.modal-container {
  padding: 0;
  margin: 0;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5000;
  opacity: 1;
  .modal-background {
    height: 100vh;
    width: 100vw;
    position: fixed;
    background: rgba(0, 0, 0, 0.4);
  }
  .modal {
    background: white;
    position: fixed;
    border-radius: 5px;
    width: max-content;
    min-width: 30%;
    max-width: 60%;
    position: relative;
    overflow: hidden;
    .close-button {
      border: 0;
      background: none;
      display: flex;
      align-items: center;
      height: max-content;
      img {
        aspect-ratio: 1;
        width: 1rem;
        &:hover {
          cursor: pointer;
        }
      }
    }
    .modal-top {
      display: flex;
      justify-content: space-between;
      background: #dbd9d7;
      align-items: center;

      padding: 0.75rem 1rem;
      .modal-heading {
        font-size: var(--modal-heading-font-size);
        font-weight: 600;
      }
    }
    .modal-content {
      padding: 1rem 1rem 1.5rem 1rem;
      font-size: var(--modal-content-font-size);
      font-weight: 400;
      overflow-wrap: break-word;
    }
  }
}

@keyframes modalIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes modalOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@media (max-width: 50rem) {
  .modal-container {
    .modal {
      min-width: 60%;
      max-width: 80%;
    }
  }
}
</style>