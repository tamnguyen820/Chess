<template>
  <Modal id="import" @closed-modal-import="setModalClose" ref="modal">
    <template v-slot:modalHeading>Import</template>
    <template v-slot:modalContent>
      <div class="import-content">
        <div class="content-line">
          <div>Options</div>
          <Dropdown
            id="import-option"
            :options="importOptions"
            :selectedValue="currentOption"
            @change-dropdown-import-option="changeImportOption"
          />
        </div>
        <textarea
          name=""
          id=""
          placeholder="Paste your text here"
          spellcheck="false"
          autocomplete="off"
          v-model="textInput"
          @mousedown="noOutline($event)"
          @blur="removeNoOutline($event)"
        ></textarea>
        <div class="submit-line">
          <button class="clear-btn" @click="clearInput">Clear</button>
          <button class="submit-btn" @click="submitInput">Submit</button>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

import Modal from "./common/Modal.vue";
import Dropdown from "./common/Dropdown.vue";

export default {
  data() {
    return {
      importOptions: [
        { name: "PGN (default)", value: "PGN" },
        { value: "FEN" },
      ],
      currentOption: "PGN",
      textInput: "",
    };
  },
  components: { Modal, Dropdown },
  computed: {
    ...mapGetters({
      getImportModalOpen: "analysisSettings/getImportModalOpen",
      pgnLoaded: "game/getPGNLoaded",
      fenLoaded: "game/getFENLoaded",
    }),
  },
  methods: {
    ...mapMutations({
      setImportModalOpen: "analysisSettings/setImportModalOpen",
      loadPGN: "game/loadPGN",
      loadFEN: "game/loadFEN",
    }),
    openModal() {
      this.$refs.modal.openModal();
      this.$nextTick(() => {
        document.getElementById("modal-import").focus();
      });
    },
    setModalClose() {
      this.setImportModalOpen(false);
    },

    changeImportOption(val) {
      this.currentOption = val;
    },
    submitInput() {
      if (this.textInput) {
        var success = false;
        if (this.currentOption === "PGN") {
          this.loadPGN(this.textInput);
          success = this.pgnLoaded;
        } else if (this.currentOption === "FEN") {
          this.loadFEN(this.textInput);
          success = this.fenLoaded;
        }

        if (success) {
          this.$refs.modal.closeModal();
        } else {
          alert("Import failed!");
        }
      }
    },
    clearInput() {
      this.textInput = "";
    },

    noOutline(e) {
      const select = e.target;
      if (!select.classList.contains("no-outline")) {
        select.classList.add("no-outline");
      }
    },
    removeNoOutline(e) {
      const select = e.target;
      select.classList.remove("no-outline");
    },
  },
  watch: {
    getImportModalOpen(open) {
      if (open) {
        this.openModal();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.import-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  .content-line {
    display: flex;
    // justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }
  textarea {
    border: 0.1rem solid #dbd9d7;
    border-radius: 5px;
    font-family: "Roboto Mono", monospace;
    width: 40vw;
    max-width: 100%;
    resize: none;
    height: 30vh;
    padding: 0.5rem;
    font-size: 0.85rem;
    color: black;
    &.no-outline {
      outline: none !important;
    }
    @media (max-width: 50rem) {
      width: 80vw;
    }
  }
  .submit-line {
    display: flex;
    justify-content: center;
    gap: 1.25rem;
    button {
      font-weight: 500;
      min-width: max-content;
      width: 20%;
      padding: 0.75rem;
      cursor: pointer;
      border-radius: 5px;
      border: 1px solid rgba(27, 31, 36, 0.1);
      box-shadow: 0 1px 0 rgba(27, 31, 36, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
      font-size: calc(0.9 * var(--modal-content-font-size));
    }
    .clear-btn {
      color: #24292f;
      background-color: #f6f8fa;
      &:hover {
        background-color: #eaeef2;
      }
    }
    .submit-btn {
      color: white;
      // background-color: #2da44e;
      background-color: #388fe7;
      &:hover {
        // background-color: #289445;
        background-color: #3382d1;
      }
    }
  }
}
</style>