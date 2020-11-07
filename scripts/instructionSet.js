const INSTRUCTION_SET = [
    {
        name: 'CLS',
        pattern: 0x00e0,
        mask: 0xffff,
        execute: (cpu, args) => {
            cpu.renderer.render();
        },
    },
    {
        name: 'RET',
        pattern: 0x00ee,
        mask: 0xffff,
        execute: (cpu, args) => {
            cpu.PC = cpu.stack.pop();
        },
    },
    {
        name: 'JP_ADD',
        pattern: 0x1000,
        mask: 0xf000,
        arguments: [{ mask: 0x0fff, shift: 0, type: 'A' }],
        execute: (cpu, args) => {
            cpu.PC = args[0];
        },
    },
    {
        name: 'CALL_ADD',
        pattern: 0x2000,
        mask: 0xf000,
        arguments: [{ mask: 0x0fff, shift: 0, type: 'A' }],
        execute: (cpu, args) => {
            cpu.stack.push(cpu.PC);
            cpu.PC = args[0];
        },
    },
    {
        name: 'SE_R_NN',
        pattern: 0x3000,
        mask: 0xf000,
        arguments: [
            { mask: 0x0f00, shift: 8, type: 'R' },
            { mask: 0x00ff, shift: 0, type: 'NN' },
        ],
        execute: (cpu, args) => {
            if (cpu.registers[args[0]] === args[1]) {
                cpu._nextInstruction();
            }
        },
    },
    {
        name: 'SNE_R_NN',
        pattern: 0x4000,
        mask: 0xf000,
        arguments: [
            { mask: 0x0f00, shift: 8, type: 'R' },
            { mask: 0x00ff, shift: 0, type: 'NN' },
        ],
        execute: (cpu, args) => {
            if (cpu.registers[args[0]] !== args[1]) {
                cpu._nextInstruction();
            }
        },
    },
    {
        name: 'SE_R_R',
        pattern: 0x5000,
        mask: 0xf00f,
        arguments: [
            { mask: 0x0f00, shift: 8, type: 'R' },
            { mask: 0x00f0, shift: 4, type: 'R' },
        ],
        execute: (cpu, args) => {
            if (cpu.registers[args[0]] === cpu.registers[args[1]]) {
                cpu._nextInstruction();
            }
        },
    },
    {
        name: 'LD_R_NN',
        pattern: 0x6000,
        mask: 0xf000,
        arguments: [
            { mask: 0x0f00, shift: 8, type: 'R' },
            { mask: 0x00ff, shift: 0, type: 'NN' },
        ],
        execute: (cpu, args) => {
            cpu.registers[args[0]] = args[1];
        },
    },
    {
        name: 'ADD_R,NN',
        pattern: 0x7000,
        mask: 0xf000,
        arguments: [
            { mask: 0x0f00, shift: 8, type: 'R' },
            { mask: 0x00ff, shift: 0, type: 'NN' },
        ],
        execute: (cpu, args) => {
            cpu.registers[args[0]] = cpu.registers[args[0]] + args[1];
        },
    },
    {
        name: 'LD_R_R',
        pattern: 0x8000,
        mask: 0xf00f,
        arguments: [
            { mask: 0x0f00, shift: 8, type: 'R' },
            { mask: 0x00f0, shift: 4, type: 'R' },
        ],
        execute: (cpu, args) => {
            cpu.registers[args[0]] = cpu.registers[args[1]];
        },
    },
    {
        name: 'OR_R_R',
        pattern: 0x8001,
        mask: 0xf00f,
        arguments: [
            { mask: 0x0f00, shift: 8, type: 'R ' },
            { mask: 0x00f0, shift: 4, type: 'R' },
        ],
        execute: (cpu, args) => {
            cpu.registers[args[0]] =
                cpu.registers[args[0]] | cpu.registers[args[1]];
        },
    },
    {
        name: 'AND_R_R',
        pattern: 0x8002,
        mask: 0xf00f,
        arguments: [
            { mask: 0x0f00, shift: 8, type: 'R ' },
            { mask: 0x00f0, shift: 4, type: 'R' },
        ],
        execute: (cpu, args) => {
            cpu.registers[args[0]] =
                cpu.registers[args[0]] & cpu.registers[args[1]];
        },
    },
    {
        name: 'XOR_R_R',
        pattern: 0x8003,
        mask: 0xf00f,
        arguments: [
            { mask: 0x0f00, shift: 8, type: 'R ' },
            { mask: 0x00f0, shift: 4, type: 'R' },
        ],
        execute: (cpu, args) => {
            cpu.registers[args[0]] =
                cpu.registers[args[0]] ^ cpu.registers[args[1]];
        },
    },
    {
        name: 'ADD_R_R',
        pattern: 0x8004,
        mask: 0xf00f,
        arguments: [
            { mask: 0x0f00, shift: 8, type: 'R ' },
            { mask: 0x00f0, shift: 4, type: 'R' },
        ],
        execute: (cpu, args) => {
            cpu.registers[0xf] =
                cpu.registers[args[0]] + cpu.registers[args[1]] > 0xff ? 1 : 0;
            cpu.registers[args[0]] += cpu.registers[args[1]];
        },
    },
    {
        name: 'SUB_R_R',
        pattern: 0x8005,
        mask: 0xf00f,
        arguments: [
            { mask: 0x0f00, shift: 8, type: 'R ' },
            { mask: 0x00f0, shift: 4, type: 'R' },
        ],
        execute: (cpu, args) => {
            cpu.registers[0xf] = 0;

            if (cpu.registers[args[0]] > cpu.registers[args[1]]) {
                cpu.registers[0xf] = 1;
            }

            cpu.registers[args[0]] -= cpu.registers[args[1]];
        },
    },
    {
        name: 'SHR_R_R',
        pattern: 0x8006,
        mask: 0xf00f,
        arguments: [{ mask: 0x0f00, shift: 8, type: 'R ' }],
        execute: (cpu, args) => {
            cpu.registers[0xf] = cpu.registers[args[0]] & 0x1;
            cpu.registers[args[0]] >>= 1;
        },
    },
    {
        name: 'SUBN_R_R',
        pattern: 0x8007,
        mask: 0xf00f,
        arguments: [
            { mask: 0x0f00, shift: 8, type: 'R ' },
            { mask: 0x00f0, shift: 4, type: 'R' },
        ],
        execute: (cpu, args) => {
            cpu.registers[0xf] = 0;

            if (cpu.registers[args[1]] > cpu.registers[args[0]]) {
                cpu.registers[0xf] = 1;
            }

            cpu.registers[args[0]] =
                cpu.registers[args[1]] - cpu.registers[args[0]];
        },
    },
    {
        name: 'SHL_R_R',
        pattern: 0x800e,
        mask: 0xf00f,
        arguments: [
            { mask: 0x0f00, shift: 8, type: 'R ' },
            { mask: 0x00f0, shift: 4, type: 'R' },
        ],
        execute: (cpu, args) => {
            cpu.registers[0xf] = cpu.registers[args[0]] >> 7;
            cpu.registers[args[0]] <<= 1;
        },
    },
    {
        name: 'SNE_R_R',
        pattern: 0x9000,
        mask: 0xf00f,
        arguments: [
            { mask: 0x0f00, shift: 8, type: 'R ' },
            { mask: 0x00f0, shift: 4, type: 'R' },
        ],
        execute: (cpu, args) => {
            if (cpu.registers[args[0]] !== cpu.registers[args[1]]) {
                cpu._nextInstruction();
            }
        },
    },
    {
        name: 'LD_I_ADD',
        pattern: 0xa000,
        mask: 0xf000,
        arguments: [{ mask: 0x0fff, shift: 0, type: 'A' }],
        execute: (cpu, args) => {
            cpu.I = args[0];
        },
    },
    {
        name: 'JP_R_ADD',
        pattern: 0xb000,
        mask: 0xf000,
        arguments: [{ mask: 0x0fff, shift: 0, type: 'A' }],
        execute: (cpu, args) => {
            cpu.PC = args[0] + cpu.registers[0];
        },
    },
    {
        name: 'RND_R_NN',
        pattern: 0xc000,
        mask: 0xf000,
        arguments: [
            { mask: 0x0f00, shift: 8, type: 'R' },
            { mask: 0x00ff, shift: 0, type: 'NN' },
        ],
        execute: (cpu, args) => {
            let randNum = Math.floor(Math.random() * 0xff);
            cpu.registers[args[0]] = randNum & args[1];
        },
    },
    {
        name: 'DRW_R_R_N',
        pattern: 0xd000,
        mask: 0xf000,
        arguments: [
            { mask: 0x0f00, shift: 8, type: 'R' },
            { mask: 0x00f0, shift: 4, type: 'R' },
            { mask: 0x000f, shift: 0, type: 'N' },
        ],
        execute: (cpu, args) => {
            cpu.registers[0xf] = 0;
            for (let i = 0; i < args[2]; i++) {
                let sprite = cpu.memory[cpu.I + i];
                for (let j = 0; j < 8; j++) {
                    if ((sprite & 0x80) > 0) {
                        if (
                            cpu.renderer.setPixel(
                                cpu.registers[args[0]] + j,
                                cpu.registers[args[1]] + i
                            )
                        ) {
                            cpu.registers[0xf] = 1;
                        }
                    }

                    sprite <<= 1;
                }
            }
        },
    },
    {
        name: 'SKP_R',
        pattern: 0xe09e,
        mask: 0xf0ee,
        arguments: [{ mask: 0x0f00, shift: 8, type: 'R' }],
        execute: (cpu, args) => {
            if (cpu.keyboard.isKeyPressed(cpu.registers[args[0]])) {
                cpu._nextInstruction();
            }
        },
    },
    {
        name: 'SKNP_R',
        pattern: 0xe0a1,
        mask: 0xf0ff,
        arguments: [{ mask: 0x0f00, shift: 8, type: 'R' }],
        execute: (cpu, args) => {
            if (!cpu.keyboard.isKeyPressed(cpu.registers[args[0]])) {
                cpu._nextInstruction();
            }
        },
    },
    {
        name: 'LD_R_DT',
        pattern: 0xf007,
        mask: 0xf0ff,
        arguments: [{ mask: 0x0f00, shift: 8, type: 'R' }],
        execute: (cpu, args) => {
            cpu.registers[args[0]] = cpu.DT;
            cpu._nextInstruction();
        },
    },
    {
        name: 'LD_R_K',
        pattern: 0xf00a,
        mask: 0xf0ff,
        arguments: [{ mask: 0x0f00, shift: 8, type: 'R' }],
        execute: (cpu, args) => {
            cpu.paused = true;

            cpu.keyboard.onNextKeyPress = function (key) {
                cpu.registers[args[0]] = key;
                cpu.paused = false;
            }.bind(cpu);
        },
    },
    {
        name: 'LD_DT_R',
        pattern: 0xf015,
        mask: 0xf0ff,
        arguments: [{ mask: 0x0f00, shift: 8, type: 'R' }],
        execute: (cpu, args) => {
            cpu.DT = cpu.registers[args[0]];
        },
    },
    {
        name: 'LD_ST_R',
        pattern: 0xf018,
        mask: 0xf0ff,
        arguments: [{ mask: 0x0f00, shift: 8, type: 'R' }],
        execute: (cpu, args) => {
            cpu.ST = cpu.registers[args[0]];
            cpu._nextInstruction();
        },
    },
    {
        name: 'LD_I_R',
        pattern: 0xf01e,
        mask: 0xf0ff,
        arguments: [{ mask: 0x0f00, shift: 8, type: 'R' }],
        execute: (cpu, args) => {
            cpu.I += cpu.registers[args[0]];
        },
    },
    {
        name: 'LD_F_R',
        pattern: 0xf029,
        mask: 0xf0ff,
        arguments: [{ mask: 0x0f00, shift: 8, type: 'R' }],
        execute: (cpu, args) => {
            cpu.I = cpu.registers[args[0]] * 5;
        },
    },
    {
        name: 'LD_B_R',
        pattern: 0xf033,
        mask: 0xf0ff,
        arguments: [{ mask: 0x0f00, shift: 8, type: 'R' }],
        execute: (cpu, args) => {
            cpu.memory[cpu.I] = parseInt(cpu.registers[args[0]] / 100);
            cpu.memory[cpu.I + 1] = parseInt(
                (cpu.registers[args[0]] / 10) % 10
            );
            cpu.memory[cpu.I + 2] = parseInt(cpu.registers[args[0]] % 10);
        },
    },
    {
        name: 'LD_[I]_R',
        pattern: 0xf055,
        mask: 0xf0ff,
        arguments: [{ mask: 0x0f00, shift: 8, type: 'R' }],
        execute: (cpu, args) => {
            for (let i = 0; i <= args[0]; i++) {
                cpu.memory[cpu.I + i] = cpu.registers[i];
            }
        },
    },
    {
        name: 'LD_R_[I]',
        pattern: 0xf065,
        mask: 0xf0ff,
        arguments: [{ mask: 0x0f00, shift: 8, type: 'R' }],
        execute: (cpu, args) => {
            for (let i = 0; i <= args[0]; i++) {
                cpu.registers[i] = cpu.memory[cpu.I + i];
            }
        },
    },
    {
        name: 'DW',
        pattern: 0x0000,
        mask: 0x0000,
        arguments: [{ mask: 0xffff, shift: 0, type: 'DW' }],
        execute: (cpu) => {
            console.log('ERROR');
        },
    },
];

export default INSTRUCTION_SET;
