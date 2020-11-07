import Renderer from './renderer.js';
import Keyboard from './Keyboard.js';
import Speaker from './speaker.js';
import disassembler from './disassembler.js';
import INSTRUCTION_SET from './instructionSet.js';
import { updateMemory, updateRegisters } from './information.js';

let opcodeArray = [];

class CPU {
    constructor(renderer, keyboard, speaker) {
        this.renderer = renderer;
        this.keyboard = keyboard;
        this.speaker = speaker;

        this.memory = new Uint8Array(4096);
        this.registers = new Uint8Array(16);
        this.stack = new Array();
        this.PC = 0x200;
        this.I = 0;
        this.DT = 0;
        this.ST = 0;
        this.paused = false;
        this.speed = 30;

        this._loadSpritesIntoMemory();
    }

    _reset() {
        this.memory = new Uint8Array(4096);
        this.registers = new Uint8Array(16);
        this.stack = new Array();
        this.PC = 0x200;
        this.I = 0;
        this.DT = 0;
        this.ST = 0;
        this.paused = false;
        this.speed = 10;

        this._loadSpritesIntoMemory();
    }

    _loadSpritesIntoMemory() {
        const sprites = [
            0xf0,
            0x90,
            0x90,
            0x90,
            0xf0, // 0
            0x20,
            0x60,
            0x20,
            0x20,
            0x70, // 1
            0xf0,
            0x10,
            0xf0,
            0x80,
            0xf0, // 2
            0xf0,
            0x10,
            0xf0,
            0x10,
            0xf0, // 3
            0x90,
            0x90,
            0xf0,
            0x10,
            0x10, // 4
            0xf0,
            0x80,
            0xf0,
            0x10,
            0xf0, // 5
            0xf0,
            0x80,
            0xf0,
            0x90,
            0xf0, // 6
            0xf0,
            0x10,
            0x20,
            0x40,
            0x40, // 7
            0xf0,
            0x90,
            0xf0,
            0x90,
            0xf0, // 8
            0xf0,
            0x90,
            0xf0,
            0x10,
            0xf0, // 9
            0xf0,
            0x90,
            0xf0,
            0x90,
            0x90, // A
            0xe0,
            0x90,
            0xe0,
            0x90,
            0xe0, // B
            0xf0,
            0x80,
            0x80,
            0x80,
            0xf0, // C
            0xe0,
            0x90,
            0x90,
            0x90,
            0xe0, // D
            0xf0,
            0x80,
            0xf0,
            0x80,
            0xf0, // E
            0xf0,
            0x80,
            0xf0,
            0x80,
            0x80, // F
        ];

        for (let i = 0; i < sprites.length; i++) {
            this.memory[i] = sprites[i];
        }
    }

    load(rom) {
        fetch(`/roms/${rom}`)
            .then((response) => {
                return response.arrayBuffer();
            })
            .then((ROM) => {
                ROM = new Uint8Array(ROM);
                for (let i = 0; i < ROM.length; i++) {
                    this.memory[0x200 + i] = ROM[i];
                }
            });
    }

    step() {
        for (let i = 0; i < this.speed; i++) {
            if (!this.paused) {
                const opcode = this._fetch();

                if (opcode === 0) {
                    return;
                }

                const instruction = this._decode(opcode);

                updateMemory(this.PC, opcode, instruction.id);
                updateRegisters(this.registers, this.PC, this.I);

                this._execute(instruction, opcode);
            }
        }

        if (!this.paused) {
            this._updateTimers();
        }

        //this._playSound();
        this.renderer.render();
    }

    _updateTimers() {
        if (this.DT > 0) {
            this.DT -= 1;
        }

        if (this.ST > 0) {
            this.STT -= 1;
        }
    }

    _playSound() {
        if (this.ST > 0) {
            this.speaker.play(440);
        } else {
            this.speaker.stop();
        }
    }

    _fetch() {
        return (this.memory[this.PC] << 8) | this.memory[this.PC + 1];
    }

    _decode(opcode) {
        return disassembler(opcode);
    }

    _execute(instruction, opcode) {
        this._nextInstruction();
        const { id, args } = instruction;
        const currentInstruction = INSTRUCTION_SET.find(
            (instruction) => instruction.name === id
        );
        currentInstruction.execute(this, args);
    }

    _nextInstruction() {
        this.PC += 2;
    }

    _skipInstruction() {
        this.PC += 4;
    }
}

export default CPU;
