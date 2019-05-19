window.onload = function() {

    const songNameOnWindow = document.getElementById('songName');
    const authorNameOnWindow = document.getElementById('authorName');
    const albumOnWindow = document.getElementById('album');

    const canvas = document.getElementById('visualizer');
    const canvasContext = canvas.getContext('2d');

    const audioCtx = new AudioContext();
    const audio = new Audio();
    const audioSrc = audioCtx.createMediaElementSource(audio);
    const analyser = audioCtx.createAnalyser();

    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight * 0.8;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    const audioTab = [
        {name: 'Song 1', author: 'Author1',src:'music/song1.mp3',album: 'image/song1.jpg'},
        {name: 'Song 2', author: 'Author2',src:'music/song2.mp3',album: 'image/song2.jpg'},
        {name: 'Song 3', author: 'Author3',src:'music/song3.mp3',album: 'image/song3.jpg'}
    ];

    let currentMode = 0;
    let currentlyPlayed = 0;
    let analyzeStarted = false;

    document.getElementById('play').addEventListener('click',function(){
        console.log(audio.length);
        console.log(audio.paused);

        if(audio.played.length === 0 || audio.paused){
            document.getElementById('play').innerHTML = '<i class="fas fa-pause"></i>';  
            if(analyzeStarted)
                audio.play();
            else 
                analyzeMusic();
        }
        else{
            document.getElementById('play').innerHTML = '<i class="fas fa-play"></i>';
            audio.pause();
        }

    });

    document.getElementById('nextSong').addEventListener('click',nextSong);
    document.getElementById('previousSong').addEventListener('click',previousSong);
    canvas.addEventListener('click',function(){
        if(currentMode + 1 > 2 )
            currentMode = 0
        else
            currentMode ++;
    })

    audio.addEventListener('ended',function(){
        currentlyPlayed++;
        audio.src = audioTab[currentlyPlayed].src;
        audio.pause();
        audio.load();
        changeNameOfFile();
        audio.play();
        //analyzeMusic();
    });

    function nextSong(){
        if(currentlyPlayed + 1 >= audioTab.length)
            currentlyPlayed = 0;
        else
            currentlyPlayed++;
        
        document.getElementById('play').innerHTML = '<i class="fas fa-pause"></i>';  
        audio.src = audioTab[currentlyPlayed].src;
        audio.pause();
        audio.load();
        changeNameOfFile();
        audio.play();
        //analyzeMusic();
    }

    function previousSong(){

        if(currentlyPlayed === 0)
            currentlyPlayed = audioTab.length-1;
        else
            currentlyPlayed--;

        document.getElementById('play').innerHTML = '<i class="fas fa-pause"></i>';  
        audio.src = audioTab[currentlyPlayed].src;
        audio.pause();
        audio.load();
        changeNameOfFile();
        audio.play();
        //analyzeMusic();
    }

    function analyzeMusic(){
        changeNameOfFile();
        analyzeStarted = true;
        audio.src = audioTab[currentlyPlayed].src;
        const analyser = audioCtx.createAnalyser();

        analyser.connect(audioCtx.destination);
        audioSrc.connect(analyser);

        analyser.fftSize = 512; 
        const bufferLength = analyser.frequencyBinCount;
        console.log(bufferLength);
        let frequencyData = new Uint8Array(bufferLength);
    
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
            drawTime(audio.currentTime,audio.duration);
    }
        audio.play();
        renderFrame();
    }

    function drawSingleFrame(dataArray){
        let bars = 100;
        let barHeight = 0;
        let barWidth = 15;
        let x = 0;

        canvasContext.fillStyle = "rgb(0,0,0)"; 
        canvasContext.fillRect(0, 0, WIDTH, HEIGHT);
        
        for (let i = 0; i < bars; i++) {
            barHeight = (dataArray[i] * 1.6 );
            canvasContext.fillStyle = `rgb(255,255,255)`;
            canvasContext.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
            x += 20;
        }
    }

    function drawSingleAlternative(dataArray){
        let bars = 128;
        let x = 1;
        let size = 1;
        let color;
        canvasContext.fillStyle = "rgb(0,0,0)"; 
        canvasContext.fillRect(0, 0, WIDTH, HEIGHT);

        for (let i = 0; i < bars; i++) {
            x += 15;
            barHeight = (dataArray[i] * 2);
            size = dataArray[i] / 25;

            color = `rgb(0,100,${dataArray[i]})`;
            canvasContext.beginPath();
            canvasContext.arc(x, HEIGHT -  barHeight, size, 0, Math.PI * 2, false); // <-- add the arc to the path
            canvasContext.fillStyle = color;
            canvasContext.fill(); 

            
        }
    }

    function drawCircleAnimation(dataArray){
        let balls = 64;
        startX = WIDTH/2;
        startY = HEIGHT/2;

        canvasContext.fillStyle = "rgb(0,0,0)"; 
        canvasContext.fillRect(0, 0, WIDTH, HEIGHT);
        
        for (let i = 0; i < balls; i++) {
            size = dataArray[i] * 1.2;

            color = `rgb(0,100,${dataArray[i]})`;
            canvasContext.beginPath(); 
            canvasContext.arc(startX, startY, size, 0, Math.PI * 2, false); 
            canvasContext.strokeStyle = color;
            canvasContext.stroke(); 

        }
    }

    function drawTime(currentTime, duration){
        let color = 'rgb(211,211,211)'; 
        canvasContext.fillStyle = color;
        canvasContext.fillRect(0, HEIGHT-20, WIDTH, 20);
        color = 'rgb(0,191,255)';
        canvasContext.fillStyle = color;
        let tempWidth = currentTime/duration * WIDTH;
        canvasContext.fillRect(0, HEIGHT-20, tempWidth, 20);
    }

    function changeNameOfFile(){
        songNameOnWindow.innerHTML = audioTab[currentlyPlayed].name;
        authorNameOnWindow.innerHTML = audioTab[currentlyPlayed].author;
        albumOnWindow.src = audioTab[currentlyPlayed].album;
    }
    
}