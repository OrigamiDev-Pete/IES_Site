<template>
  <v-container>
    <v-card :title="`Timer ${timer.number}`">

      <div class="d-flex justify-center">
        <canvas :id="`timer${timer.number}`" width="455" height="350" class="pa-2"></canvas>
      </div>

      <v-tabs v-model="tab">
        <v-tab value="options">Options</v-tab>
        <v-tab value="registers">Registers</v-tab>
      </v-tabs>
      <v-window v-model="tab">
        <v-window-item value="options">
          <v-container>
            <v-sheet rounded elevation="12" class="mb-4">
              <div class="d-flex ms-4 align-center" style="height: 62px">
                <h3 style="width: 110px">TCT: {{ Math.round(timer.TCT) }}
                  <v-tooltip activator="parent" location="bottom">Timer Counter</v-tooltip>
                </h3>
                <v-divider vertical class="ml-4 mr-4"/>
                <h3 class="mr-5">OVF: {{ timer.OVF }}
                  <v-tooltip activator="parent" location="bottom">Overflow Flag</v-tooltip>
                </h3>
              </div>
            </v-sheet>
            <!-- Mode -->
            <v-sheet rounded elevation="12" class="mb-4">
              <div class="d-flex ms-5 align-center">
                <h3 class="mr-0">Mode: </h3>
                <v-select class="ms-4" density="compact" style="top:10px; flex-grow: 0" :items="timer.modes"
                          v-model="timer.mode" @update:model-value="timer.setBits()"></v-select>
              </div>
            </v-sheet>
            <!-- OCR Registers -->
            <v-sheet v-if="timer.mode !== TimerMode.Normal" rounded elevation="12" class="mb-4">
              <div class="d-flex ms-5 align-center">
                <div class="d-flex align-center" style="flex-grow: 0.1">
                  <h3 class="mr-0">OCR{{ timer.number }}A: </h3>
                  <v-text-field type="number" class="ml-4 w-50" density="compact" style="top: 10px" v-model="timer.OCRnA" />
                </div>

                <div v-if="timer.mode === TimerMode.FastPWM || timer.mode === TimerMode.PhaseCorrectPWMMax || timer.mode === TimerMode.PhaseCorrectPWMTop" >
                  <div class="d-flex ml-5 align-center" style="flex-grow: 0.1">
                    <v-divider vertical class="mr-3"/>
                    <h3 class="mr-0">OCR{{ timer.number }}B: </h3>
                    <v-text-field type="number" class="ml-4 w-25" density="compact" style="top: 10px" v-model="timer.OCRnB"/>
                    <v-divider vertical class="ml-4 mr-3"/>
                    <h3 class="mr-0">Pulse Width | Duty Cycle =
                      {{ ((this.timer.OCRnB / this.timer.OCRnA) * 100).toFixed(2) }}</h3>
                  </div>
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
              </div>
            </v-sheet>
          </v-container>
        </v-window-item>
        <v-window-item value="registers">
          <v-container>
            <Register :title="`TCCR${timer.number}A`">
              <v-divider vertical></v-divider>
              <Bit v-for="(bit, i) in timer.registers.TCCRnA.names" :title="bit"
                   :value="timer.registers.TCCRnA.values[i]"
                   @bit-toggled="() => { timer.registers.TCCRnA.values[i] ^= 1; timer.parseRegisters() }"></Bit>
            </Register>
            <Register :title="`TCCR${timer.number}B`">
              <v-divider vertical></v-divider>
              <Bit v-for="(bit, i) in timer.registers.TCCRnB.names" :title="bit"
                   :value="timer.registers.TCCRnB.values[i]"
                   @bit-toggled="() => { timer.registers.TCCRnB.values[i] ^= 1; timer.parseRegisters() }"></Bit>
            </Register>
            <Register v-if="timer.number === '1'" :title="`TCCR${timer.number}C`">
              <v-divider vertical></v-divider>
              <Bit v-for="(bit, i) in timer.registers.TCCRnC.names" :title="bit"
                   :value="timer.registers.TCCRnC.values[i]"
                   @bit-toggled="() => { timer.registers.TCCRnC.values[i] ^= 1; timer.parseRegisters() }"></Bit>
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
    }
  },

  mounted() {
    this.draw();
  },

  methods: {
    draw() {
      const drawOCRnx = (register, value) => {
        const a = (255 / this.timer.MAX) * (value);
        ctx.fillText(`${register} = ${value}`, 280, a + (296 - a * 2));

        ctx.setLineDash([5, 5])
        const OCRnALine = a + (316 - a * 2);
        ctx.beginPath();
        ctx.moveTo(0, OCRnALine);
        ctx.lineTo(276, OCRnALine);
        ctx.stroke();
        ctx.setLineDash([])
      }

      const canvas = this.$el.querySelector(`#timer${this.timer.number}`)
      const ctx = canvas.getContext('2d');

      ctx.clearRect(0, 0, 455, 350)

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
      ctx.stroke()
      ctx.closePath();

      ctx.lineWidth = 1;
      if (this.timer.mode !== TimerMode.PhaseCorrectPWMMax && this.timer.mode !== TimerMode.PhaseCorrectPWMTop) {
        ctx.beginPath();
        ctx.moveTo(10, 316);
        ctx.lineTo(266, 60);
        ctx.stroke();
        ctx.closePath();
      } else {
        ctx.beginPath();
        ctx.moveTo(10, 316);
        ctx.lineTo(133, 60);
        ctx.lineTo(266, 316);
        ctx.stroke();
        ctx.closePath();
      }

      let TOP = this.timer.MAX;
      if (this.timer.mode === TimerMode.CTC || this.timer.mode === TimerMode.FastPWM)
        TOP = Number(this.timer.OCRnA);

      const t = (255 / TOP) * (this.timer.TCT);
      const TCTLine = t + (316 - t * 2);
      ctx.beginPath();
      ctx.moveTo(0, TCTLine);
      ctx.lineTo(266, TCTLine);
      ctx.stroke();

      ctx.fillText(`TCT = ${Math.round(this.timer.TCT)}`, 0, TCTLine - 20)

      ctx.textBaseline = 'hanging';
      if (this.timer.mode === TimerMode.Normal) {
        ctx.fillText(`MAX = ${this.timer.MAX}`, 160, 30);
        ctx.fillText("BOTTOM = 0", 140, 326);
      } else if (this.timer.mode === TimerMode.CTC) {
        ctx.fillText(`TOP = ${this.timer.OCRnA} = OCR${this.timer.number}A`, 160, 30);
        ctx.fillText("BOTTOM = 0", 140, 326);
      } else if (this.timer.mode === TimerMode.FastPWM || this.timer.mode === TimerMode.PhaseCorrectPWMMax) {
        ctx.fillText(`TOP = ${this.timer.OCRnA} = OCR${this.timer.number}A`, 160, 30);
        ctx.fillText("BOTTOM = 0", 140, 326);
        // drawOCRnx(`OCR${this.timer.number}A`, this.timer.OCRnA);
        drawOCRnx(`OCR${this.timer.number}B`, this.timer.OCRnB);

        // Draw Pulse
        const pulseWidth = Math.min(Math.max((this.timer.OCRnB / TOP) * 100, 0), 100);
        ctx.beginPath();
        ctx.moveTo(0, 50);
        ctx.lineTo(0, 0);
        ctx.lineTo(pulseWidth, 0);
        ctx.lineTo(pulseWidth, 50);
        ctx.lineTo(100, 50);
        ctx.stroke();
        ctx.closePath();
      } else if (this.timer.mode === TimerMode.PhaseCorrectPWMTop) {
        ctx.fillText(`MAX = ${this.timer.MAX}`, 160, 30);
        ctx.fillText("BOTTOM = 0", 140, 326);
        drawOCRnx(`OCR${this.timer.number}A`, this.timer.OCRnA);
        drawOCRnx(`OCR${this.timer.number}B`, this.timer.OCRnB);
      }

      const rate = 20;
      if (this.timer.prescaler !== 0) {
        if (this.timer.TCT > TOP + 1) {
          this.timer.TCT = 0;
          this.timer.OVF ^= 1;
        } else {
          this.timer.TCT = this.timer.TCT + rate / this.timer.prescaler;
        }
      }

      requestAnimationFrame(this.draw)

    },
  }
}


</script>

<style scoped>
* {
  /*font-family: "Roboto", sans-serif;*/
}

@media (max-width: 800px) {
  canvas {
    width: 75%;
    height: 75%;
  }

  * {
    font-size: 0.7rem;
  }
}

</style>