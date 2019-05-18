window.onload = function() {

    const canvas = document.getElementById('visualizer');
    const canvasContext = canvas.getContext('2d');

    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    const audioTab = ['music/song1.mp3','music/song2.mp3','music/song3.mp3'];
    const audio = new Audio();
    
    let currentMode = 0;
    let currentlyPlayed = 2;
    const songNameOnWindow = document.getElementById('songName');

    document.getElementById('play').addEventListener('click',analyzeMusic);
    document.getElementById('nextSong').addEventListener('click',nextSong);
    document.getElementById('previousSong').addEventListener('click',previousSong);
    canvas.addEventListener('click',function(){
        if(currentMode + 1 > 2 )
            currentMode = 0
        else
            currentMode ++;
    })

    var audioCtx = new AudioContext();
    var audioSrc = audioCtx.createMediaElementSource(audio);
    var analyser = audioCtx.createAnalyser();


    audio.addEventListener('ended',function(){

        currentlyPlayed++;
        audio.src = audioTab[currentlyPlayed];
        audio.pause();
        audio.load();
        //audio.play();
        analyzeMusic();
    });

    function nextSong(){

        if(currentlyPlayed + 1 >= audioTab.length)
            currentlyPlayed = 0;
        else
            currentlyPlayed++;
        
        audio.src = audioTab[currentlyPlayed];
        audio.pause();
        audio.load();
        //audio.play();
        analyzeMusic();
    }

    function previousSong(){

        if(currentlyPlayed === 0)
            currentlyPlayed = audioTab.length-1;
        else
            currentlyPlayed--;

        audio.src = audioTab[currentlyPlayed];
        audio.pause();
        audio.load();
        audio.play();
    }

    function analyzeMusic(){
        changeNameOfFile();
        audio.src = audioTab[currentlyPlayed];
        var analyser = audioCtx.createAnalyser();

        analyser.connect(audioCtx.destination);
        audioSrc.connect(analyser);

        analyser.fftSize = 512; 
        const bufferLength = analyser.frequencyBinCount;
        console.log(bufferLength);
        var frequencyData = new Uint8Array(bufferLength);
    
        function renderFrame() {
            requestAnimationFrame(renderFrame);
            analyser.getByteFrequencyData(frequencyData);
            switch(currentMode){
                case(0):
                    drawSingleFrame(frequencyData);
                    break;
                case(1):
                    drawCircleAnimation(frequencyData);
                    break;
                case(2):
                    drawSingleAlternative(frequencyData);
                    break;
            }
    }
        audio.play();
        renderFrame();
    }

    function drawSingleFrame(dataArray){
        let bars = 128;
        let barHeight = 0;
        let barWidth = 5;
        let x = 1;

        canvasContext.fillStyle = "rgb(0,0,0)"; 
        canvasContext.fillRect(0, 0, WIDTH, HEIGHT);
        
        for (let i = 0; i < bars; i++) {
            x += 6;
            barHeight = (dataArray[i] * 1.2 );
            canvasContext.fillStyle = `rgb(255,255,255)`;
            canvasContext.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
        }
    }

    function drawSingleAlternative(dataArray){
        let bars = 128;
        let barHeight = 0;
        let barWidth = 1;
        let x = 1;
        var circle = new Path2D();
        let size = 1;
        let r,g,b;
        let color;
        canvasContext.fillStyle = "rgb(0,0,0)"; 
        canvasContext.fillRect(0, 0, WIDTH, HEIGHT);

        for (let i = 0; i < bars; i++) {
            x += 15;
            barHeight = (dataArray[i] * 2);
            size = dataArray[i] / 25;

            //circle.moveTo(x, HEIGHT - barHeight);
            circle.arc(x, HEIGHT - barHeight, size, 0, 2 * Math.PI);

            color = `rgb(${dataArray[i]},${dataArray[i]},255)`
            canvasContext.fillStyle = color;
            canvasContext.fill(circle);
            
        }
    }

    function drawCircleAnimation(dataArray){
        let balls = 64;
        startX = WIDTH/2;
        startY = HEIGHT/2;

        canvasContext.fillStyle = "rgb(0,0,0)"; 
        var circle = new Path2D();
        canvasContext.fillRect(0, 0, WIDTH, HEIGHT);
        
        for (let i = 0; i < balls; i++) {
            size = dataArray[i] * 1.2;

            color = `rgb(255,255,${dataArray[i]})`;
            canvasContext.beginPath(); // <-- start a path
            canvasContext.arc(startX, startY, size, 0, Math.PI * 2, false); // <-- add the arc to the path
            canvasContext.strokeStyle = color;
            canvasContext.stroke(); // <-- draw the arc
        }
    }

    function changeNameOfFile(){
        songNameOnWindow.innerHTML = "Currently playing: " + audioTab[currentlyPlayed];
    }
    
}