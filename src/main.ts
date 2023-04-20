import './style.css';
import m from 'mithril';
import { Grid } from './grid';

class Main implements m.ClassComponent {
  view(): m.Child {
    return m(Grid, {
      rows: 5,
      columns: 4,
    })
  }
}

m.mount(document.querySelector('#app')!, Main);
