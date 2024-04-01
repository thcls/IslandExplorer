class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.g = 0;
        this.h = 0;
        this.f = 0;
        this.parent = null;
    }
}

function aStar(grid, start, end) {
    let openSet = [];
    let closedSet = [];

    openSet.push(start);

    while (openSet.length > 0) {
        let currentNode = openSet[0];
        let currentIndex = 0;

        // Find node with lowest f cost
        openSet.forEach((node, index) => {
            if (node.f < currentNode.f) {
                currentNode = node;
                currentIndex = index;
            }
        });

        // Remove currentNode from openSet and add to closedSet
        openSet.splice(currentIndex, 1);
        closedSet.push(currentNode);

        // Found the end
        if (currentNode === end) {
            let path = [];
            let current = currentNode;
            while (current !== start) {
                path.push(current);
                current = current.parent;
            }
            return path.reverse();
        }

        // Generate neighbors
        let neighbors = [];
        let { x, y } = currentNode;
        let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // Assuming 4-direction movement
        for (let dir of directions) {
            let newX = x + dir[0];
            let newY = y + dir[1];
            if (newX >= 0 && newX < grid.length && newY >= 0 && newY < grid[0].length && grid[newX][newY] === 0) {
                neighbors.push(new Node(newX, newY));
            }
        }

        // Loop through neighbors
        for (let neighbor of neighbors) {
            // Neighbor is in closedSet
            if (closedSet.find(node => node === neighbor)) {
                continue;
            }

            let gScore = currentNode.g + 1;
            let gScoreIsBest = false;

            // Neighbor is not in openSet
            if (!openSet.find(node => node === neighbor)) {
                gScoreIsBest = true;
                neighbor.h = heuristic(neighbor, end);
                openSet.push(neighbor);
            } else if (gScore < neighbor.g) {
                gScoreIsBest = true;
            }

            if (gScoreIsBest) {
                neighbor.parent = currentNode;
                neighbor.g = gScore;
                neighbor.f = neighbor.g + neighbor.h;
            }
        }
    }

    return []; // No path found
}

function heuristic(a, b) {
    // Manhattan distance heuristic
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

// Example usage
const grid = [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];
console.log('path');
const startNode = new Node(0, 0);
const endNode = new Node(3, 3);

const path = aStar(grid, startNode, endNode);
console.log(path);
