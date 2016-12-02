var Synf = function() {

    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    var context = new AudioContext();
    var that = this;

    this.numNotes = 88;
    this.autoTune = true;
    this.oscillatorType = 'sine';
    this.frequency = 440;

    amp = context.createGain();
    amp.gain.value = 0;

    oscillator = context.createOscillator();
    oscillator.frequency.value = this.frequency;
    oscillator.type = this.oscillatorType;
    oscillator.connect(amp);

    amp.connect(context.destination);

    oscillator.start(0);
    var mousedown = false;
    window.addEventListener("mousemove", function(e) {

        var perc = (e.pageX / window.innerWidth);

        var key = (that.numNotes - that.numNotes) / 2 + (that.numNotes * perc);
        if (that.autoTune) {
            key = Math.ceil(key);
        }
        var hz = Math.pow(2, ((key - 49) / 12)) * that.frequency;

        oscillator.frequency.value = hz;
        if (mousedown) {
            amp.gain.value = 1 - (e.pageY / window.innerHeight);
        }
    });

    window.addEventListener("mousedown", function(e) {
        oscillator.type = that.oscillatorType;
        mousedown = true;
        amp.gain.value = 1 - (e.pageY / window.innerHeight);
    });

    window.addEventListener("mouseup", function(e) {
        mousedown = false;
        amp.gain.value = 0;
    });

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    this.drawCanvas = function(){

        for (var i = 0; i < this.numNotes; i++) {
            var keyIndex = i % 12;
            var color = Math.random() * 0.05 + 0.9;
            if (keyIndex === 1 || keyIndex === 4 || keyIndex === 6 || keyIndex === 9 || keyIndex === 11) {
                color = Math.random() * 0.05 + 0.7;
            }
            color = Math.floor(color * 255);
            color = 'rgb(' + color + ',' + color + ',' + color + ')';
            ctx.fillStyle = color;
            ctx.fillRect(i * canvas.width / this.numNotes, 0, canvas.width / this.numNotes, canvas.height);
        }

        var grd = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grd.addColorStop(0, "rgba(255,255,255,0)");
        grd.addColorStop(1, "rgba(255,255,255,1)");

        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    this.drawCanvas();
};

var synf = new Synf();
var gui = new dat.GUI();

gui.add(synf, 'oscillatorType', [
    "sine",
    "square",
    "sawtooth",
    "triangle"
]);

gui.add(synf, 'autoTune');
gui.add(synf, 'frequency', 4, 440);

var controller = gui.add(synf, 'numNotes', 1, 88);

controller.onFinishChange(function(value) {
    synf.numNotes = value;
    synf.drawCanvas();
});