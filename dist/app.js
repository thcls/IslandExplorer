"use strict";
class Monster {
    constructor(position) {
        this.position = position;
        this.attack = randomNum(2, 20);
        this.life = randomNum(6, 120);
        this.icon = ['\u{1F40D}', '\u{1F406}', '\u{1F40A}'][randomNum(0, 2)];
        this.show();
    }
    randomMove() {
        const newPosition = randomNum(0, this.position.neighbors.length);
        if (!(newPosition > this.position.neighbors.length - 1) && this.position.neighbors.length != 0) {
            this.position.element.textContent = this.position.element.textContent.replace(this.icon, '');
            console.log(this.position, newPosition);
            this.position = this.position.neighbors[newPosition];
            this.show();
        }
    }
    show() {
        this.position.element.textContent = this.position.element.textContent + this.icon;
    }
    combat() {
    }
}
class GraphNode {
    constructor(element, coordinates) {
        this.element = element;
        this.neighbors = [];
        this.coordinates = coordinates;
    }
}
class Weapon {
    constructor(position) {
        this.position = position;
        this.attack = randomNum(5, 50);
        this.durability = 3;
    }
    atackMonster() {
        if (this.durability > 0) {
            this.durability--;
        }
    }
}
function randomNum(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
}
function calcularDistancia(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)) === 1;
}
function generateIslandGraph(MatrixSize, nodeMutipli) {
    let tableElements = [];
    for (let i = 0; i < MatrixSize; i++) {
        tableElements[i] = Array(MatrixSize).fill(false);
    }
    let x = 0;
    let y = 0;
    tableElements[x][y] = true;
    for (let j = 0; j < MatrixSize * nodeMutipli; j++) {
        do {
            x = randomNum(0, MatrixSize - 1);
            y = randomNum(0, MatrixSize - 1);
        } while (tableElements[x][y] === true);
        tableElements[x][y] = true;
    }
    return tableElements;
}
function generateIsland(MatrixSize, nodeMutipli) {
    const document = window.document;
    const table = document.getElementById("table");
    let tableElements = generateIslandGraph(MatrixSize, nodeMutipli);
    const nodeList = [];
    for (let i = 0; i < MatrixSize; i++) {
        const newTr = document.createElement('tr');
        for (let j = 0; j < MatrixSize; j++) {
            const newTd = document.createElement('td');
            if (tableElements[i][j]) {
                newTd.classList.add('node');
                nodeList.push(new GraphNode(newTd, [i, j]));
            }
            else {
                newTd.classList.add('node');
                newTd.classList.add('invisible');
            }
            newTr.appendChild(newTd);
        }
        table.appendChild(newTr);
    }
    for (let i = 0; i < MatrixSize * nodeMutipli; i++) {
        const node1 = nodeList[i];
        for (let j = 0; j < MatrixSize * nodeMutipli; j++) {
            const node2 = nodeList[j];
            if (calcularDistancia(node1.coordinates[0], node1.coordinates[1], node2.coordinates[0], node2.coordinates[1])) {
                node1.neighbors.push(node2);
            }
        }
    }
    return nodeList;
}
function spawnCreatures(island, n) {
    let mwd = 0;
    const monsterList = [];
    while (((n) / 100) * 26 > mwd) {
        const index = randomNum(1, n - 1);
        if (mwd % 3 === 0) {
            monsterList.push(new Monster(island[index]));
        }
        else if (mwd % 3 === 1) {
        }
        else {
            const armaIcon = ["\u{1F5E1}", '\u{1FA93}', '\u{1FA83}'];
        }
        mwd++;
    }
    return monsterList;
}
function getEdgesNumber(G) {
    return G.reduce((acc, node) => acc + node.neighbors.length, 0);
}
function timerAtt(timer, time) {
    timer.textContent = `${"\u{23F3}"} ${time}`;
}
function main() {
    const player = {
        position: [0, 0],
        attack: 2,
        life: 100,
        icon: "\u{1F9CD}"
    };
    const timer = document.getElementById('timer');
    const MatrixSize = 10;
    const nodeMutipli = 6;
    const n = MatrixSize * nodeMutipli;
    const island = generateIsland(MatrixSize, nodeMutipli);
    const monsterList = spawnCreatures(island, n);
    const m = getEdgesNumber(island);
    let timeLimit = m * 3;
    timerAtt(timer, timeLimit);
    setInterval(() => {
        //do{
        monsterList.map((monster) => monster.randomMove());
        monsterList.map((monster) => {
            for (let m of monsterList) {
                if (monster.position.coordinates === m.position.coordinates) {
                    //lutar
                }
            }
        });
        //}while(timeLimit > 0 && player.life > 0);
        timeLimit--;
        timerAtt(timer, timeLimit);
    }, 1000);
}
main();
//# sourceMappingURL=app.js.map