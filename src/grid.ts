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

  startPoint: Point;
  endPoint: Point;
}

export class Grid implements m.ClassComponent<GridAttrs> {
  state: boolean[][] = [];

  oninit(vnode: m.Vnode<GridAttrs>) {
    for (let i = 0; i < vnode.attrs.rows; i++) {
      const row: boolean[] = new Array(vnode.attrs.columns).fill(false);
      this.state.push(row);
    }
  }

  renderCell(attrs: GridAttrs, p: Point, value: boolean): m.Child {
    const {row, col} = p;
    let symbol = value ? 'x' : 'o';
    if (pointEquals(attrs.startPoint, p)) {
      symbol = 's';
    }
    if (pointEquals(attrs.endPoint, p)) {
      symbol = 'e';
    }

    return m('td.interactive',
      {
        onclick: () => {
          this.state[row][col] = !value;
        }
      },
      symbol
    );
  }

  view({attrs}: m.Vnode<GridAttrs>): m.Child {
    return m('table',
      this.state.map((rowContent, row) =>
        m('tr', rowContent.map((value, col) => this.renderCell(attrs, {row, col}, value))))
    );
  }
}
