import m from 'mithril';
import { GridAttrs, GridLogic, GridPath, Point } from './grid_logic';

export class Grid implements m.ClassComponent<GridAttrs> {
  // TODO: Figure out a way to avoid this hack without having to do null checks everywhere
  gridLogic: GridLogic = undefined as any;

  oninit(vnode: m.Vnode<GridAttrs>) {
    this.gridLogic = new GridLogic(vnode.attrs);
  }

  renderCell(attrs: GridAttrs, p: Point, value: boolean): m.Child {
    return m('td.interactive' + (this.gridLogic.isOnPath(p) ? '.bold' : ''),
      {
        onclick: () => {
          this.gridLogic.set(p, !value);
        }
      },
      this.gridLogic.describe(p)
    );
  }

  renderPath(path: GridPath|undefined): m.Child {
    return m('span' + (path === undefined ? '.red' : ''),
      this.gridLogic.path === undefined ? 'Path blocked!' : `Path length: ${this.gridLogic.path.points.length}`);
  }

  view({attrs}: m.Vnode<GridAttrs>): m.Child {
    return m('div',
      m('table',
        this.gridLogic.cells.map((rowContent, row) =>
          m('tr', rowContent.map((value, col) => this.renderCell(attrs, new Point(row, col), value))))
      ),
      this.renderPath(this.gridLogic.path)
    );
  }
}
