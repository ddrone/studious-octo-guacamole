import m from 'mithril';
import { GridAttrs, GridLogic } from './grid_logic';

const cellSize = 50;
const gapSize = 5;

export class CanvasGrid implements m.ClassComponent<GridAttrs> {
  ctx: CanvasRenderingContext2D = undefined as any;
  gridLogic: GridLogic = undefined as any;

  get canvasHeight(): number {
    return this.gridLogic.rows * (cellSize + gapSize) + gapSize;
  }

  get canvasWidth(): number {
    return this.gridLogic.columns * (cellSize + gapSize) + gapSize;
  }

  oninit(vnode: m.Vnode<GridAttrs>) {
    this.gridLogic = new GridLogic(vnode.attrs);
  }

  view(vnode: m.Vnode<GridAttrs>): m.Child {
    return m('canvas', {
      oncreate: (vnode: m.VnodeDOM) => {
        const canvas = vnode.dom as HTMLCanvasElement;
        this.ctx = canvas.getContext("2d")!;
      },
      width: this.canvasWidth,
      height: this.canvasHeight,
      border: 1,
    });
  }
}
