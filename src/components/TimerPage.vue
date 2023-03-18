<script setup>
import Timer from "@/components/Timer.vue";
</script>

<template>
  <div class="switch-row">
    <v-switch v-model="timer0Active" class="switch" inset color="secondary" label="Timer 0"></v-switch>
    <v-switch v-model="timer1Active" class="switch" inset color="secondary" label="Timer 1"></v-switch>
    <v-switch v-model="timer2Active" class="switch" inset color="secondary" label="Timer 2"></v-switch>
  </div>
  <div class="d-flex">
    <Timer v-if="timer0Active" timer="0"></Timer>
    <Timer v-if="timer1Active" timer="1"></Timer>
    <Timer v-if="timer2Active" timer="2"></Timer>
  </div>
</template>

<script>
export default {
  name: "TimerPage",

  data() {
    return {
      timer0Active: true,
      timer1Active: false,
      timer2Active: false,
    }
  },

  methods: {
    onSwitch() {
      console.log(this.timer0Active)
    }
  }
}
</script>

<style scoped>
.switch-row {
  display: flex;
}

.switch {
  flex-grow: 0;
  margin-right: 1rem
}

</style>