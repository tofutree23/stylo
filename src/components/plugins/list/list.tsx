import {
  Component,
  Element,
  Event,
  EventEmitter,
  Fragment,
  h,
  JSX,
  Listen,
  Method
} from '@stencil/core';
import configStore from '../../../stores/config.store';
import i18n from '../../../stores/i18n.store';
import {StyloPlugin, StyloPluginIcon} from '../../../types/plugin';
import {toHTMLElement} from '../../../utils/node.utils';
import {IconCode} from '../../icons/code';
import {IconEllipsisHorizontal} from '../../icons/ellipsis-horizontal';
import {IconImages} from '../../icons/images';
import {IconList} from '../../icons/list';

@Component({
  tag: 'stylo-list',
  styleUrl: 'list.scss',
  shadow: true
})
export class List {
  @Element()
  private el: HTMLElement;

  /**
   * Emit which plugin the user want to apply.
   */
  @Event()
  applyPlugin: EventEmitter<StyloPlugin>;

  /**
   * Emit when user actually do not want to apply a plugin.
   */
  @Event()
  cancelPlugins: EventEmitter<void>;

  private focusButton: HTMLElement | undefined;

  private emitPlugin($event: UIEvent, plugin: StyloPlugin) {
    $event.stopPropagation();

    this.applyPlugin.emit(plugin);
  }

  @Listen('keydown', {passive: true})
  onKeyDown($event: KeyboardEvent) {
    const {code} = $event;

    if (['Escape'].includes(code)) {
      this.cancelPlugins.emit();
      return;
    }

    if (['ArrowDown'].includes(code)) {
      this.focusNext();
      return;
    }

    if (['ArrowUp'].includes(code)) {
      this.focusPrevious();
    }

    if (['Enter'].includes(code)) {
      $event.stopPropagation();
    }
  }

  @Method()
  async focusFirstButton() {
    this.focusButton = this.el.shadowRoot.querySelector('button');
    this.focusButton?.focus();
  }

  private focusNext() {
    this.focusButton = toHTMLElement(
      (this.focusButton || this.el.shadowRoot.firstElementChild)?.nextElementSibling
    );
    this.focusButton?.focus();
  }

  private focusPrevious() {
    this.focusButton = toHTMLElement(
      (this.focusButton || this.el.shadowRoot.lastElementChild)?.previousElementSibling
    );
    this.focusButton?.focus();
  }

  render() {
    return (
      <Fragment>
        {configStore.state.plugins.map((plugin: StyloPlugin) => this.renderPlugin(plugin))}
      </Fragment>
    );
  }

  private renderPlugin(plugin: StyloPlugin) {
    const {text, icon: iconSrc} = plugin;

    const icon: JSX.IntrinsicElements | undefined = this.renderIcon(iconSrc);

    return (
      <button
        onClick={($event: UIEvent) => this.emitPlugin($event, plugin)}
        {...(icon === undefined && {innerHTML: iconSrc})}
      >
        {icon}
        {i18n.state.plugins[text] || text}
      </button>
    );
  }

  private renderIcon(icon: StyloPluginIcon): JSX.IntrinsicElements | undefined {
    switch (icon) {
      case 'code':
        return <IconCode></IconCode>;
      case 'ul':
        return <IconList></IconList>;
      case 'hr':
        return <IconEllipsisHorizontal></IconEllipsisHorizontal>;
      case 'img':
        return <IconImages></IconImages>;
      default:
        return undefined;
    }
  }
}