import './style.css';
import m from 'mithril';
import { Point } from './grid_logic';
import { CanvasGrid } from './canvas_grid';

const width = 15;
const height = 10;

class Main implements m.ClassComponent {
  view(): m.Child {
    return m('.container',
      m(CanvasGrid, {
        rows: height,
        columns: width,

        start: new Point(0, 0),
        end: new Point(height - 1, width - 1),
      }),
      m('.thin',
        m('h2', 'How to play'),
        m('p',
          `The objective of the game is to make the path from beginning (marked as a circle) to the end
          (marked as a star) as long as possible. You can click on a cell to disallow the path to use that
          cell in order to make the path longer, however, you're not allowed to block the path completely.`),
        m('p',
          `There are no levels or end state at the moment. You can see your score below the grid, and can
          take screenshots to share your solutions.`),
        m('p', `The best solution I know for the current puzzle has length 90.`)
      )
    );
  }
}

m.mount(document.querySelector('#app')!, Main);
