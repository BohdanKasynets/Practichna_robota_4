const readline = require('readline');

class PriorityQueue {
    constructor() {
        this.values = [];
    }

    enqueue(val, priority) {
        this.values.push({ val, priority });
        this.sort();
    }

    dequeue() {
        return this.values.shift();
    }

    sort() {
        this.values.sort((a, b) => a.priority - b.priority);
    }

    isEmpty() {
        return this.values.length === 0;
    }
}

class Graph {
    constructor() {
        this.adjacencyList = {};
    }

    addVertex(vertex) {
        if (!this.adjacencyList[vertex]) this.adjacencyList[vertex] = {};
    }

    addEdge(vertex1, vertex2, weight) {
        this.adjacencyList[vertex1][vertex2] = weight;
        this.adjacencyList[vertex2][vertex1] = weight;
    }

    dijkstra(start, finish) {
        const nodes = new PriorityQueue();
        const distances = {};
        const previous = {};
        let path = [];
        let smallest;

        for (let vertex in this.adjacencyList) {
            if (vertex === start) {
                distances[vertex] = 0;
                nodes.enqueue(vertex, 0);
            } else {
                distances[vertex] = Infinity;
                nodes.enqueue(vertex, Infinity);
            }
            previous[vertex] = null;
        }

        while (!nodes.isEmpty()) {
            smallest = nodes.dequeue().val;

            if (smallest === finish) {
     
                while (previous[smallest]) {
                    path.push(smallest);
                    smallest = previous[smallest];
                }
                break;
            }

            if (smallest || distances[smallest] !== Infinity) {
                for (let neighbor in this.adjacencyList[smallest]) {
                    let nextNode = this.adjacencyList[smallest][neighbor];
                    let candidate = distances[smallest] + nextNode;
                    if (candidate < distances[neighbor]) {
                        distances[neighbor] = candidate;
                        previous[neighbor] = smallest;
                        nodes.enqueue(neighbor, candidate);
                    }
                }
            }
        }
        return path.concat(smallest).reverse();
    }
}

function createGraphFromUserInput() {
    const graph = new Graph();
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question("Введіть вершини через пробіл: ", (verticesInput) => {
        const vertices = verticesInput.split(" ");
        vertices.forEach(v => graph.addVertex(v));

        function addEdge() {
            rl.question("Введіть ребро у форматі 'в1 в2 вага' або 'stop' для завершення: ", (edge) => {
                if (edge === "stop") {
                    rl.question("Введіть початкову вершину: ", (start) => {
                        rl.question("Введіть кінцеву вершину: ", (finish) => {
                            const path = graph.dijkstra(start, finish);
                            console.log(`Найкоротший шлях від ${start} до ${finish}: ${path.join(" -> ")}`);
                            rl.close();
                        });
                    });
                } else {
                    const [v1, v2, weight] = edge.split(" ");
                    graph.addEdge(v1, v2, parseInt(weight));
                    addEdge();
                }
            });
        }

        addEdge();
    });
}

function createGraphFromPredefinedData() {
    const graph = new Graph();
    const data = {
        vertices: ["A", "B", "C", "D", "E", "F"],
        edges: [
            ["A", "B", 4],
            ["A", "C", 2],
            ["B", "E", 3],
            ["C", "D", 2],
            ["C", "F", 4],
            ["D", "E", 3],
            ["D", "F", 1],
            ["E", "F", 1]
        ]
    };

    data.vertices.forEach(v => graph.addVertex(v));
    data.edges.forEach(([v1, v2, weight]) => graph.addEdge(v1, v2, weight));

    const start = "A";
    const finish = "E";
    const path = graph.dijkstra(start, finish);

    console.log(`Найкоротший шлях від ${start} до ${finish}: ${path.join(" -> ")}`);
}


createGraphFromUserInput();
