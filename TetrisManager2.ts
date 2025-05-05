import * as hz from "horizon/core";

export class TetrisManager extends hz.Component<typeof TetrisManager> {
  static propsDefinition = {
    assetI: { type: hz.PropTypes.Asset },
    assetO: { type: hz.PropTypes.Asset },
    assetT: { type: hz.PropTypes.Asset },
    assetS: { type: hz.PropTypes.Asset },
    assetZ: { type: hz.PropTypes.Asset },
    assetJ: { type: hz.PropTypes.Asset },
    assetL: { type: hz.PropTypes.Asset },
  
    gridOrigin:   { type: hz.PropTypes.Entity },
    cellSize:     { type: hz.PropTypes.Number },
    rows:         { type: hz.PropTypes.Number },
    cols:         { type: hz.PropTypes.Number },
    fallInterval: { type: hz.PropTypes.Number },
  };
  

  private activePieceEntities: hz.Entity[] = [];
  private activeShapeMatrix: number[][] = [];
  private activeRow = 0;
  private activeCol = 0;
  private dropTimer = 0;

  async start() {
    // Spawn primera pieza
    await this.spawnNextPiece();
  }

  public async update(dt: number) {
    this.dropTimer += dt * 1000;
    if (this.dropTimer >= this.props.fallInterval!) {
      this.dropTimer = 0;
      await this.movePieceDown();
    }
  }

  private getTetrominoAssets(): hz.Asset[] {
    return [
      this.props.assetI!,
      this.props.assetO!,
      this.props.assetT!,
      this.props.assetS!,
      this.props.assetZ!,
      this.props.assetJ!,
      this.props.assetL!,
    ];
  }
  
  private async spawnNextPiece(): Promise<void> {
    // Elijo un asset aleatorio de tetrominoes
    const assets = this.getTetrominoAssets();
    const idx    = Math.floor(Math.random() * assets.length);
    const asset  = assets[idx];
    

    // SpawnAsset devuelve promesa de Entities raíz
    const spawned = await this.world.spawnAsset(
      asset,
      this.props.gridOrigin!.position.get(),    // posición de spawn
      undefined,                                 // rotación default
      new hz.Vec3(this.props.cellSize!, this.props.cellSize!, this.props.cellSize!)
    );

    // Asumo que spawned[0] es root de la pieza
    this.activePieceEntities = spawned;
    
    // Guardar la matriz localmente (deberías tener mapeado cada asset a su matriz)
    // Para simplificar, aquí puedes derivar la matriz por el nombre:
    const name = asset.toString(); // p.ej. "I", "O", etc.
    this.activeShapeMatrix = SHAPES[name];

    // Posición inicial encima del grid
    this.activeRow = -this.activeShapeMatrix.length;
    this.activeCol = Math.floor(this.props.cols! / 2) 
                      - Math.ceil(this.activeShapeMatrix[0].length / 2);

    // Ajustar posición real de los sub-entities
    this.updatePieceWorldPositions();
  }

  private async movePieceDown(): Promise<void> {
    // Incremento fila
    this.activeRow++;

    // Si tocó el piso (o colisión), fijo y genero la siguiente
    if (this.activeRow + this.activeShapeMatrix.length > this.props.rows!) {
      // TODO: fusionar al playfield aquí...
      // Despawner o deleteAsset
      for (const ent of this.activePieceEntities) {
        await this.world.deleteAsset(ent, true);
      }
      this.activePieceEntities = [];
      await this.spawnNextPiece();
      return;
    }

    // ¡Sino, actualizo posiciones!
    this.updatePieceWorldPositions();
  }

  private updatePieceWorldPositions() {
    const origin = this.props.gridOrigin!.position.get();
  
    let idx = 0;
    for (let r = 0; r < this.activeShapeMatrix.length; r++) {
      for (let c = 0; c < this.activeShapeMatrix[r].length; c++) {
        if (this.activeShapeMatrix[r][c]) {
          const ent = this.activePieceEntities[idx++];
          const x = origin.x + (this.activeCol + c) * this.props.cellSize!;
          const y = origin.y - (this.activeRow + r) * this.props.cellSize!;
          const z = origin.z;
          ent.position.set(new hz.Vec3(x, y, z));
        }
      }
    }
  }
  
}

hz.Component.register(TetrisManager);

// Matrices de formas
const SHAPES: Record<string, number[][]> = {
  I: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
  O: [[1,1],[1,1]],
  T: [[0,1,0],[1,1,1],[0,0,0]],
  S: [[0,1,1],[1,1,0],[0,0,0]],
  Z: [[1,1,0],[0,1,1],[0,0,0]],
  J: [[1,0,0],[1,1,1],[0,0,0]],
  L: [[0,0,1],[1,1,1],[0,0,0]],
};
