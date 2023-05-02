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

  renderFilled(row: number, col: number) {
    const x = cellOffset(col);
    const y = cellOffset(row);

    const ctx = this.ctx;
    ctx.fillStyle = '#777';

    ctx.fillRect(x, y, cellSize, cellSize);

    if (row > 0 && this.gridLogic.cells[row - 1][col]) {
      ctx.fillRect(x, y - gapSize, cellSize, gapSize);
    }
    if (col > 0 && this.gridLogic.cells[row][col - 1]) {
      ctx.fillRect(x - gapSize, y, gapSize, cellSize);
    }
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

    for (let row = 0; row < this.gridLogic.rows; row++) {
      for (let col = 0; col < this.gridLogic.columns; col++) {
        if (this.gridLogic.cells[row][col]) {
          this.renderFilled(row, col);
        }
      }
    }

    const path = this.gridLogic.path;
    if (path !== undefined) {
      let lastPoint = path.points[0];
      ctx.beginPath();
      ctx.moveTo(cellCenter(lastPoint.col), cellCenter(lastPoint.row));
      for (let i = 1; i < path.points.length; i++) {
        const p = path.points[i];
        ctx.lineTo(cellCenter(p.col), cellCenter(p.row));
        lastPoint = p;
      }
      ctx.stroke();
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
        onmouseout: () => {
          this.x = undefined;
          this.y = undefined;
        },
        onclick: () => {
          if (this.x !== undefined && this.y !== undefined) {
            this.gridLogic.set(new Point(this.y, this.x), !this.gridLogic.cells[this.y][this.x]);
          }
        },
        width: this.canvasWidth,
        height: this.canvasHeight,
        border: 1,
      }),
      m('div',
        this.gridLogic.path === undefined ?
          m('span.red', 'Path is blocked!') :
          `Current path: ${this.gridLogic.path.points.length}`,
      ),
      this.gridLogic.bestPath !== undefined &&
        m('div', `Best path: ${this.gridLogic.bestPath}`));
  }
}
