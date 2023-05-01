import './style.css';
import m from 'mithril';
import { Grid } from './grid';
import { Point } from './grid_logic';

class Main implements m.ClassComponent {
  view(): m.Child {
    return m(Grid, {
      rows: 5,
      columns: 4,

      start: new Point(0, 0),
      end: new Point(4, 3),
    })
  }
}

m.mount(document.querySelector('#app')!, Main);
