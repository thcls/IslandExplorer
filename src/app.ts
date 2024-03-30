class Monster{
    position: GraphNode;
    attack: number;
    life: number;
    lastTurnMove: number;
    icon: string;
    
    constructor(position: GraphNode, timeLimit: number){
        this.position = position;
        this.attack = randomNum(2,20);
        this.life = randomNum(6, 120);
        this.lastTurnMove = timeLimit;
        this.icon = ['\u{1F40D}', '\u{1F406}', '\u{1F40A}', '\u{1F41C}'][randomNum(0,3)];
    }

    randomMove(timeLimit: number){
        let newPosition = randomNum(0,this.position.neighbors.length);

        if ((this.lastTurnMove > timeLimit) && !(newPosition > this.position.neighbors.length-1) && (this.position.neighbors.length != 0) && !(this.position.neighbors[newPosition].safe)){
            this.position.element.textContent = this.position.element.textContent!.replace(this.icon, '');
            this.position = this.position.neighbors[newPosition];
            this.lastTurnMove = timeLimit
            this.display()
        }
    }
    display(){
        this.position.element.textContent = this.position.element.textContent + this.icon;
    }

    flight(timeLimit: number){
        let newPosition = randomNum(0,this.position.neighbors.length - 1);
        let i = 2
        do{
            newPosition = randomNum(0,this.position.neighbors.length - 1);
            i -= 1;
        }while((i > 0 && !this.position.safe))
        if (!this.position.safe){
            this.position.element.textContent = this.position.element.textContent!.replace(this.icon, '');
            this.position = this.position.neighbors[newPosition];
            this.lastTurnMove = timeLimit
            this.display()
        }
    }

    damage(dmg: number, island: GraphNode[], timeLimit: number){
        this.life -= dmg;
        if(this.life < 0){
            this.respawn(island, timeLimit)
        }
    }

    respawn(island: GraphNode[],timeLimit: number){
        const newPosition = randomNum(0, island.length - 1);
        this.position.element.textContent = this.position.element.textContent!.replace(this.icon, '');
        this.position = island[newPosition];
        this.life = randomNum(6, 120);
        this.lastTurnMove = timeLimit
        this.display()
    }
    msg(){
        const mMsg: Record<string, string>  = {
            '\u{1F40D}': "Uma cobra venenosa surge, pronta para atacar!",
            '\u{1F406}': "Um leopardo faminto aparece das sombras!",
            '\u{1F40A}': "Um crocodilo monstruoso emerge das águas!",
            '\u{1F41C}': "Uma horda de formigas gigantes se aproxima!"
        };
        alert(mMsg[this.icon])
    }
}
class GraphNode{
    element: HTMLTableCellElement;
    neighbors: GraphNode[];
    coordinates?: [number, number];
    trapDamage: number;
    safe: boolean;
    
    constructor(element: HTMLTableCellElement, coordinates: [number,number]){
        this.element = element;
        this.neighbors = [];
        this.coordinates = coordinates;
        this.trapDamage = 0
        this.safe = false
    }
    getCoordenates(){
        return `${this.coordinates![0]} ${this.coordinates![1]}`
    }
    sameCoordenates(node: GraphNode){
        return (this.coordinates![0] === node.coordinates![0] && this.coordinates![1] === node.coordinates![1])
    }
}
class Weapon{
    position: GraphNode;
    attack: number;
    durability: number;
    icon: string;
    
    constructor(position: GraphNode){
        this.position = position;
        this.attack = randomNum(5, 50);
        this.durability = 3;
        this.icon = ["\u{1F5E1}", '\u{1FA93}', '\u{1FA83}'][randomNum(0,2)];
    }
    attackMonster(){
        if (this.durability > 0){
            this.durability--;
        }
    }

    display(){
        this.position.element.textContent += this.icon
    }

    pickWeapon(){
        this.position.element.textContent = this.position.element.textContent!.replace(this.icon, '');
    }
    msg(){
        const wMsg: Record<string, string> = {
            '\u{1F5E1}': "Uma espada antiga reluz em uma câmara secreta.",
            '\u{1FA93}': "Um arco e flechas repousam em um recanto da floresta.",
            '\u{1FA83}': "Um machado de guerra brilha em um túmulo antigo."
        };
        alert(wMsg[this.icon])
    }
}
interface Treasure{
    position?: GraphNode,
    icon: string,
    percent: number
}
function BFS(v1: GraphNode, target: GraphNode) {
    const visited: {[key: string]: boolean} = {};
    const queue: GraphNode[] = [];
    queue.push(v1);
    visited[v1.getCoordenates()] = true;
    let isReachable = false
    while (queue.length > 0) {
        const vu = queue.shift()!;

        vu.neighbors.forEach(neighbor => {
            if (!visited[neighbor.getCoordenates()]) {
                if (neighbor.sameCoordenates(target)){
                    isReachable = true
                }
                visited[neighbor.getCoordenates()] = true;
                queue.push(neighbor);
            }
        });
    }
    return isReachable;
}
function BFSPath(v1: GraphNode, target: GraphNode) {
    const queue: GraphNode[] = [];
    const dist: {[key: string]: {dist: number, position:GraphNode}} = {};
    const pred: {[key: string]: GraphNode} = {};
    queue.push(v1);
    dist[v1.getCoordenates()] = {dist: 0, position: v1};
    pred[v1.getCoordenates()] = v1
    while (queue.length > 0) {
        const vu = queue.shift()!;

        vu.neighbors.forEach(neighbor => {
            if(!(neighbor.getCoordenates() in dist)){
                dist[neighbor.getCoordenates()] = {dist: Infinity, position: neighbor}
                pred[neighbor.getCoordenates()] = vu
            }
            if (dist[vu.getCoordenates()].dist + 1 < dist[neighbor.getCoordenates()].dist) {
                dist[neighbor.getCoordenates()].dist = dist[vu.getCoordenates()].dist + 1
                pred[neighbor.getCoordenates()] = vu
                queue.push(neighbor)
            }
        });
    }
    const path: GraphNode[] = []
    path.unshift(target)
    let temp = target
    while(!v1.sameCoordenates(temp)){
        temp = pred[temp.getCoordenates()]
        path.unshift(temp)
    }
    return path
}
function randomNum(a: number, b: number){
    return Math.floor(Math.random() * (b - a + 1)) + a;
}
function calcularDistancia(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2)) === 1;
}
function generateIslandGraph(MatrixSize:number, nodeMutipli:number){

    let tableElements: boolean[][] = [];

    for (let i = 0; i < MatrixSize; i++) {
        tableElements[i] = Array(MatrixSize).fill(false);
    }

    let x = 0
    let y = 0
    tableElements[x][y] = true
    
    for(let j = 0; j < MatrixSize*nodeMutipli;j++){
        do{
            x = randomNum(0, MatrixSize - 1);
            y = randomNum(0, MatrixSize - 1);
        }while(tableElements[x][y] === true);
        tableElements[x][y] = true
    }
    return tableElements
}
function generateIsland(MatrixSize:number, nodeMutipli:number, treasure: Treasure, n: number){
    const document = window.document;
    const table = document.getElementById("table")!;
    let nodeList = []
    let tableElements = generateIslandGraph(MatrixSize, nodeMutipli);

    for(let i = 0; i < MatrixSize;i++){
        const newTr = document.createElement('tr');
        for(let j = 0; j < MatrixSize;j++){
            const newTd = document.createElement('td');
            if (tableElements[i][j]){
                
                newTd.classList.add('node');
                nodeList.push(new GraphNode(newTd, [i,j]))

            }else{
                newTd.classList.add('node');
                newTd.classList.add('invisible');
            }
            newTr.appendChild(newTd);
        }
        table.appendChild(newTr);
    }

    for(let i = 0; i < MatrixSize * nodeMutipli;i++){
        const node1 = nodeList[i]
        for(let j = 0; j < MatrixSize * nodeMutipli;j++){
            const node2 = nodeList[j]
            if(calcularDistancia(node1.coordinates![0], node1.coordinates![1], node2.coordinates![0], node2.coordinates![1])){
                node1.neighbors.push(node2);
            }
        }
    } 
    
    treasure.position = nodeList[randomNum(Math.floor(n/1.5), n-1)]
    if(!BFS(nodeList[0], treasure.position)){
        location.reload()
    }
    nodeList[0].safe = true
    return nodeList
}
async function spawnCreatures(island: GraphNode[], n: number, weaponList: Weapon[], timeLimit: number){
    let mwd = 0;
    let monsterList: Monster[] = []
    while(((n)/100) * 28 > mwd){
        let index = randomNum(1,n-1);
        if (mwd % 3 === 0 && !(island[index].safe)){
            let m=new Monster(island[index], timeLimit);
            monsterList.push(m);
            monsterList[monsterList.length-1] = m
            monsterList = monsterList.filter(monster =>{
                if(monster.position !== undefined){
                    return true
                }else{
                    mwd--;
                    return false
                }
            });
        }else if(mwd % 3 === 1 && !(island[index].safe)){
            island[index].trapDamage = randomNum(4, 20);
            island[index].element.classList.add('trap');
        }else{
            weaponList.push(new Weapon(island[index]));
        }
        mwd++;
    }

    return monsterList
}
function getEdgesNumber(G: GraphNode[]){
    return G.reduce((acc, node) => acc + node.neighbors.length, 0)
}
function timerAtt(timer: HTMLSpanElement, time: number){
    timer.textContent = `${"\u{23F3}"} ${time}`
}
function fightOrFlight(island: GraphNode[], monsters: Monster[], timeLimit: number){
    let strongest:Monster = monsters[0]
    let weakest:Monster = monsters[0]
    for(let m of monsters){
        if (m.attack > strongest.attack){
            strongest = m
        }
        if(m.attack < weakest.attack){
            weakest = m
        }
    }
    weakest.damage(strongest.attack, island, timeLimit);
    strongest.lastTurnMove = timeLimit
    for(let m of monsters){
        if (m.lastTurnMove > timeLimit){
            m.flight(timeLimit)
        }
    }
}
function playerInput(monster: Monster|undefined, weapon: Weapon|undefined, player: any, treasure: Treasure){
    let msg: string = ''
    let opCount = 0
    const options: Record<string, Function> = {}
    if(monster != undefined){
        opCount++
        msg += `Opção ${ opCount } - Atacar monstro.\n`
        options[`${ opCount }`] = () => {
            player.atackMonster(monster)
        }
        opCount++
        msg += `Opção ${ opCount } - Sentindo-se sobrecarregado, você opta por uma retirada estratégica para evitar o perigo imediato.\n`
        options[`${ opCount }`] = () => {
            player.run()
        }
    }
    if(weapon != undefined){
        opCount++
        msg += `Opção ${ opCount } - Equipar a arma que você encontrou.\n`
        options[`${ opCount }`] = () => {
            player.pickWeapon(weapon)
        }
        opCount++
        msg += `Opção ${ opCount } - Continuar sua jornada.\n`
        options[`${ opCount }`] = () => {
            return
        }
    }
    if(treasure.position?.sameCoordenates(player.position) && player.weapon.durability > 0){
        opCount++
        msg += `Opção ${ opCount } - Soltar arma equipada.\n`
        options[`${ opCount }`] = () => {
            player.dropWeapon()
        }
    }
    const playerInput = prompt(msg);
    if(playerInput === null){
        player.moveTo(player.position)
        return
    }else{
        alert(playerInput)
        options[`${ playerInput }`]()
    }
}
async function playerMove(player: any, island: GraphNode[], monsterList: Monster[], weaponList: Weapon[], treasure:Treasure, timeLimit: number){
    let path = []
    let monster = monsterCheck(player, monsterList)
    let weapon = weaponCheck(player, weaponList)
    trapCheck(player)
    if(monster != undefined || weapon != undefined || (player.weapon.durability > 0 && treasure.position?.sameCoordenates(player.position))){
        await wait()
        playerInput(monster, weapon, player, treasure);
    }
    if(player.timeLimit != timeLimit){
        if(treasure.position?.sameCoordenates(player.position)){
            treasure.position.element.innerText = treasure.position.element.innerText.replace(treasure.icon, '');
            player.treasure = 100
        }

        if(player.treasure === 0){
            path = BFSPath(player.position, treasure.position!)
        }else{
            path = BFSPath(player.position, island[0])
        }
        if(path.length > 1){
            await player.moveTo(path[1])
        }
    }
}
function wait() {
    return new Promise<void>(resolve => setTimeout(resolve, 1000));
}
async function monstersMove(monsterList: Monster[], island: GraphNode[], timeLimit: number, player: any){
    monsterList.map(monster => {
        if(monster.position.sameCoordenates(player.position)){
            if(player.position.sameCoordenates(player.lastPosition)){
                alert(`O monstro desfere um golpe certeiro, causando um ferimento profundo! (-${monster.attack} HP)`)
            }
            monster.lastTurnMove = timeLimit
            player.damage(monster.attack)
        }
        const monsterFight = monsterList.filter(((m) => monster.position.coordinates === m.position.coordinates))
        if(monsterFight.length > 1) {
            fightOrFlight(island, monsterFight, timeLimit)
        }else{
            monster.randomMove(timeLimit)
        }
        if(monster.position.trapDamage > 0){
            monster.damage(monster.position.trapDamage, island, timeLimit)
        }
    })
}
function trapCheck(player: any){
    if(player.poisonDmg > 0){
        alert(`O veneno continua a queimar em suas veias, causando dano de 2 HP a cada ${player.poisonDmg} turnos.`)
        player.poisonDmg--;
        player.damage(2)
    }
    if (player.position.trapDamage){
        const trapDmgMsg = [
            `Um trecho escorregadio na beira de um abismo te pega desprevenido! Você consegue se equilibrar, mas não sem um tropeção doloroso. (-${player.position.trapDamage} HP)`,
            `Seu pé afunda em um buraco disfarçado de solo firme! Com esforço, você consegue se libertar antes que a areia movediça o engula completamente. (-${player.position.trapDamage} HP por sufocamento e esforço para escapar)`,
            `Enquanto atravessa um pântano, você pisa em um pequeno poço de piche! Seu pé fica preso brevemente antes que você consiga se soltar. (-${player.position.trapDamage} HP por queimaduras leves e esforço para se libertar)`,
        ]
        const poisonDmg = [
            `Um pequeno escorpião emerge das sombras e crava seu ferrão venenoso em sua perna! Você sente uma queimação aguda, mas consegue afastá-lo rapidamente. (-${player.position.trapDamage} HP por veneno)`,
            `Ao colher o fruto chamativo de uma planta desconhecida, você percebe tarde demais sua toxicidade! Você cospe o pedaço ingerido, sentindo apenas uma leve náusea. (${player.position.trapDamage} HP por envenenamento)`
        ]
        if(randomNum(1, 4) === 1){
            player.poisonDmg = 3
            alert(poisonDmg[randomNum(0, poisonDmg.length-1)])
            player.damage(player.position.trapDamage)
        }else{
            alert(trapDmgMsg[randomNum(0, trapDmgMsg.length-1)])
            player.damage(player.position.trapDamage)
        }
        
    }
}
function monsterCheck(player: any, monsterList: Monster[]){
    for(let m of monsterList){
        if(m.position.sameCoordenates(player.position)){
            m.msg()
            return m
        }
    }
}
function weaponCheck(player: any, weaponList: Weapon[]){
    for(let w of weaponList){
        if(w.position.sameCoordenates(player.position)){
            w.msg()
            return w
        }
    }
}
async function main(){

    const timer = document.getElementById('timer')!;
    const MatrixSize = 10;
    const nodeMutipli = 7
    const n = MatrixSize * nodeMutipli
    const weaponList: Weapon[] = []
    
    const treasure: Treasure = {
        icon: '\u{1FA99}',
        percent: 100
    };
    
    const island = generateIsland(MatrixSize, nodeMutipli, treasure, n);
    const checkPoints: GraphNode[] = [island[randomNum(1, n-1)], island[randomNum(1, n-1)]]
    const m = getEdgesNumber(island)
    let timeLimit =  m * 3
    
    checkPoints.map((position) =>{
        position.element.classList.add('checkPoint')
    });
    const monsterList = await spawnCreatures(island, n, weaponList, timeLimit);
    const player = {
        position: island[0],
        lastPosition: island[0],
        attack: 2,
        life: 100,
        icon: "\u{1F9CD}",
        weapon: weaponList[0],
        savePoint: false,
        treasure: 0,
        gameOver: false,
        poison: 0,
        actionAvailable: false,
        lastTurnMove: 0,

        atackMonster(monster: Monster){
            if(this.weapon.durability > 0){
                alert(this.weapon.attack)
                monster.damage(this.weapon.attack, island, timeLimit)
                this.weapon.durability -= 1
            }else{
                alert(this.attack)
                monster.damage(this.attack, island, timeLimit)
            }
            player.moveTo(player.position)
        },
        pickWeapon(weapon: Weapon){
            this.lastTurnMove = timeLimit
            weapon.pickWeapon()
            this.weapon = weapon
        },
        damage(dmg: number){
            this.life -= dmg
            const life = document.getElementById('life')!
            life.textContent = `${"\u{2764}"} ${this.life}%`
            if(player.life <= 0){
                if(this.savePoint){
                    this.respawn()
                }else{
                    alert(gameOver)
                }
            }
        },
        moveTo(newPosition: GraphNode){
            this.position.element.textContent = this.position.element.textContent!.replace(this.icon, '');
            this.lastPosition = this.position
            this.position = newPosition
            this.lastTurnMove = timeLimit
            this.display()
        },
        randomMove(){
            this.lastTurnMove = timeLimit
            let newPosition = randomNum(0,this.position.neighbors.length);
            this.moveTo(this.position.neighbors[newPosition])
        },
        display(){
            this.position.element.textContent = this.icon + this.position.element.textContent
        },
        respawn(){
            if(this.savePoint){

            }else{
                this.gameOver = true
            }
        },
        dropWeapon(){
            this.lastTurnMove = timeLimit
            player.weapon.position = player.position
            player.weapon.display()
            player.weapon = weaponList[0]
        }
    };
    monsterList.map( monster => monster.display())
    island[0].element.textContent = player.icon;

    treasure.position!.element.textContent = treasure.icon
    treasure.position!.safe = true
    timerAtt(timer, timeLimit)

    weaponList.map(weapon => weapon.display());

    let gameOver = false
    await wait()
    while(!player.gameOver){
        
        await playerMove(player, island, monsterList, weaponList, treasure, timeLimit);
        await monstersMove(monsterList, island, timeLimit, player)
        timeLimit--;
        timerAtt(timer, timeLimit);
        if (timeLimit === 0 || (player.life < 0 && !(player.savePoint)) || (player.position.sameCoordenates(island[0]) && player.treasure > 0)){
            player.gameOver = true
        }
        await wait()
    }
    
}

main()