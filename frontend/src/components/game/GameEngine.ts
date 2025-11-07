import Phaser from "phaser";

export class GameScene extends Phaser.Scene {
  private bullets!: Phaser.Physics.Arcade.Group;
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: any;
  private lastFired = 0;
  private walls: Phaser.GameObjects.Rectangle[] = [];

  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    this.load.image(
      "tank",
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iNCIgZmlsbD0iIzRhZGU4MCIvPgo8L3N2Zz4K"
    );
    this.load.image(
      "bullet",
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI4IiB2aWV3Qm94PSIwIDAgOCA4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8Y2lyY2xlIGN4PSI0IiBjeT0iNCIgcj0iNCIgZmlsbD0iI2ZmZmZmZiIvPgo8L3N2Zz4K"
    );
  }

  create() {
    this.bullets = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      maxSize: 200,
      runChildUpdate: false,
    });

    this.player = this.physics.add
      .sprite(200, 300, "tank")
      .setCollideWorldBounds(true)
      .setDrag(800, 800)
      .setMaxVelocity(300, 300);

    // ===== Walls =====
    this.buildBorderWalls(20, 1400, 800);

    // --- Complex maze-like walls ---
    const segments: Array<[number, number, number, number, number?]> = [
      // main corridor
      [350, 150, 500, 20],
      [350, 650, 500, 20],
      [250, 250, 20, 300],
      [1050, 250, 20, 300],
      [700, 330, 200, 20],
      [700, 470, 200, 20],
      [520, 400, 20, 160],
      [880, 400, 20, 160],

      // corners and smaller passages
      [200, 120, 160, 20],
      [1200, 680, 160, 20],
      [400, 220, 120, 20],
      [1000, 580, 120, 20],
      [300, 550, 80, 20],
      [1100, 200, 80, 20],
      [700, 600, 400, 20],
      [700, 200, 400, 20],

      // vertical bars
      [500, 400, 20, 300],
      [900, 400, 20, 300],
      [700, 400, 20, 400],

      // decorative small blocks
      [600, 120, 60, 20],
      [800, 120, 60, 20],
      [600, 680, 60, 20],
      [800, 680, 60, 20],
      [100, 400, 20, 150],
      [1300, 400, 20, 150],
    ];
    segments.forEach(([x, y, w, h, c]) =>
      this.buildWall(x, y, w, h, c ?? 0xff6b6b)
    );

    // Colliders
    this.physics.add.collider(this.player, this.walls);

    this.physics.add.collider(
      this.bullets,
      this.walls,
      (obj1, obj2) => {
        const o1 = obj1 as any;
        const o2 = obj2 as any;
        const bullet =
          (o1.texture?.key === "bullet" && o1) ||
          (o2.texture?.key === "bullet" && o2) ||
          null;
        if (!bullet) return;
        if (typeof bullet.disableBody === "function")
          bullet.disableBody(true, true);
        else if (bullet.body) {
          this.bullets.killAndHide(bullet);
          bullet.body.enable = false;
        }
      },
      undefined,
      this
    );

    // world-bound bullet removal
    this.physics.world.on("worldbounds", (body: Phaser.Physics.Arcade.Body) => {
      const go = body.gameObject as Phaser.Physics.Arcade.Sprite | null;
      if (go && go.active && go.texture?.key === "bullet")
        go.disableBody(true, true);
    });

    // input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = this.input.keyboard!.addKeys("W,A,S,D");
    this.input.on("pointerdown", () => this.fireTowardPointer());
    this.input.keyboard!.on("keydown-SPACE", () => this.fireTowardPointer());
  }

  private buildWall(
    x: number,
    y: number,
    w: number,
    h: number,
    color: number = 0xff6b6b
  ) {
    const rect = this.add.rectangle(x, y, w, h, color);
    this.physics.add.existing(rect, true);
    (rect.body as Phaser.Physics.Arcade.StaticBody).updateFromGameObject();
    this.walls.push(rect);
    return rect;
  }

  private buildBorderWalls(thickness: number, width: number, height: number) {
    this.buildWall(width / 2, thickness / 2, width, thickness, 0x8e9aaf);
    this.buildWall(
      width / 2,
      height - thickness / 2,
      width,
      thickness,
      0x8e9aaf
    );
    this.buildWall(thickness / 2, height / 2, thickness, height, 0x8e9aaf);
    this.buildWall(
      width - thickness / 2,
      height / 2,
      thickness,
      height,
      0x8e9aaf
    );
  }

  private fireTowardPointer() {
    const now = this.time.now;
    if (now - this.lastFired < 150) return;

    const pointer = this.input.activePointer;
    const angle = Phaser.Math.Angle.Between(
      this.player.x,
      this.player.y,
      pointer.worldX,
      pointer.worldY
    );

    const muzzleOffset = 24;
    const sx = this.player.x + Math.cos(angle) * muzzleOffset;
    const sy = this.player.y + Math.sin(angle) * muzzleOffset;

    const bullet = this.bullets.get(
      sx,
      sy,
      "bullet"
    ) as Phaser.Physics.Arcade.Sprite | null;
    if (!bullet) return;

    bullet.enableBody(true, sx, sy, true, true);
    bullet.setRotation(angle);
    bullet.setCollideWorldBounds(true);
    (bullet.body as Phaser.Physics.Arcade.Body).onWorldBounds = true;

    const speed = 600;
    bullet.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

    this.lastFired = now;
  }

  update() {
    const speed = 220;
    let vx = 0,
      vy = 0;

    if (this.cursors.left.isDown || this.keys.A.isDown) vx -= speed;
    if (this.cursors.right.isDown || this.keys.D.isDown) vx += speed;
    if (this.cursors.up.isDown || this.keys.W.isDown) vy -= speed;
    if (this.cursors.down.isDown || this.keys.S.isDown) vy += speed;

    this.player.setVelocity(vx, vy);

    const p = this.input.activePointer;
    const angle = Phaser.Math.Angle.Between(
      this.player.x,
      this.player.y,
      p.worldX,
      p.worldY
    );
    this.player.setRotation(angle);
  }
}

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1400,
  height: 800,
  parent: "phaser-game",
  backgroundColor: "#1a1a2e",
  scene: GameScene,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
};
