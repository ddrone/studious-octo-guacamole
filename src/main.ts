import './style.css';
import m from 'mithril';
import { Point } from './grid_logic';
import { CanvasGrid } from './canvas_grid';

class Main implements m.ClassComponent {
  view(): m.Child {
    return m(CanvasGrid, {
      rows: 5,
      columns: 4,

      start: new Point(0, 0),
      end: new Point(4, 3),
    })
  }
}

m.mount(document.querySelector('#app')!, Main);
