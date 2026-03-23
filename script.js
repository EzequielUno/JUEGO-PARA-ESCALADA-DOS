// Configuración de niveles (Lógica portada de Python a JS)
const LEVEL_CONFIG = {
    1: {
        "name": "Principiante - Muro Amigable",
        "sectors": ["Aplome", "Placa vertical"],
        "types": ["Travesía"],
        "hold_distribution": {
            "Manijas": [1, 5],
            "Apliques": [1, 5],
            "Regletas": [0, 5]
        },
        "top_hold": ["Manija Grande", "Manijas"],
        "points": 100
    },
    2: {
        "name": "Intermedio - Desafío",
        "sectors": ["Placa vertical", "Desplome"],
        "types": ["Travesía", "Altura"],
        "hold_distribution": {
            "Manijas": [1, 3],
            "Regletas": [2, 4],
            "Romo": [0, 2],
            "Aplique": [0,4],
            "Bidedo": [0,2]
        },
        "top_hold": ["Regleta Buena", "Aplique", "Regleta"],
        "points": 200
    },
    3: {
        "name": "Avanzado - Techo Loco",
        "sectors": ["Desplome", "Techo"],
        "types": ["Boulder"],
        "hold_distribution": {
            "Regletas": [3, 5],
            "Bidedo": [0, 2],
            "Romo": [2, 4],
            "Micro toma":[0,4],
            "Moneda":[0,4]
        },
        "top_hold": ["Romo", "Bidedo", "Regleta"],
        "points": 300
    }
};

let totalScore = 0;
let currentRoutePoints = 0;

// Función auxiliar para manejar singular y plural correctamente
function formatearNombrePresa(cantidad, tipo) {
    const diccionario = {
        "Manijas": { s: "Manija", p: "Manijas" },
        "Apliques": { s: "Aplique", p: "Apliques" },
        "Regletas": { s: "Regleta", p: "Regletas" },
        "Romo": { s: "Romo", p: "Romos" },
        "Bidedo": { s: "Bidedo", p: "Bidedos" },
        "Micro toma": { s: "Micro toma", p: "Micro tomas" },
        "Moneda": { s: "Moneda", p: "Monedas" },
        "Manija Grande": { s: "Manija Grande", p: "Manijas Grandes" },
        "Regleta Buena": { s: "Regleta Buena", p: "Regletas Buenas" }
    };

    // Si existe en el diccionario, devolvemos la forma correcta
    if (diccionario[tipo]) {
        return cantidad === 1 ? diccionario[tipo].s : diccionario[tipo].p;
    }
    // Fallback por si acaso (no debería usarse con la config actual)
    return tipo;
}

function generarVia() {
    const playerName = document.getElementById('player-name').value;
    if (!playerName.trim()) {
        alert("¡Por favor, escribe tu nombre de escalador antes de empezar!");
        return;
    }

    const selectedLevel = parseInt(document.getElementById('level').value);
    const config = LEVEL_CONFIG[selectedLevel];

    if (!config) return;

    // Selecciones aleatorias
    const sector = config.sectors[Math.floor(Math.random() * config.sectors.length)];
    const type = config.types[Math.floor(Math.random() * config.types.length)];
    
    // Guardar puntos potenciales de esta vía
    currentRoutePoints = config.points;

    // 1. Definir INICIO (1 o 2 tomas)
    const startCount = Math.floor(Math.random() * 2) + 1; // Genera 1 o 2
    const holdTypes = Object.keys(config.hold_distribution);
    const startType = holdTypes[Math.floor(Math.random() * holdTypes.length)];
    const startText = formatearNombrePresa(startCount, startType);

    // 2. Definir DESARROLLO (Presas intermedias)
    let middleHolds = [];
    for (const [holdType, range] of Object.entries(config.hold_distribution)) {
        const min = range[0];
        const max = range[1];
        // Número aleatorio entre min y max
        const count = Math.floor(Math.random() * (max - min + 1)) + min;
        
        if (count > 0) {
            const holdText = formatearNombrePresa(count, holdType);
            middleHolds.push(`${count} ${holdText}`);
        }
    }
    // Mezclar las presas intermedias
    middleHolds.sort(() => Math.random() - 0.5);

    // 3. Definir TOP (1 o 2 tomas)
    const topCount = Math.floor(Math.random() * 2) + 1; // Genera 1 o 2
    
    // Seleccionar tipo de top aleatorio de la lista
    const topType = config.top_hold[Math.floor(Math.random() * config.top_hold.length)];
    const topText = formatearNombrePresa(topCount, topType);

    // Actualizar el HTML
    document.getElementById('route-title').innerText = config.name;
    document.getElementById('route-sector').innerText = sector;
    document.getElementById('route-type').innerText = type;

    const holdsList = document.getElementById('holds-list');
    holdsList.innerHTML = ''; // Limpiar lista anterior

    // A. Agregar INICIO al HTML (Con borde verde para distinguir)
    const liStart = document.createElement('li');
    liStart.style.borderLeft = "5px solid #66bb6a"; 
    liStart.innerHTML = `🚀 INICIO: ${startCount} ${startText}`;
    holdsList.appendChild(liStart);

    // B. Agregar elementos intermedios
    middleHolds.forEach(hold => {
        const li = document.createElement('li');
        li.innerHTML = `🪨 ${hold}`;
        holdsList.appendChild(li);
    });

    // C. Agregar el TOP al HTML
    const liTop = document.createElement('li');
    liTop.className = 'top-hold';
    liTop.innerHTML = `🏁 TOP: ${topCount} ${topText}`;
    holdsList.appendChild(liTop);

    // Mostrar botones de acción nuevamente (por si estaban ocultos)
    document.getElementById('action-buttons').style.display = 'block';

    // Mostrar la tarjeta de resultados
    document.getElementById('result-card').style.display = 'block';
}

function registrarResultado(exito) {
    const playerName = document.getElementById('player-name').value;
    
    if (exito) {
        totalScore += currentRoutePoints;
        alert(`¡Excelente ${playerName}! Has sumado ${currentRoutePoints} puntos.`);
    } else {
        alert(`¡No pasa nada ${playerName}! Lo importante es intentarlo. ¡A por la siguiente!`);
    }

    // Actualizar marcador y ocultar botones para no sumar doble
    document.getElementById('score-board').innerText = `Puntos Totales de ${playerName}: ${totalScore}`;
    document.getElementById('action-buttons').style.display = 'none';
}