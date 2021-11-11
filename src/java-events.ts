import { html, LitElement, render } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@vaadin/text-field';
import '@vaadin/date-picker';
import '@vaadin/grid';
import '@vaadin/grid/vaadin-grid-sort-column.js';
import { GridBodyRenderer } from '@vaadin/grid';

type Event = {
  name: string;
  eventStarts?: Date;
  eventEnds?: Date;
  type: 'Conference' | 'Meetup';
  website: string;
  cfpOpens?: Date;
  cfpEnds?: Date;
  city: string;
  country: string;
};

@customElement('java-events')
export class JavaEvents extends LitElement {
  @state() events: Event[] = [];
  @state() searchText = '';

  async connectedCallback() {
    super.connectedCallback();
    this.events = (await import('./events.csv')).default;
  }

  get filteredEvents() {
    return this.events.filter((event) => {
      const regExp = new RegExp(this.searchText, 'i');
      if (
        event.name.match(regExp) ||
        event.type.match(regExp) ||
        event.country.match(regExp) ||
        event.city.match(regExp)
      ) {
        return true;
      } else {
        return false;
      }
    });
  }

  updateSearch(e: { target: HTMLInputElement }) {
    this.searchText = e.target.value;
  }

  nameRenderer: GridBodyRenderer<Event> = (root, _, model) => {
    const event = model.item;
    render(
      html` <a href=${event.website} target="_blank">${event.name}</a> `,
      root
    );
  };

  render() {
    return html`
      <div class="flex flex-col gap-m">
        <div class="flex flex-wrap gap-m items-baseline">
          <vaadin-text-field
            placeholder="Search events"
            clear-button-visible
            @input=${this.updateSearch}></vaadin-text-field>
        </div>
        <vaadin-grid .items=${this.filteredEvents}>
          <vaadin-grid-sort-column
            path="name"
            auto-width
            frozen
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
        </vaadin-grid>
      </div>
    `;
  }

  // Disable shadow root for better SEO
  createRenderRoot() {
    return this;
  }
}
