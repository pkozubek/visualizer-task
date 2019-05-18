window.onload = function() {
    var canvas = document.getElementById('visualizer');

    document.getElementById('play').addEventListener('click',analyzeMusic);

    function analyzeMusic(){

        var audio = document.getElementById('song');
        var audioCtx = new AudioContext();
        var audioSrc = audioCtx.createMediaElementSource(audio);
        var analyser = audioCtx.createAnalyser();

        audioSrc.connect(analyser);
        analyser.connect(audioCtx.destination);

        var frequencyData = new Uint8Array(analyser.frequencyBinCount);
    
        function renderFrame() {
            requestAnimationFrame(renderFrame);
            analyser.getByteFrequencyData(frequencyData);
            console.log(frequencyData);
        }

        audio.play();
        renderFrame();
        
    }
}