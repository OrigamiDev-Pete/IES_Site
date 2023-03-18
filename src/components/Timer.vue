<template>
  <v-container>
    <v-card :title="`Timer ${timer}`">

      <div class="d-flex justify-center">
        <canvas :id="`timer${timer}`" width="400" height="350"></canvas>
      </div>

      <v-container>
        <v-sheet rounded elevation="12" class="mb-4 pa-3">
          <div class="d-flex ms-5 align-center">
            <h3 class="mr-5">TCT: {{Math.round(TCT)}} - Timer Counter</h3>
          </div>
        </v-sheet>
        <v-sheet rounded elevation="12" class="mb-4">
          <div class="d-flex ms-5 align-center">
            <h3 class="mr-0">Mode: </h3>
            <v-select class="ms-4" density="compact" style="top:10px; flex-grow: 0" :items="modes" v-model="mode"></v-select>
            <h3 class="mr-5 ml-5"> TCCR0A </h3>
          </div>
        </v-sheet>
        <v-sheet rounded elevation="12">
          <div class="d-flex ms-5 align-center">
            <h3 class="mr-0">Prescaler: </h3>
            <v-select class="ms-4" density="compact" style="width: 100px; top:10px; flex-grow: 0" :items="prescalerValues" v-model="prescaler"></v-select>
            <h3 class="mr-5 ml-5"> TCCR0A </h3>
          </div>
        </v-sheet>
      </v-container>

    </v-card>
  </v-container>

</template>

<script>
export default {
  name: "Timer",
  props: ['timer'],

  data: () => {
    return {
      TCT: 0,
      MAX: 255,
      TOP: 255,
      prescalerValues: [0, 1, 8, 32, 256, 1204],
      prescaler: 0,
      mode: 'Normal',
      modes: ['Normal', 'CTC', 'Fast  PWM', 'Phase Correct PWM'],
    }
  },

  mounted() {
    this.draw();
  },

  methods: {
    draw() {
      const canvas = this.$el.querySelector(`#timer${this.timer}`)
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
      const TCTLine = this.TCT + (316 - this.TCT * 2)
      ctx.beginPath();
      ctx.moveTo(0, TCTLine);
      ctx.lineTo(266, TCTLine);
      ctx.stroke();

      ctx.fillText(`TCT = ${Math.round(this.TCT)}`, 0, TCTLine - 20)

      ctx.textBaseline = 'hanging';
      if (this.mode === 'Normal')
        ctx.fillText(`MAX = ${this.MAX}`, 280, 30);
      else if (this.mode === 'CTC')
        ctx.fillText(`TOP = ${this.TOP}`, 280, 30);
      ctx.fillText("BOTTOM = 0",280, 316);

      const rate = 20
      if (this.prescaler !== 0)
        this.TCT = this.TCT > 256 ? 0 : this.TCT + rate / this.prescaler;

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