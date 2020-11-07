class Renderer {
  constructor(scale) {
    this.scale = scale;

    this.width = 64;
    this.height = 32;

    this.canvas = document.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.canvas.height = this.height * this.scale;
    this.canvas.width = this.width * this.scale;

    this.display = new Array(this.width * this.height);
  }

  setPixel(x, y) {
    if (x < 0) {
      x += this.width;
    } else if (x > this.width) {
      x -= this.width;
    }

    if (y < 0) {
      y += this.height;
    } else if (y > this.height) {
      y - this.height;
    }

    let pixelLocation = x + y * this.width;

    this.display[pixelLocation] ^= 1;

    return !this.display[pixelLocation];
  }

  clear() {
    this.display = new Array(this.width * this.height);
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.width * this.height; i++) {
      let x = (i % this.width) * this.scale;
      let y = Math.floor(i / this.width) * this.scale;

      if (this.display[i]) {
        this.ctx.fillStyle = "#33ff66";
        this.ctx.fillRect(x, y, this.scale, this.scale);
      }
    }
  }
}

export default Renderer;
