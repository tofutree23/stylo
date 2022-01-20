import {StyloPalette} from './palette';

export interface StyloToolbar {
  /**
   * The list of selectable colors
   */
  palette: StyloPalette[];
  /**
   * Handle the event "selection change" "manually". Useful if used in a shadowed context.
   */
  globalEvents: boolean;
  /**
   * Use `document.execCommand` (= "native") to modify the document or, alternatively use the `custom` implementation
   */
  command: 'native' | 'custom';
  /**
   * Configure some actions of the toolbar
   */
  actions: {
    /**
     * Per default, the component will not consider images as editable.
     */
    img?: {
      /**
       * The type of element to attach the image toolbar.
       */
      anchor: 'img' | string;
      /**
       * In case you would like to use a specific property to specify the width on your image
       */
      propertyWidth: 'width' | string;
      /**
       * In case you would like to use a specific property to specify the float on your image
       */
      propertyCssFloat: 'float' | string;
    };
    /**
     * Enable actions to manipulate list. Disabled per default.
     */
    list: boolean;
    /**
     * Actions to manipulate the alignment enabled?
     */
    align: boolean;
    /**
     * Actions to modify the selection font-size enabled?
     */
    fontSize: boolean;
    /**
     * To hide the option to select a background-color
     */
    backgroundColor: boolean;
    /**
     * You might to display and add further actions to the component ? Use this property to provide a comma separated list of actions.
     * Comma separated list.
     */
    customActions?: string;
  };
}

export enum ToolbarActions {
  SELECTION,
  LINK,
  IMAGE,
  COLOR,
  ALIGNMENT,
  LIST,
  FONT_SIZE,
  BACKGROUND_COLOR
}

export enum ToolbarImageSize {
  SMALL = '25%',
  MEDIUM = '50%',
  LARGE = '75%',
  ORIGINAL = '100%'
}

export enum ToolbarImageAlign {
  STANDARD,
  START
}

export enum ToolbarAlign {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right'
}

export enum ToolbarList {
  ORDERED = 'insertOrderedList',
  UNORDERED = 'insertUnorderedList'
}

export enum ToolbarFontSize {
  X_SMALL = '1',
  SMALL = '2',
  MEDIUM = '3',
  LARGE = '4',
  X_LARGE = '5',
  XX_LARGE = '6',
  XXX_LARGE = '7'
}

export interface ToolbarAnchorLink {
  range: Range;
  text: string;
  element: Element;
}

export interface ToolbarAction {
  action: string;
  selection: Selection;
  anchorLink: ToolbarAnchorLink;
}