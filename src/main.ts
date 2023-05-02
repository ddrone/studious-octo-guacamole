import './style.css';
import m from 'mithril';
import { Point } from './grid_logic';
import { CanvasGrid } from './canvas_grid';

const width = 15;
const height = 10;

class Main implements m.ClassComponent {
  view(): m.Child {
    return m(CanvasGrid, {
      rows: height,
      columns: width,

      start: new Point(0, 0),
      end: new Point(height - 1, width - 1),
    })
  }
}

m.mount(document.querySelector('#app')!, Main);
