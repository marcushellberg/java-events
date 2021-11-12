import { html, LitElement, nothing, render } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@vaadin/vaadin-lumo-styles/';
import '@vaadin/text-field';
import '@vaadin/date-picker';
import '@vaadin/checkbox';
import '@vaadin/grid';
import '@vaadin/grid/vaadin-grid-sort-column.js';
import { GridBodyRenderer } from '@vaadin/grid';
import eventsUrl from './events.json?url';
import { CheckboxCheckedChangedEvent } from '@vaadin/checkbox';
import { Event } from './Event';

@customElement('java-events')
export class JavaEvents extends LitElement {
  @state() events: Event[] = [];
  @state() searchText = '';
  @state() showCFP = false;

  async connectedCallback() {
    super.connectedCallback();
    const eventData = await fetch(eventsUrl);
    this.events = await eventData.json();
  }

  get filteredEvents() {
    return this.events.filter((event) => {
      const regExp = new RegExp(this.searchText, 'i');
      return (
        event.name.match(regExp) ||
        event.type.match(regExp) ||
        event.country.match(regExp) ||
        event.city.match(regExp)
      );
    });
  }

  updateSearch(e: { target: HTMLInputElement }) {
    this.searchText = e.target.value;
  }

  nameRenderer: GridBodyRenderer<Event> = (root, _, model) => {
    const event = model.item;
    render(
      html`
        <a href=${event.website} target="_blank" class="underline"
          >${event.name}</a
        >
      `,
      root
    );
  };

  render() {
    return html`
      <div class="flex flex-col flex-grow gap-2">
        <div class="flex flex-wrap gap-6 items-baseline">
          <vaadin-text-field
            placeholder="Search events"
            clear-button-visible
            @input=${this.updateSearch}></vaadin-text-field>
          <vaadin-checkbox
            label="Show CFP dates"
            .checked=${this.showCFP}
            @checked-changed=${(e: CheckboxCheckedChangedEvent) =>
              (this.showCFP = e.detail.value)}></vaadin-checkbox>
        </div>
        <vaadin-grid .items=${this.filteredEvents}>
          <vaadin-grid-sort-column
            path="name"
            width="15rem"
            resizable
            .renderer=${this.nameRenderer}></vaadin-grid-sort-column>
          <vaadin-grid-sort-column
            path="type"
            auto-width
            resizable></vaadin-grid-sort-column>
          <vaadin-grid-sort-column
            path="country"
            auto-width
            resizable></vaadin-grid-sort-column>
          <vaadin-grid-sort-column
            path="city"
            auto-width
            resizable></vaadin-grid-sort-column>
          <vaadin-grid-sort-column
            path="eventStarts"
            header="Starts"
            auto-width
            resizable></vaadin-grid-sort-column>
          <vaadin-grid-sort-column
            path="eventEnds"
            header="Ends"
            auto-width
            resizable></vaadin-grid-sort-column>

          ${this.showCFP
            ? html`
                <vaadin-grid-sort-column
                  path="cfpStarts"
                  header="CFP starts"
                  auto-width
                  resizable></vaadin-grid-sort-column>
                <vaadin-grid-sort-column
                  path="cfpEnds"
                  header="CFP ends"
                  auto-width
                  resizable></vaadin-grid-sort-column>
              `
            : nothing}
        </vaadin-grid>
      </div>
    `;
  }

  // Disable shadow root for better SEO
  createRenderRoot() {
    return this;
  }
}
