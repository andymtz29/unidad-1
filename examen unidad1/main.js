const Arbol = () => {
    let expresion = document.getElementById('expresion').value.trim();
    let advertenciaElem = document.getElementById('advertencia');
    advertenciaElem.style.display = 'none';

    if (!esExpresionValida(expresion)) {
        mostrarAdvertencia("Solo puedes ingresar números positivos, letras y operadores (+, -, *, /).");
        return;
    }

    document.getElementById('grafo').innerHTML = '';
    document.getElementById('lineas').innerHTML = '';
    document.getElementById('preorden').innerHTML = '';
    document.getElementById('inorden').innerHTML = '';
    document.getElementById('postorden').innerHTML = '';

    let arbol = construirArbol(expresion);

    if (!arbol) {
        mostrarAdvertencia("Error al construir el árbol de expresión.");
        return;
    }

    dibujarGrafo(arbol, 300, 150, 150);
    mostrarRecorridos(arbol);
}

const construirArbol = (expresion) => {
    const operadores = ['+', '-', '*', '/'];
    let nivelParentesis = 0;
    let operadorPrincipal = -1;
    let menorPrioridad = Infinity;

    const prioridades = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2
    };


    const removerParentesisInnecesarios = (expresion) => {
        if (expresion[0] === '(' && expresion[expresion.length - 1] === ')' && esBalanceado(expresion.substring(1, expresion.length - 1))) {
            return removerParentesisInnecesarios(expresion.substring(1, expresion.length - 1));
        }
        return expresion;
    }


    const esBalanceado = (expresion) => {
        let balance = 0;
        for (let i = 0; i < expresion.length; i++) {
            if (expresion[i] === '(') balance++;
            else if (expresion[i] === ')') balance--;
            if (balance < 0) return false;
        }
        return balance === 0;
    }

    expresion = removerParentesisInnecesarios(expresion);

    for (let i = expresion.length - 1; i >= 0; i--) {
        let caracter = expresion[i];

        if (caracter === ')') {
            nivelParentesis++;
        } else if (caracter === '(') {
            nivelParentesis--;
        } else if (operadores.includes(caracter) && nivelParentesis === 0) {
            let prioridadActual = prioridades[caracter];
            if (prioridadActual <= menorPrioridad) {
                menorPrioridad = prioridadActual;
                operadorPrincipal = i;
            }
        }
    }

    if (operadorPrincipal !== -1) {
        let izquierda = expresion.substring(0, operadorPrincipal).trim();
        let derecha = expresion.substring(operadorPrincipal + 1).trim();
        let operador = expresion[operadorPrincipal];

        return {
            valor: operador,
            izquierda: construirArbol(izquierda),
            derecha: construirArbol(derecha)
        };
    }


    return { valor: expresion };
}

const esExpresionValida = (expresion) => {
    let regex = /^[a-zA-Z\d+\-*/().]+$/; 
    return regex.test(expresion);
}

const mostrarAdvertencia = (mensaje) => {
    let advertenciaElem = document.getElementById('advertencia');
    advertenciaElem.textContent = mensaje; 
    advertenciaElem.style.display = 'block';
}

const dibujarGrafo = (nodo, x, y, offset) => {
    let contenedor = document.getElementById('grafo');
    let lineasContenedor = document.getElementById('lineas');

    let nodoElemento = document.createElement('div');
    nodoElemento.className = 'grafo-nodo';
    nodoElemento.textContent = nodo.valor;  
    nodoElemento.style.left = x + 'px';     
    nodoElemento.style.top = y + 'px';      
    contenedor.appendChild(nodoElemento);

    if (nodo.izquierda) {
        let nuevaX = x - offset;
        let nuevaY = y + 100;
        dibujarLinea(x + 20, y + 20, nuevaX + 20, nuevaY + 20, lineasContenedor); 
        dibujarGrafo(nodo.izquierda, nuevaX, nuevaY, offset / 1.5);
    }

    if (nodo.derecha) {
        let nuevaX = x + offset;
        let nuevaY = y + 100;
        dibujarLinea(x + 20, y + 20, nuevaX + 20, nuevaY + 20, lineasContenedor); 
        dibujarGrafo(nodo.derecha, nuevaX, nuevaY, offset / 1.5);
    }
}

const dibujarLinea = (x1, y1, x2, y2, contenedor) => {
    let linea = document.createElement('div');
    linea.className = 'linea';
    let angulo = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
    let longitud = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    linea.style.width = longitud + 'px';
    linea.style.height = '3px'; 
    linea.style.position = 'absolute';
    linea.style.top = `${y1}px`;
    linea.style.left = `${x1}px`;
    linea.style.transform = `rotate(${angulo}deg)`;
    linea.style.transformOrigin = '0 0'; 
    contenedor.appendChild(linea);
}

const eliminarArbol = () => {
    document.getElementById('expresion').value = ''; 
    document.getElementById('grafo').innerHTML = ''; 
    document.getElementById('lineas').innerHTML = '';
    document.getElementById('preorden').innerHTML = '';
    document.getElementById('inorden').innerHTML = '';
    document.getElementById('postorden').innerHTML = '';
    document.getElementById('advertencia').style.display = 'none'; 
}

// Funciones para los recorridos
const preorden = (nodo) => {
    if (!nodo) return [];
    return [nodo.valor].concat(preorden(nodo.izquierda)).concat(preorden(nodo.derecha));
}

const inorden = (nodo) => {
    if (!nodo) return [];
    return inorden(nodo.izquierda).concat([nodo.valor]).concat(inorden(nodo.derecha));
}

const postorden = (nodo) => {
    if (!nodo) return [];
    return postorden(nodo.izquierda).concat(postorden(nodo.derecha)).concat([nodo.valor]);
}

const mostrarRecorridos = (arbol) => {
    let pre = preorden(arbol).join(', ');
    let ino = inorden(arbol).join(', ');
    let post = postorden(arbol).join(', ');

    document.getElementById('preorden').textContent = `Preorden: ${pre}`;
    document.getElementById('inorden').textContent = `Inorden: ${ino}`;
    document.getElementById('postorden').textContent = `Postorden: ${post}`;
}
document.getElementById('btnPreorden').addEventListener('click', () => {
    mostrarRecorrido('preorden');
});

document.getElementById('btnInorden').addEventListener('click', () => {
    mostrarRecorrido('inorden');
});

document.getElementById('btnPostorden').addEventListener('click', () => {
    mostrarRecorrido('postorden');
});

const mostrarRecorrido = (tipo) => {
    let expresion = document.getElementById('expresion').value.trim();
    let arbol = construirArbol(expresion);

    if (!arbol) {
        mostrarAdvertencia("Error al construir el árbol de expresión.");
        return;
    }

    let recorrido;
    switch (tipo) {
        case 'preorden':
            recorrido = preorden(arbol).join(', ');
            document.getElementById('preorden').textContent = `Preorden: ${recorrido}`;
            break;
        case 'inorden':
            recorrido = inorden(arbol).join(', ');
            document.getElementById('inorden').textContent = `Inorden: ${recorrido}`;
            break;
        case 'postorden':
            recorrido = postorden(arbol).join(', ');
            document.getElementById('postorden').textContent = `Postorden: ${recorrido}`;
            break;
    }
}
