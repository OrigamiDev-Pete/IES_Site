<script setup>
import Timer from "@/components/Timer.vue";
</script>

<template>
  <div class="switch-row">
    <v-switch v-model="timer0Active" class="switch" inset color="secondary" label="Timer 0"></v-switch>
    <v-switch v-model="timer1Active" class="switch" inset color="secondary" label="Timer 1"></v-switch>
    <v-switch v-model="timer2Active" class="switch" inset color="secondary" label="Timer 2"></v-switch>
  </div>
  <div class="d-flex flex-wrap">
    <Timer v-if="timer0Active" :timer="timer0" style="flex: 1 0 0"></Timer>
    <Timer v-if="timer1Active" :timer="timer1" style="flex: 1 0 0"></Timer>
    <Timer v-if="timer2Active" :timer="timer2" style="flex: 1 0 0"></Timer>
  </div>
</template>

<script>
import TimerModel from "@/timer";

export default {
  name: "TimerPage",

  data() {
    return {
      timer0Active: true,
      timer1Active: false,
      timer2Active: false,

      timer0: new TimerModel('0'),
      timer1: new TimerModel('1'),
      timer2: new TimerModel('2'),
    }
  },

  methods: {
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