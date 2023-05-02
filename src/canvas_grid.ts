import m from 'mithril';
import { GridAttrs, GridLogic, Point } from './grid_logic';
import { starPath } from './canvas_utils';

const cellSize = 50;
const gapSize = 5;

function outerCellOffset(coord: number): number {
  return (cellSize + gapSize) * coord;
}

function cellOffset(coord: number): number {
  return outerCellOffset(coord) + gapSize;
}

function cellCenter(coord: number): number {
  return cellOffset(coord) + cellSize / 2;
}

function isSame(x: number, y: number, point: Point): boolean {
  return point.col === x && point.row === y;
}

export class CanvasGrid implements m.ClassComponent<GridAttrs> {
  ctx: CanvasRenderingContext2D = undefined as any;
  gridLogic: GridLogic = undefined as any;
  x?: number;
  y?: number;

  get canvasHeight(): number {
    return cellOffset(this.gridLogic.rows);
  }

  get canvasWidth(): number {
    return cellOffset(this.gridLogic.columns);
  }

  oninit(vnode: m.Vnode<GridAttrs>) {
    this.gridLogic = new GridLogic(vnode.attrs);
  }

  renderGrid() {
    const ctx = this.ctx;
    ctx.fillStyle = '#eee';
    for (let i = 0; i <= this.gridLogic.rows; i++) {
      ctx.fillRect(0, outerCellOffset(i), this.canvasWidth, gapSize);
    }
    for (let i = 0; i <= this.gridLogic.columns; i++) {
      ctx.fillRect(outerCellOffset(i), 0, gapSize, this.canvasHeight);
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

  renderCross(row: number, col: number) {
    const ctx = this.ctx;
    const x = cellOffset(col);
    const y = cellOffset(row);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + cellSize, y + cellSize);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + cellSize, y);
    ctx.lineTo(x, y + cellSize);
    ctx.stroke();
  }

  onupdate() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.renderGrid();
    this.renderStart();
    this.renderEnd();

    if (this.x !== undefined && this.y !== undefined) {
      this.renderCross(this.y, this.x);
    }
  }

  view(vnode: m.Vnode<GridAttrs>): m.Child {
    return m('div',
      m('canvas', {
        oncreate: (vnode: m.VnodeDOM) => {
          const canvas = vnode.dom as HTMLCanvasElement;
          this.ctx = canvas.getContext("2d")!;
        },
        onmousemove: (e: MouseEvent) => {
          const bbox = (e.target as HTMLCanvasElement).getBoundingClientRect();
          const cursorX = e.clientX - bbox.left;
          const cursorY = e.clientY - bbox.top;

          this.x = Math.floor(cursorX / (cellSize + gapSize));
          this.y = Math.floor(cursorY / (cellSize + gapSize));

          if (isSame(this.x, this.y, this.gridLogic.start) || isSame(this.x, this.y, this.gridLogic.end)) {
            this.x = undefined;
            this.y = undefined;
          }
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
