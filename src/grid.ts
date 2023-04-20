import m from 'mithril';

export interface Point {
  row: number;
  col: number;
}

export function pointEquals(p1: Point, p2: Point) {
  return p1.row === p2.row && p1.col === p2.col;
}

export interface GridAttrs {
  rows: number;
  columns: number;

  start: Point;
  end: Point;
}

class GridLogic {
  cells: boolean[][];
  start: Point;
  end: Point;

  constructor(attrs: GridAttrs) {
    this.cells = [];
    for (let i = 0; i < attrs.rows; i++) {
      const row: boolean[] = new Array(attrs.columns).fill(false);
      this.cells.push(row);
    }

    this.start = attrs.start;
    this.end = attrs.end;
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

  set(p: Point, value: boolean) {
    this.cells[p.row][p.col] = value;
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
