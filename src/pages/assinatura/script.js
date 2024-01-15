var modoAtual = 'T'; // Modo padrão é "T"
var canvas = document.getElementById('signature-canvas');
var context = canvas.getContext('2d');
var textInput = document.getElementById('text-input');

function changeMode(novoModo) {
  if (novoModo !== modoAtual) {
    // Limpa o canvas quando o modo muda
    clearDrawing();
    // Atualiza o modo atual
    modoAtual = novoModo;
    // Adiciona a lógica adicional para mudar entre os modos, se necessário
    if (modoAtual === 'T') {
      // Lógica para o modo "T"
      showTextInput();
    } else if (modoAtual === 'D') {
      // Lógica para o modo "D"
      hideTextInput();
    }
    updateButtonStyles(modoAtual);
  }
}

function showTextInput() {
  // Exibe o elemento de entrada para texto
  textInput.classList.remove('hidden');
  canvas.style.display = 'none';

  // Define o tamanho do elemento de entrada igual ao do canvas
  textInput.style.width = canvas.width + 'px';
  textInput.style.height = canvas.height + 'px';
}

function hideTextInput() {
  // Oculta o elemento de entrada para texto
  textInput.classList.add('hidden');
  canvas.style.display = 'block';
}

document.addEventListener('keydown', function (event) {
  if (modoAtual === 'T') {
    // Adicione a lógica para processar a entrada de teclado no modo "T"
    // Exemplo: Adicione o caractere digitado ao canvas
    drawText(event.key);
  }
});

function drawText(texto) {
  // Configurações para o texto
  context.font = '20px Arial';
  context.fillStyle = 'black';
  cont
  // Posiciona o texto no centro do canvas
  var centerX = canvas.width / 2;
  var centerY = canvas.height / 2;
  var textWidth = context.measureText(texto).width;

  // Limpa o canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Desenha o texto no canvas
  context.fillText(texto, centerX - textWidth / 2, centerY);
}

function updateButtonStyles(modo) {
  var buttons = document.querySelectorAll('.icons a[href="#"]');
  buttons.forEach(button => {
    if (button.textContent === modo) {
      button.classList.add('selected');
    } else {
      button.classList.remove('selected');
    }
  });
}
document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("signature-canvas");
    const context = canvas.getContext("2d");
    const paths = [];
    let isDrawing = false;

    function startDrawing(e) {
        isDrawing = true;
        paths.push([]);
        draw(e);
    }

    function stopDrawing() {
        isDrawing = false;
    }

    function draw(e) {
        if (!isDrawing) return;

        const currentPath = paths[paths.length - 1];

        context.lineWidth = 2;
        context.lineCap = "round";
        context.strokeStyle = "#000";

        currentPath.push({ x: e.clientX - canvas.getBoundingClientRect().left, y: e.clientY - canvas.getBoundingClientRect().top });

        context.clearRect(0, 0, canvas.width, canvas.height);

        paths.forEach(path => {
            context.beginPath();
            context.moveTo(path[0].x, path[0].y);

            path.forEach(point => {
                context.lineTo(point.x, point.y);
            });

            context.stroke();
        });
    }

    window.undoDrawing = function() {
        if (paths.length > 0) {
            paths.pop();
            context.clearRect(0, 0, canvas.width, canvas.height);

            paths.forEach(path => {
                context.beginPath();
                context.moveTo(path[0].x, path[0].y);

                path.forEach(point => {
                    context.lineTo(point.x, point.y);
                });

                context.stroke();
            });
        }
    };



    window.downloadDrawing = function() {
        if (paths.length > 0) {
            const pdfElement = document.getElementById("signature-canvas");
            html2pdf(pdfElement, { filename: 'assinatura.pdf' });
        } else {
            alert("Nenhum desenho para baixar.");
        }
        
    };

    window.clearDrawing = function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        paths.length = 0;
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseleave", stopDrawing);
});