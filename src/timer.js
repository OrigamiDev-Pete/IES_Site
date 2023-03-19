export default class TimerModel {
    number = "";
    TCT = 0;
    OVF = 0;
    MAX = 255;
    OCRnA = 255;
    OCRnB = 0;
    registers = {};
    prescalerValues = [0, 1, 8, 64, 256, 1024];
    prescaler = 0;
    /**
     * @type {TimerMode}
     */
    mode = TimerMode.Normal;
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
                switch (this.mode) {
                    case TimerMode.Normal:
                        break;
                    case TimerMode.CTC:
                        break;
                    case TimerMode.FastPWM:
                        break;
                    case TimerMode.PhaseCorrectPWM:
                        break;
                }
                break;
            case '1':
                switch (this.mode) {
                    case TimerMode.Normal:
                        break;
                    case TimerMode.CTC:
                        break;
                    case TimerMode.FastPWM:
                        break;
                    case TimerMode.PhaseCorrectPWM:
                        break;
                }
                break;
            case '2':
                switch (this.mode) {
                    case TimerMode.Normal:
                        break;
                    case TimerMode.CTC:
                        break;
                    case TimerMode.FastPWM:
                        break;
                    case TimerMode.PhaseCorrectPWM:
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
}

export const TimerMode = {
    Normal: 'Normal',
    CTC: 'CTC',
    FastPWM: 'Fast PWM',
    PhaseCorrectPWM: 'Phase Correct PWM',
}