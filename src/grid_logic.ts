
export class Point {
  row: number;
  col: number;

  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
  }

  equalsTo(p: Point): boolean {
    return p.row === this.row && p.col === this.col;
  }

  addTo(p: Point): Point {
    return new Point(p.row + this.row, p.col + this.col);
  }
}

export interface GridAttrs {
  rows: number;
  columns: number;

  start: Point;
  end: Point;
}

export interface GridPath {
  points: Point[];
  idSet: Set<number>;
}

export class GridLogic {
  // "true" means that cell on this coordinate is blocked
  cells: boolean[][];
  start: Point;
  end: Point;
  rows: number;
  columns: number;
  path: GridPath|undefined;

  constructor(attrs: GridAttrs) {
    this.cells = [];
    for (let i = 0; i < attrs.rows; i++) {
      const row: boolean[] = new Array(attrs.columns).fill(false);
      this.cells.push(row);
    }

    this.start = attrs.start;
    this.end = attrs.end;
    this.rows = attrs.rows;
    this.columns = attrs.columns;
    this.path = this.computePath();
  }

  describe(p: Point): string {
    if (p.equalsTo(this.start)) {
      return 's';
    }
    if (p.equalsTo(this.end)) {
      return 'e';
    }
    return this.cells[p.row][p.col] ? 'x' : 'o';
  }

  // Needed to avoid storing objects in the Set, which JavaScript does not allow
  pointId(p: Point): number {
    return p.row * this.columns + p.col;
  }

  set(p: Point, value: boolean) {
    if (p.equalsTo(this.start) || p.equalsTo(this.end)) {
      return;
    }

    this.cells[p.row][p.col] = value;
    this.path = this.computePath();
  }

  isOnPath(p: Point) {
    if (this.path === undefined) {
      return false;
    }

    return this.path.idSet.has(this.pointId(p));
  }

  isValid(p: Point) {
    return p.row >= 0 && p.row < this.rows && p.col >= 0 && p.col < this.columns && !this.cells[p.row][p.col];
  }

  validAdjacentPoints(p: Point): Point[] {
    const deltas: Point[] = [
      new Point(0, 1),
      new Point(0, -1),
      new Point(1, 0),
      new Point(-1, 0),
    ]

    return deltas.map(d => p.addTo(d)).filter(p => this.isValid(p));
  }

  debugDistanceMap(dist: Map<number, number>) {
    const map: string[][] = [];
    for (let row = 0; row < this.rows; row++) {
      const outputRow: string[] = [];
      for (let col = 0; col < this.columns; col++) {
        const id = this.pointId(new Point(row, col));
        const distance = dist.get(id);
        if (distance === undefined) {
          outputRow.push('x');
        }
        else {
          outputRow.push(`${distance}`)
        }
      }
      map.push(outputRow);
    }
    console.table(map);
  }

  computePath(): GridPath|undefined {
    interface QueueItem {
      point: Point;
      distance: number;
    };

    const distances = new Map<number, number>();
    const queue: QueueItem[] = [{
      point: this.start,
      distance: 0,
    }];

    while (queue.length > 0) {
      const current = queue.splice(0, 1)[0];
      const currentId = this.pointId(current.point);
      if (distances.has(currentId)) {
        continue;
      }
      distances.set(this.pointId(current.point), current.distance);
      
      for (const next of this.validAdjacentPoints(current.point)) {
        queue.push({
          point: next,
          distance: current.distance + 1
        });
      }
    }

    const endDistance = distances.get(this.pointId(this.end));
    if (endDistance === undefined) {
      return undefined;
    }

    const result: GridPath = {
      points: [],
      idSet: new Set<number>()
    }

    let current = this.end;
    outer: for (let distance = endDistance - 1; distance >= 0; distance--) {
      result.points.push(current);
      result.idSet.add(this.pointId(current));

      for (const next of this.validAdjacentPoints(current)) {
        const nextDistance = distances.get(this.pointId(next));
        if (nextDistance === distance) {
          current = next;
          continue outer;
        }
      }

      throw new Error("internal error: should have one neighbor with decreased distance");
    }

    result.points.push(current);
    result.idSet.add(this.pointId(current));

    return result;
  }
}
