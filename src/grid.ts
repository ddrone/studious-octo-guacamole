import m from 'mithril';

export interface GridAttrs {
  rows: number;
  columns: number;
}

export class Grid implements m.ClassComponent<GridAttrs> {
  state: boolean[][] = [];

  oninit(vnode: m.Vnode<GridAttrs>) {
    for (let i = 0; i < vnode.attrs.rows; i++) {
      const row: boolean[] = new Array(vnode.attrs.columns).fill(false);
      this.state.push(row);
    }
  }

  renderCell(row: number, col: number, value: boolean): m.Child {
    return m('td.interactive',
      {
        onclick: () => {
          this.state[row][col] = !value;
        }
      },
      value ? 'x' : 'o'
    );
  }

  view(): m.Child {
    return m('table',
      this.state.map((rowContent, row) =>
        m('tr', rowContent.map((value, col) => this.renderCell(row, col, value))))
    );
  }
}
