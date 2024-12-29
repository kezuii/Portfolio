import { useEffect, useRef } from 'react';

interface RippleEffectProps {
  imageUrl: string;
}

const RippleEffect: React.FC<RippleEffectProps> = ({ imageUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const scaleFactor = 1;
      const parent = canvas.parentElement;
      if (!parent) return;

      canvas.width = parent.clientWidth / scaleFactor;
      canvas.height = parent.clientHeight / scaleFactor;
      canvas.style.width = `${parent.clientWidth}px`;
      canvas.style.height = `${parent.clientHeight}px`;
    };

    const drawImageToCover = (img: HTMLImageElement) => {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      const imageAspectRatio = img.width / img.height;
      const canvasAspectRatio = canvasWidth / canvasHeight;

      let renderWidth, renderHeight, offsetX, offsetY;

      if (imageAspectRatio > canvasAspectRatio) {
        // Image is wider than the canvas; crop horizontally
        renderWidth = canvasHeight * imageAspectRatio;
        renderHeight = canvasHeight;
        offsetX = (canvasWidth - renderWidth) / 2;
        offsetY = 0;
      } else {
        // Image is taller than the canvas; crop vertically
        renderWidth = canvasWidth;
        renderHeight = canvasWidth / imageAspectRatio;
        offsetX = 0;
        offsetY = (canvasHeight - renderHeight) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
    };

    resizeCanvas();

    const width = canvas.width;
    const height = canvas.height;
    const halfWidth = width >> 1;
    const halfHeight = height >> 1;
    const size = width * (height + 2) * 2;
    const delay = 40; // Lower values make the animation run faster
    const riprad = 3; // Radius of disturbance; increase for larger ripples

    let oldind = width;
    let newind = width * (height + 3);
    const ripplemap = Array(size).fill(0);
    const lastMap = Array(size).fill(0);

    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      drawImageToCover(image);

      const texture = ctx.getImageData(0, 0, width, height);
      const ripple = ctx.getImageData(0, 0, width, height);

      const disturb = (dx: number, dy: number) => {
        dx <<= 0;
        dy <<= 0;

        for (let j = dy - riprad; j < dy + riprad; j++) {
          for (let k = dx - riprad; k < dx + riprad; k++) {
            ripplemap[oldind + j * width + k] += 100; // Adjust value for ripple strength (lower for subtler effect)
          }
        }
      };

      const newFrame = () => {
        let a: number, b: number, data: number, curPixel: number, newPixel: number;

        const temp = oldind;
        oldind = newind;
        newind = temp;

        let i = 0;

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const mapIndex = oldind + i;
            const newIndex = newind + i;

            data =
              (ripplemap[mapIndex - width] +
                ripplemap[mapIndex + width] +
                ripplemap[mapIndex - 1] +
                ripplemap[mapIndex + 1]) >>
              1;

            data -= ripplemap[newIndex];
            data -= data >> 4; // Controls the damping of ripples (higher values dampen faster)

            ripplemap[newIndex] = data;

            data = 1024 - data;
            const oldData = lastMap[i];
            lastMap[i] = data;

            if (oldData !== data) {
              a = (((x - halfWidth) * data) / 1024 + halfWidth) | 0;
              b = (((y - halfHeight) * data) / 1024 + halfHeight) | 0;

              if (a >= width) a = width - 1;
              if (a < 0) a = 0;
              if (b >= height) b = height - 1;
              if (b < 0) b = 0;

              newPixel = (a + b * width) * 4;
              curPixel = i * 4;

              ripple.data[curPixel] = texture.data[newPixel];
              ripple.data[curPixel + 1] = texture.data[newPixel + 1];
              ripple.data[curPixel + 2] = texture.data[newPixel + 2];
            }

            i++;
          }
        }
      };

      const run = () => {
        newFrame();
        ctx.putImageData(ripple, 0, 0);
      };

      let lastMouseX: number | null = null;
      let lastMouseY: number | null = null;
      
      const addDisturbancePath = (startX: number, startY: number, endX: number, endY: number) => {
        const distance = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
        const steps = Math.ceil(distance / 5); // Adjust this value for smoother or denser ripples
      
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const x = startX + t * (endX - startX);
          const y = startY + t * (endY - startY);
          disturb(x, y);
        }
      };
      
      const handleMouseMove = (evt: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = evt.clientX - rect.left;
        const mouseY = evt.clientY - rect.top;
      
        if (lastMouseX !== null && lastMouseY !== null) {
          addDisturbancePath(lastMouseX, lastMouseY, mouseX, mouseY);
        }
      
        lastMouseX = mouseX;
        lastMouseY = mouseY;
      };
      
      // Reset last mouse position on mouseout
      canvas.addEventListener('mouseout', () => {
        lastMouseX = null;
        lastMouseY = null;
      });

      canvas.addEventListener('mousemove', handleMouseMove);
      const intervalId = setInterval(run, delay);
      const randomIntervalId = setInterval(() => {
        disturb(Math.random() * width, Math.random() * height);
      }, 700);

      return () => {
        canvas.removeEventListener('mousemove', handleMouseMove);
        clearInterval(intervalId);
        clearInterval(randomIntervalId);
      };
    };

    window.addEventListener('resize', () => {
      resizeCanvas();
      if (image.complete) {
        drawImageToCover(image);
      }
    });
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [imageUrl]);

  const canvasStyle = {
    display: 'block',
    width: '100%',
    height: '100%',
  };

  return <canvas ref={canvasRef} style={canvasStyle} />;
};

export default RippleEffect;
