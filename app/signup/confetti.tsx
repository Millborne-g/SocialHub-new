
const Confetti = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const confettisRef = useRef<Confetti[]>([]);

  const confettiColors = [
    '#f44336',
    '#e91e63',
    '#9c27b0',
    '#673ab7',
    '#3f51b5',
    '#2196f3',
    '#03a9f4',
    '#00bcd4',
    '#009688',
    '#4caf50',
    '#8bc34a',
    '#cddc39',
    '#ffeb3b',
    '#ffc107',
    '#ff9800',
    '#ff5722',
    '#795548'
  ];

  const confettiShapes = ['circle', 'square', 'triangle', 'heart'];

  class Confetti {
    color: string;
    shape: string;
    size: number;
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    rotation: number;
    rotationSpeed: number;

    constructor() {
      this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      this.shape = confettiShapes[Math.floor(Math.random() * confettiShapes.length)];
      this.size = Math.random() * 20 + 10;
      this.x = Math.random() * window.innerWidth;
      this.y = -this.size;
      this.velocityX = Math.random() * 4 - 2;
      this.velocityY = Math.random() * 2 + 2;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 4 - 2;
    }

    update() {
      this.x += this.velocityX;
      this.y += this.velocityY;
      this.rotation += this.rotationSpeed;

      if (this.x > window.innerWidth + this.size) {
        this.x = -this.size;
      } else if (this.x < -this.size) {
        this.x = window.innerWidth + this.size;
      }

      if (this.y > window.innerHeight + this.size) {
        this.y = -this.size;
      }
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.save();
      ctx.fillStyle = this.color;
      ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
      ctx.rotate((this.rotation * Math.PI) / 180);
      switch (this.shape) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, this.size / 2, 0, 2 * Math.PI);
          ctx.fill();
          break;
        case 'square':
          ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
          break;
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(0, -this.size / 2);
          ctx.lineTo(this.size / 2, this.size / 2);
          ctx.lineTo(-this.size / 2, this.size / 2);
          ctx.fill();
          break;
        case 'heart':
          ctx.beginPath();
          ctx.moveTo(0, -this.size / 4);
          ctx.quadraticCurveTo(this.size / 2, -this.size / 2, 0, this.size / 2);
          ctx.quadraticCurveTo(-this.size / 2, -this.size / 2, 0, -this.size / 4);
          ctx.fill();
          break;
      }
      ctx.restore();
    }
  }

  const createConfetti = (amount: number) => {
    for (let i = 0; i < amount; i++) {
      const confetti = new Confetti();
      confettisRef.current.push(confetti);
    }
  };

  const animateConfetti = () => {
    if (!ctxRef.current) return;

    ctxRef.current.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = 0; i < confettisRef.current.length; i++) {
      const confetti = confettisRef.current[i];
      confetti.update();

      // remove older confetti if the number of confettis is greater than maxConfettis
      while (confettisRef.current.length > maxConfettis) {
        confettisRef.current.shift();
      }

      // remove confetti that has gone off screen
      if (confetti.y > window.innerHeight + confetti.size) {
        confettisRef.current.splice(i, 1);
        i--;
        continue;
      }

      confetti.draw(ctxRef.current);
    }

    requestAnimationFrame(animateConfetti);
  };

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctxRef.current = ctx;
        createConfetti(50);
        animateConfetti();
      }
    }
  }, []);

  const addConfetti = () => {
    var audio = new Audio('http://soundbible.com/grab.php?id=1522&type=mp3');
    audio.volume = 0.1;
    audio.play();
    setTimeout(() => {
      if (ctxRef.current) {
        ctxRef.current.clearRect(0, 0, window.innerWidth, window.innerHeight);
        createConfetti(Math.floor(Math.random() * 50) + 50);
      }
    }, 500);
  };

  const clearConfetti = () => {
    confettisRef.current.splice(0, confettisRef.current.length);
    animateConfetti();
  };
