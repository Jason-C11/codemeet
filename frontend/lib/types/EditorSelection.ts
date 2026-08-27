export type EditorSelection = {
  startLine: number;
  endLine: number;
  startColumn: number;
  endColumn: number;
  hasHighlight: boolean;
};

export type RemoteCursor = {
  username: string;
  selection: EditorSelection;
};
