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

  renderGrid() {
    const ctx = this.ctx;
    ctx.fillStyle = '#eee';
    for (let i = 0; i <= this.gridLogic.rows; i++) {
      ctx.fillRect(0, i * (cellSize + gapSize), this.canvasWidth, gapSize);
    }
    for (let i = 0; i <= this.gridLogic.columns; i++) {
      ctx.fillRect(i * (cellSize + gapSize), 0, gapSize, this.canvasHeight);
    }
  }

  onupdate() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.renderGrid();
  }

  view(vnode: m.Vnode<GridAttrs>): m.Child {
    return m('div',
      m('canvas', {
        oncreate: (vnode: m.VnodeDOM) => {
          const canvas = vnode.dom as HTMLCanvasElement;
          this.ctx = canvas.getContext("2d")!;
        },
        width: this.canvasWidth,
        height: this.canvasHeight,
        border: 1,
      }),
      m('button', {
        onclick: () => {
          console.log('What a hack')
        }
      }, 'Update'));
  }
}
