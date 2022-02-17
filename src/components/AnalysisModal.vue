<template>
  <Modal id="analysis" @closed-modal-analysis="setModalClose" ref="modal">
    <template v-slot:modalHeading>Analysis settings</template>
    <template v-slot:modalContent>
      <div class="analysis-content">
        <div class="content-line">
          <div>Chess engine</div>
          <Toggle
            id="engine"
            :value="engineOn"
            @change-input-toggle-engine="changeEngine"
          />
        </div>
        <div class="content-line" :class="{ 'disable-line': !engineOn }">
          <div>Style</div>
          <Dropdown
            id="style"
            :disable="!engineOn"
            :options="styleOptions"
            :selectedValue="styleVal"
            @change-dropdown-style="changeStyle"
          />
          <!-- <div style="width: 60%">
            <Slider :disable="!engineOn" :range="styleRange" />
          </div> -->
        </div>
        <div class="content-line" :class="{ 'disable-line': !engineOn }">
          <div>Depth</div>
          <Dropdown
            id="depth"
            :disable="!engineOn"
            :options="depthOptions"
            :selectedValue="depthVal"
            @change-dropdown-depth="changeDepth"
          />
        </div>
        <div class="content-line" :class="{ 'disable-line': !engineOn }">
          <div>Lines</div>
          <Dropdown
            id="lines"
            :disable="!engineOn"
            :options="lineOptions"
            :selectedValue="pvVal"
            @change-dropdown-lines="changeLines"
          />
        </div>
        <div class="content-line" :class="{ 'disable-line': !engineOn }">
          <div>Suggestions</div>
          <Toggle
            id="suggestions"
            :disable="!engineOn"
            :value="suggestionsOn"
            @change-input-toggle-suggestions="changeSuggestions"
          />
        </div>
      </div>
    </template>
  </Modal>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

import Modal from "./common/Modal.vue";
import Toggle from "./common/Toggle.vue";
import Slider from "./common/Slider.vue";
import Dropdown from "./common/Dropdown.vue";

export default {
  components: { Modal, Toggle, Slider, Dropdown },
  data() {
    return {
      styleOptions: [
        { name: "Very solid", value: -100 },
        { name: "Solid", value: -50 },
        { name: "Neutral (default)", value: 0 },
        { name: "Aggressive", value: 50 },
        { name: "Very aggressive", value: 100 },
      ],
      depthOptions: [
        { value: 14 },
        { value: 16 },
        { name: "18 (default)", value: 18 },
        { value: 20 },
        { value: 22 },
      ],
      lineOptions: [
        { name: "1 (default)", value: 1 },
        { value: 2 },
        { value: 3 },
      ],
    };
  },
  computed: {
    ...mapGetters({
      getAnalysisModalOpen: "analysisSettings/getAnalysisModalOpen",
      engineOn: "analysisSettings/getEngineOn",
      styleVal: "engine/getEngineContempt",
      depthVal: "engine/getEngineDepth",
      pvVal: "engine/getMultiPv",
      suggestionsOn: "analysisSettings/getSuggestionsOn",
    }),
  },
  methods: {
    ...mapMutations({
      setEngineOn: "analysisSettings/setEngineOn",
      setAnalysisModalOpen: "analysisSettings/setAnalysisModalOpen",
      setEngineContempt: "engine/setEngineContempt",
      setEngineDepth: "engine/setEngineDepth",
      setMultiPv: "engine/setMultiPv",
      setSuggestionsOn: "analysisSettings/setSuggestionsOn",
    }),
    openModal() {
      this.$refs.modal.openModal();
      this.$nextTick(() => {
        document.getElementById("modal-analysis").focus();
      });
    },
    setModalClose() {
      this.setAnalysisModalOpen(false);
    },
    changeEngine(val) {
      if (!val) {
        this.changeSuggestions(val);
      }
      this.setEngineOn(val);
    },
    changeStyle(val) {
      this.setEngineContempt(val);
    },
    changeDepth(val) {
      this.setEngineDepth(val);
    },
    changeLines(val) {
      this.setMultiPv(val);
    },
    changeSuggestions(val) {
      this.setSuggestionsOn(val);
    },
  },
  watch: {
    getAnalysisModalOpen(open) {
      if (open) {
        this.openModal();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.analysis-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-height: 100%;
  .content-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &.disable-line {
      color: grey;
    }
  }
}
</style>