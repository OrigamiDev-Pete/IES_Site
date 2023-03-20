import register from "@/components/Register.vue";

export default class TimerModel {
    number = "";
    TCT = 0;
    OVF = 0;
    MAX = 255;
    _OCRnA = 255;
    _OCRnB = 0;
    registers = {};
    prescalerValues = [0, 1, 8, 64, 256, 1024];
    prescaler = 0;
    /**
     * @type {TimerMode}
     */
    mode = TimerMode.Normal;
    modes = [TimerMode.Normal, TimerMode.CTC, TimerMode.FastPWM, TimerMode.PhaseCorrectPWMMax, TimerMode.PhaseCorrectPWMTop];

    get OCRnA() {
        return this._OCRnA
    }

    set OCRnA(value) {
        this._OCRnA = Math.min(Math.max(value, 0), this.MAX);
        this.TCT = 0;
    }

    get OCRnB() {
        return this._OCRnB
    }

    set OCRnB(value) {
        this._OCRnB = Math.min(Math.max(value, 0), this.MAX);
        this.TCT = 0;
    }

    constructor(number) {
        this.number = number;

        switch (number) {
            case '0':
                this.registers = {
                    TCCRnA: {
                        names: ['COM0A1', 'COM0A0', 'COM0B1', 'COM0B0', '-', '-', 'WGM01', 'WGM00'],
                        values: [0, 0, 0, 0, 0, 0, 0, 0]
                    },
                    TCCRnB: {
                        names: ['FOC0A', 'FOC0B', '-', '-', 'WGM02', 'CS02', 'CS01', 'CS00'],
                        values: [0, 0, 0, 0, 0, 0, 0, 0]
                    },
                }
                break;
            case '1':
                this.registers = {
                    TCCRnA: {
                        names: ['COM1A1', 'COM1A0', 'COM1B1', 'COM1B0', '-', '-', 'WGM11', 'WGM10'],
                        values: [0, 0, 0, 0, 0, 0, 0, 0]
                    },
                    TCCRnB: {
                        names: ['ICNC1', 'ICES1', '-', 'WGM13', 'WGM12', 'CS12', 'CS11', 'CS10'],
                        values: [0, 0, 0, 0, 0, 0, 0, 0]
                    },
                    TCCRnC: {names: ['FOC1A', 'FOC1B', '-', '-', '-', '-', '-', '-'], values: [0, 0, 0, 0, 0, 0, 0, 0]}
                }
                this.modes = [TimerMode.Normal, TimerMode.CTC, TimerMode.FastPWM, TimerMode.PhaseCorrectPWMTop];
                this.MAX = 65535;
                this.OCRnA = this.MAX;
                break;
            case '2':
                this.registers = {
                    TCCRnA: {
                        names: ['COM2A1', 'COM2A0', 'COM2B1', 'COM2B0', '-', '-', 'WGM21', 'WGM20'],
                        values: [0, 0, 0, 0, 0, 0, 0, 0]
                    },
                    TCCRnB: {
                        names: ['FOC2A', 'FOC2B', '-', '-', 'WGM22', 'CS22', 'CS21', 'CS20'],
                        values: [0, 0, 0, 0, 0, 0, 0, 0]
                    }
                }
                this.prescalerValues = [0, 1, 8, 16, 32, 64, 256, 1024];
                break;
        }
    }

    setBits() {
        switch (this.number) {
            case '0':
            case '2':
                switch (this.mode) {
                    case TimerMode.Normal:
                        this.registers.TCCRnA.values[7] = 0;
                        this.registers.TCCRnA.values[6] = 0;
                        this.registers.TCCRnB.values[4] = 0;
                        break;
                    case TimerMode.CTC:
                        this.registers.TCCRnA.values[7] = 0;
                        this.registers.TCCRnA.values[6] = 1;
                        this.registers.TCCRnB.values[4] = 0;
                        break;
                    case TimerMode.FastPWM:
                        this.registers.TCCRnA.values[7] = 1;
                        this.registers.TCCRnA.values[6] = 1;
                        this.registers.TCCRnB.values[4] = 1;
                        break;
                    case TimerMode.PhaseCorrectPWMMax:
                        this.registers.TCCRnA.values[7] = 1;
                        this.registers.TCCRnA.values[6] = 0;
                        this.registers.TCCRnB.values[4] = 0;
                        break;
                    case TimerMode.PhaseCorrectPWMTop:
                        this.registers.TCCRnA.values[7] = 1;
                        this.registers.TCCRnA.values[6] = 0;
                        this.registers.TCCRnB.values[4] = 1;
                        break;
                }
                break;
            case '1':
                switch (this.mode) {
                    case TimerMode.Normal:
                        this.registers.TCCRnA.values[7] = 0;
                        this.registers.TCCRnA.values[6] = 0;
                        this.registers.TCCRnB.values[4] = 0;
                        this.registers.TCCRnB.values[3] = 0;
                        break;
                    case TimerMode.CTC:
                        this.registers.TCCRnA.values[7] = 0;
                        this.registers.TCCRnA.values[6] = 0;
                        this.registers.TCCRnB.values[4] = 1;
                        this.registers.TCCRnB.values[3] = 0;
                        break;
                    case TimerMode.FastPWM:
                        this.registers.TCCRnA.values[7] = 1;
                        this.registers.TCCRnA.values[6] = 1;
                        this.registers.TCCRnB.values[4] = 1;
                        this.registers.TCCRnB.values[3] = 1;
                        break;
                    case TimerMode.PhaseCorrectPWMTop:
                        this.registers.TCCRnA.values[7] = 1;
                        this.registers.TCCRnA.values[6] = 1;
                        this.registers.TCCRnB.values[4] = 0;
                        this.registers.TCCRnB.values[3] = 1;
                        break;
                }
                break;
        }

        this.setPrescalerBits();
    }

    setPrescalerBits() {
        switch (this.number) {
            case '0':
            case '1':
                switch (this.prescaler) {
                    case 0:
                        this.registers.TCCRnB.values[7] = 0;
                        this.registers.TCCRnB.values[6] = 0;
                        this.registers.TCCRnB.values[5] = 0;
                        break;
                    case 1:
                        this.registers.TCCRnB.values[7] = 1;
                        this.registers.TCCRnB.values[6] = 0;
                        this.registers.TCCRnB.values[5] = 0;
                        break;
                    case 8:
                        this.registers.TCCRnB.values[7] = 0;
                        this.registers.TCCRnB.values[6] = 1;
                        this.registers.TCCRnB.values[5] = 0;
                        break;
                    case 64:
                        this.registers.TCCRnB.values[7] = 1;
                        this.registers.TCCRnB.values[6] = 1;
                        this.registers.TCCRnB.values[5] = 0;
                        break;
                    case 256:
                        this.registers.TCCRnB.values[7] = 0;
                        this.registers.TCCRnB.values[6] = 0;
                        this.registers.TCCRnB.values[5] = 1;
                        break;
                    case 1024:
                        this.registers.TCCRnB.values[7] = 1;
                        this.registers.TCCRnB.values[6] = 0;
                        this.registers.TCCRnB.values[5] = 1;
                        break;
                    default:
                        console.log('Invalid Prescaler')
                        break;
                }
                break;
            case '2':
                switch (this.prescaler) {
                    case 0:
                        this.registers.TCCRnB.values[7] = 0;
                        this.registers.TCCRnB.values[6] = 0;
                        this.registers.TCCRnB.values[5] = 0;
                        break;
                    case 1:
                        this.registers.TCCRnB.values[7] = 1;
                        this.registers.TCCRnB.values[6] = 0;
                        this.registers.TCCRnB.values[5] = 0;
                        break;
                    case 8:
                        this.registers.TCCRnB.values[7] = 0;
                        this.registers.TCCRnB.values[6] = 1;
                        this.registers.TCCRnB.values[5] = 0;
                        break;
                    case 32:
                        this.registers.TCCRnB.values[7] = 1;
                        this.registers.TCCRnB.values[6] = 1;
                        this.registers.TCCRnB.values[5] = 0;
                        break;
                    case 64:
                        this.registers.TCCRnB.values[7] = 0;
                        this.registers.TCCRnB.values[6] = 0;
                        this.registers.TCCRnB.values[5] = 1;
                        break;
                    case 128:
                        this.registers.TCCRnB.values[7] = 1;
                        this.registers.TCCRnB.values[6] = 0;
                        this.registers.TCCRnB.values[5] = 1;
                        break;
                    case 256:
                        this.registers.TCCRnB.values[7] = 0;
                        this.registers.TCCRnB.values[6] = 1;
                        this.registers.TCCRnB.values[5] = 1;
                        break;
                    case 1024:
                        this.registers.TCCRnB.values[7] = 1;
                        this.registers.TCCRnB.values[6] = 1;
                        this.registers.TCCRnB.values[5] = 1;
                        break;
                    default:
                        console.log('Invalid Prescaler')
                        break;
                }
                break;
            default:
                console.log('Invalid timer number');
                break;
        }
    }

    parseRegisters() {
        const ta = this.registers.TCCRnA.values;
        const tb = this.registers.TCCRnB.values;

        switch (this.number) {
            case "0":
            case "2":
                if (ta[7] === 0 && ta[6] === 0 && tb[4] === 0) {
                    this.mode = TimerMode.Normal;
                } else if (ta[7] === 0 && ta[6] === 0 && tb[4] === 0) {
                    this.mode = TimerMode.CTC;
                } else if (ta[7] === 1 && ta[6] === 1 && tb[4] === 1) {
                    this.mode = TimerMode.FastPWM;
                } else if (ta[7] === 1 && ta[6] === 0 && tb[4] === 0) {
                    this.mode = TimerMode.PhaseCorrectPWMMax;
                } else if (ta[7] === 0 && ta[6] === 1 && tb[4] === 1) {
                    this.mode = TimerMode.PhaseCorrectPWMTop;
                }

                break;
            case "1":
                if (ta[7] === 0 && ta[6] === 0 && tb[4] === 0 && tb[3] === 0) {
                    this.mode = TimerMode.Normal;
                } else if (ta[7] === 0 && ta[6] === 0 && tb[4] === 1 && tb[3] === 0) {
                    this.mode = TimerMode.CTC;
                } else if (ta[7] === 1 && ta[6] === 1 && tb[4] === 1 && tb[3] === 1) {
                    this.mode = TimerMode.FastPWM;
                } else if (ta[7] === 1 && ta[6] === 1 && tb[4] === 0 && tb[3] === 1) {
                    this.mode = TimerMode.PhaseCorrectPWMTop;
                }
                break;
        }

        switch (this.number) {
            case "0":
            case "1":
                if (tb[7] === 0 && tb[6] === 0 && tb[5] === 0) {
                    this.prescaler = 0;
                } else if (tb[7] === 1 && tb[6] === 0 && tb[5] === 0) {
                    this.prescaler = 1;
                } else if (tb[7] === 0 && tb[6] === 1 && tb[5] === 0) {
                    this.prescaler = 8;
                } else if (tb[7] === 1 && tb[6] === 1 && tb[5] === 0) {
                    this.prescaler = 64;
                } else if (tb[7] === 0 && tb[6] === 0 && tb[5] === 1) {
                    this.prescaler = 256;
                } else if (tb[7] === 1 && tb[6] === 0 && tb[5] === 1) {
                    this.prescaler = 1024;
                }
                break;
            case "2":
                if (tb[7] === 0 && tb[6] === 0 && tb[5] === 0) {
                    this.prescaler = 0;
                } else if (tb[7] === 1 && tb[6] === 0 && tb[5] === 0) {
                    this.prescaler = 1;
                } else if (tb[7] === 0 && tb[6] === 1 && tb[5] === 0) {
                    this.prescaler = 8;
                } else if (tb[7] === 1 && tb[6] === 1 && tb[5] === 0) {
                    this.prescaler = 32;
                } else if (tb[7] === 0 && tb[6] === 0 && tb[5] === 1) {
                    this.prescaler = 64;
                } else if (tb[7] === 1 && tb[6] === 0 && tb[5] === 1) {
                    this.prescaler = 128;
                } else if (tb[7] === 0 && tb[6] === 1 && tb[5] === 1) {
                    this.prescaler = 256;
                } else if (tb[7] === 1 && tb[6] === 1 && tb[5] === 1) {
                    this.prescaler = 1024;
                }
        }

    }
}

export const TimerMode = {
    Normal: 'Normal',
    CTC: 'CTC',
    FastPWM: 'Fast PWM',
    PhaseCorrectPWMMax: 'Phase Correct PWM (MAX)',
    PhaseCorrectPWMTop: 'Phase Correct PWM (TOP)',
}