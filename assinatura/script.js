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