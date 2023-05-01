import m from 'mithril';
import { GridAttrs, GridLogic } from './grid_logic';
import { starPath } from './canvas_utils';

const cellSize = 50;
const gapSize = 5;

function cellOffset(coord: number): number {
  return (cellSize + gapSize) * coord + gapSize;
}

function cellCenter(coord: number): number {
  return cellOffset(coord) + cellSize / 2;
}

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

  renderStart() {
    const ctx = this.ctx;
    ctx.fillStyle = '#666';
    const start = this.gridLogic.start;
    const x = cellCenter(start.col);
    const y = cellCenter(start.row);
    const r = cellSize * 0.45;

    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
  }

  renderEnd() {
    const ctx = this.ctx;
    ctx.fillStyle = '#f66';
    const end = this.gridLogic.end;
    const x = cellCenter(end.col);
    const y = cellCenter(end.row);
    const outerR = cellSize * 0.45;
    const innerR = cellSize * 0.15;

    starPath(ctx, x, y, outerR, innerR, 5);
    ctx.fill();
  }

  onupdate() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.renderGrid();
    this.renderStart();
    this.renderEnd();
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
