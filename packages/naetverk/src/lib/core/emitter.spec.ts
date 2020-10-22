import { NodeEditor } from '../editor';

describe('Editor', () => {
  let container: HTMLElement;
  let editor: NodeEditor;

  beforeEach(() => {
    const par = document.createElement('div') as HTMLElement;

    container = document.createElement('div') as HTMLElement;
    par.appendChild(container);

    editor = new NodeEditor('test@0.0.1', container);

    editor.events['warn'] = [];
    editor.events['error'] = [];
  });

  it('should add a event listener', () => {
    expect(editor.events.newlist).toBeUndefined();
    editor.bind('newlist');
    expect(editor.exist('newlist')).toStrictEqual(true);
  });

  it('should remove a event listener', () => {
    editor.bind('newlist');
    expect(editor.exist('newlist')).toStrictEqual(true);
    editor.unbind('newlist');
    expect(editor.exist('newlist')).toStrictEqual(false);
  });

  it('should add a bind event listener', () => {
    const evnt = 'newList';
    expect(editor.events.newlist).toBeUndefined();
    editor.bind(evnt);
    // @ts-ignore
    editor.on(evnt, () => {
      return 'I am bound';
    });
    // @ts-ignore
    expect(editor.trigger(evnt)).toBeTruthy();
  });

  it('should remove a bind event listener', () => {
    const evnt = 'newList';
    expect(editor.events.newlist).toBeUndefined();
    editor.bind(evnt);
    // @ts-ignore
    editor.on(evnt, () => {
      return 'I am bound';
    });
    // @ts-ignore
    expect(editor.trigger(evnt)).toBeTruthy();
    expect(editor.events[evnt].length).toStrictEqual(1);
    editor.unbind(evnt);
    expect(editor.exist(evnt)).toStrictEqual(false);
    // @ts-ignore
  });
});
