<template>
  <ChessGame :analysisMode="true" />
  <AnalysisModal />
  <ImportModal />
</template>

<script>
import ChessGame from "../components/ChessGame.vue";
import AnalysisModal from "../components/AnalysisModal.vue";
import ImportModal from "../components/ImportModal.vue";

export default {
  components: {
    ChessGame,
    AnalysisModal,
    ImportModal,
  },
};
</script>

<style>
</style>