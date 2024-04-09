import { MainDOMSource, VNode, div, h1, hr, input, label, makeDOMDriver } from '@cycle/dom';
import { run } from '@cycle/run';
import { Stream } from 'xstream';
import "./styles.scss";
export interface Sources {
  DOM: MainDOMSource;
}

export interface Sinks {
  DOM: Stream<VNode>;
}

function main(sources : Sources): Sinks {
  const input$ = sources.DOM.select('.field').events('input')

  const name$ = input$.map((ev: Event) => (ev.target as HTMLInputElement).value).startWith('')

  const vdom$ = name$.map((name: string) =>
    div('.container',[
      label('Name:'),
      input('.field', {attrs: {type: 'text'}}),
      hr(),
      h1('Hello ' + name),
    ])
  )

  return { DOM: vdom$ }
}

run(main, { DOM: makeDOMDriver('#app') })
