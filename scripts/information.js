function updateMemory(pc, opcode, instruction) {
    const list = document.querySelector('.opcodeList');
    const children = list.childNodes;

    children.forEach((child) => {
        if (child.nodeType !== Node.TEXT_NODE) {
            if (child.classList.contains('special')) {
                child.classList.remove('special');
            }
        }
    });

    const node = document.createElement('p');
    const textNode = document.createTextNode(
        `0x${pc.toString(16)}\t0x${opcode.toString(16)}\t${instruction}`
    );
    node.append(textNode);
    node.classList.add('special');
    list.prepend(node);
}

function updateRegisters(registers, PC, I) {
    document.querySelector('#I').innerHTML = `I: 0x${I.toString(16)}`;
    document.querySelector('#PC').innerHTML = `PC: 0x${PC.toString(16)}`;

    registers.forEach((register, i) => {
        document.querySelector(`#R${i}`).innerHTML = `R${i}:\t${register}`;
    });
}

export { updateMemory, updateRegisters };
