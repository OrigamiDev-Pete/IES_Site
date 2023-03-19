<template>
  <v-container>
    <v-card :title="`Timer ${timer.number}`">

      <div class="d-flex justify-center">
        <canvas :id="`timer${timer.number}`" width="400" height="350"></canvas>
      </div>

      <v-tabs v-model="tab">
        <v-tab value="options">Options</v-tab>
        <v-tab value="registers">Registers</v-tab>
      </v-tabs>
      <v-window v-model="tab">
        <v-window-item value="options">
          <v-container>
            <v-sheet rounded elevation="12" class="mb-4 pa-3">
              <div class="d-flex ms-2 align-center">
                <h3 class="mr-5">TCT: {{ Math.round(timer.TCT) }} - Timer Counter</h3>
              </div>
            </v-sheet>
            <!-- Mode -->
            <v-sheet rounded elevation="12" class="mb-4">
              <div class="d-flex ms-5 align-center">
                <h3 class="mr-0">Mode: </h3>
                <v-select class="ms-4" density="compact" style="top:10px; flex-grow: 0" :items="modes"
                          v-model="timer.mode"></v-select>
                <div v-if="timer.mode !== TimerMode.Normal" class="d-flex align-self-stretch align-center ml-4">
                  <v-divider vertical class="mr-3"/>
                  <h3 class="mr-0">OCR{{timer.number}}A:</h3>
                  <v-text-field class="ml-4" density="compact" style="top: 10px" v-model="timer.OCRnA"/>
                </div>
              </div>
            </v-sheet>
            <!-- Prescaler -->
            <v-sheet rounded elevation="12">
              <div class="d-flex ms-5 align-center">
                <h3 class="mr-0">Prescaler: </h3>
                <v-select class="ms-4" density="compact" style="width: 100px; top:10px; flex-grow: 0"
                          :items="timer.prescalerValues" v-model="timer.prescaler"
                          @update:model-value="timer.setPrescalerBits()"></v-select>
                <h3 class="mr-5 ml-5"> TCCR{{ timer.number }}B - [ CS{{ timer.number }}2 | CS{{ timer.number }}1 |
                  CS{{ timer.number }}0 ]</h3>
              </div>
            </v-sheet>
          </v-container>
        </v-window-item>
        <v-window-item value="registers">
          <v-container>
            <Register :title="`TCCR${timer.number}A`">
              <v-divider vertical></v-divider>
              <Bit v-for="(bit, i) in timer.registers.TCCRnA.names" :title="bit"
                   :value="timer.registers.TCCRnA.values[i]" bit-index="i"
                    @bit-toggled="() => { timer.registers.TCCRnA.values[i] ^= 1 }"></Bit>
            </Register>
            <Register :title="`TCCR${timer.number}B`">
              <v-divider vertical></v-divider>
              <Bit v-for="(bit, i) in timer.registers.TCCRnB.names" :title="bit"
                   :value="timer.registers.TCCRnB.values[i]" :bit-index="i"></Bit>
            </Register>
            <Register v-if="timer.number === '1'" :title="`TCCR${timer.number}C`">
              <v-divider vertical></v-divider>
              <Bit v-for="(bit, i) in timer.registers.TCCRnC.names" :title="bit"
                   :value="timer.registers.TCCRnC.values[i]" :bitIndex="i"></Bit>
            </Register>
          </v-container>
        </v-window-item>
      </v-window>
    </v-card>
  </v-container>

</template>

<script>
import Register from "@/components/Register.vue";
import Bit from "@/components/Bit.vue";
import {TimerMode} from "@/timer";

export default {
  name: "Timer",
  components: {Bit, Register},
  props: ['timer', 'registers', 't'],

  computed: {
    TimerMode() {
      return TimerMode
    },
    console: () => console,
  },

  data: () => {
    return {
      tab: {},
      // modes: ['Normal', 'CTC', 'Fast  PWM', 'Phase Correct PWM'],
      modes: [TimerMode.Normal, TimerMode.CTC, TimerMode.FastPWM, TimerMode.PhaseCorrectPWM]
    }
  },

  mounted() {
    this.draw();
  },

  methods: {
    draw() {
      const canvas = this.$el.querySelector(`#timer${this.timer.number}`)
      const ctx = canvas.getContext('2d');

      ctx.clearRect(0, 0, 400, 350)

      ctx.font = '20px Roboto'
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.lineCap = "round";

      // Draw Graph
      ctx.beginPath();
      ctx.moveTo(10, 316);
      ctx.lineTo(266, 316);
      ctx.lineTo(266, 60);
      ctx.lineTo(10, 316);
      ctx.stroke()
      ctx.closePath();

      ctx.lineWidth = 1;
      const t = (255 / this.timer.MAX) * (this.timer.TCT)
      const TCTLine = t + (316 - t * 2);
      ctx.beginPath();
      ctx.moveTo(0, TCTLine);
      ctx.lineTo(266, TCTLine);
      ctx.stroke();

      ctx.fillText(`TCT = ${Math.round(this.timer.TCT)}`, 0, TCTLine - 20)

      ctx.textBaseline = 'hanging';
      if (this.timer.mode === TimerMode.Normal)
        ctx.fillText(`MAX = ${this.timer.MAX}`, 280, 30);
      else if (this.timer.mode === TimerMode.CTC)
        ctx.fillText(`TOP = ${this.timer.TOP}`, 280, 30);
      ctx.fillText("BOTTOM = 0", 280, 316);

      const rate = 20
      if (this.timer.prescaler !== 0)
        this.timer.TCT = this.timer.TCT > this.timer.MAX+1 ? 0 : this.timer.TCT + rate / this.timer.prescaler;

      requestAnimationFrame(this.draw)
    }
  }
}


</script>

<style scoped>
* {
  /*font-family: "Roboto", sans-serif;*/
}

</style>