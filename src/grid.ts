import m from 'mithril';

export interface Point {
  row: number;
  col: number;
}

export function pointEquals(p1: Point, p2: Point) {
  return p1.row === p2.row && p1.col === p2.col;
}

export function addPoints(p1: Point, p2: Point) {
  return {row: p1.row + p2.row, col: p1.col + p2.col};
}

export interface GridAttrs {
  rows: number;
  columns: number;

  start: Point;
  end: Point;
}

interface GridPath {
  points: Point[];
  idSet: Set<number>;
}

class GridLogic {
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
  }

  describe(p: Point): string {
    if (pointEquals(this.start, p)) {
      return 's';
    }
    if (pointEquals(this.end, p)) {
      return 'e';
    }
    return this.cells[p.row][p.col] ? 'x' : 'o';
  }

  // Needed to avoid storing objects in the Set, which JavaScript does not allow
  pointId(p: Point): number {
    return p.row * this.columns + p.col;
  }

  set(p: Point, value: boolean) {
    if (pointEquals(p, this.start) || pointEquals(p, this.end)) {
      return;
    }

    this.cells[p.row][p.col] = value;
    this.path = this.computePath();
  }

  isValid(p: Point) {
    return p.row >= 0 && p.row < this.rows && p.col >= 0 && p.col < this.columns && !this.cells[p.row][p.col];
  }

  validAdjacentPoints(p: Point): Point[] {
    const deltas: Point[] = [
      {row: 0, col: 1},
      {row: 0, col: -1},
      {row: 1, col: 0},
      {row: -1, col: 0},
    ]

    return deltas.map(d => addPoints(p, d)).filter(p => this.isValid(p));
  }

  debugDistanceMap(dist: Map<number, number>) {
    const map: string[][] = [];
    for (let row = 0; row < this.rows; row++) {
      const outputRow: string[] = [];
      for (let col = 0; col < this.columns; col++) {
        const id = this.pointId({row, col});
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
      distances.set(this.pointId(current.point), current.distance);
      
      for (const next of this.validAdjacentPoints(current.point)) {
        const nextId = this.pointId(next);
        if (distances.has(nextId)) {
          continue;
        }

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
    outer: for (let distance = endDistance - 1; distance > 0; distance--) {
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

    return result;
  }
}

export class Grid implements m.ClassComponent<GridAttrs> {
  // TODO: Figure out a way to avoid this hack without having to do null checks everywhere
  gridLogic: GridLogic = undefined as any;

  oninit(vnode: m.Vnode<GridAttrs>) {
    this.gridLogic = new GridLogic(vnode.attrs);
  }

  renderCell(attrs: GridAttrs, p: Point, value: boolean): m.Child {
    return m('td.interactive',
      {
        onclick: () => {
          this.gridLogic.set(p, !value);
        }
      },
      this.gridLogic.describe(p)
    );
  }

  view({attrs}: m.Vnode<GridAttrs>): m.Child {
    return m('table',
      this.gridLogic.cells.map((rowContent, row) =>
        m('tr', rowContent.map((value, col) => this.renderCell(attrs, {row, col}, value))))
    );
  }
}
