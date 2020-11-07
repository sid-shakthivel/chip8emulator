import INSTRUCTION_SET from './instructionSet.js';

const disassembler = (opcode) => {
    const instruction = INSTRUCTION_SET.find(
        (instruction) => (instruction.mask & opcode) === instruction.pattern
    );

    const id = instruction.name;

    const args = instruction.arguments
        ? instruction.arguments.map((arg) => (opcode & arg.mask) >> arg.shift)
        : [];

    return { id, args };
};

export default disassembler;
