import {createElement} from '../render.js';
import { humanizeDate, capitalize } from '../util.js';

function createEmptyPoint() {
  return {
    basePrice: 0,
    dateFrom: new Date(),
    dateTo: new Date(),
    destination: 0,
    offers: [],
    type: 'flight',
  };
}

function createTemplate(point, tripDestinations, allOffers) {
  const { basePrice, type, destination, offers, dateFrom, dateTo } = point;

  const destinationInfo = tripDestinations.find((item) => item.id === destination);
  const offerByType = allOffers.find((offer) => offer.type === type);
  const tripOffers = offerByType.offers;
  const picturesforTemplate = destinationInfo?.pictures;

  const pictureTemplate =
picturesforTemplate?.map((photos = destinationInfo) => (
  `<div class="event__photos-container">
            <div class="event__photos-tape">
              <img class="event__photo" src="${photos.src}" alt="${photos.description}">
            </div>
          </div>`)).join('');

  const tripTypeTemplate = allOffers.map((item) =>
    `<div class="event__type-item">
      <input id="event-type-${item.type}-${point.id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item.type}" ${type === item.type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${item.type}" for="event-type-${item.type}-${point.id}">${capitalize(item.type)}</label>
    </div>`).join('');

  const offersTemplate =
    tripOffers.map((offer) =>
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}-${offer.id}" type="checkbox" name="event-offer-${offer.title}" ${offers.includes(offer.id) ? 'checked' : ''}>
        <label class="event__offer-label" for="event-offer-${offer.title}-${offer.id}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`).join('');

  const destinationsOptionValueTemplate = tripDestinations.map((item) => `<option value="${item.name}"></option>`).join('');


  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${tripTypeTemplate}
              </fieldset>
            </div>
          </div>
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
            </label>
            ${
    destinationInfo?.name.length > 1 ?
      `<input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationInfo?.name}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${destinationsOptionValueTemplate}` : ''
    }

            </datalist>
          </div>
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(dateFrom, 'YY/MM/DD HH:mm')}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(dateTo, 'YY/MM/DD HH:mm')}">
          </div>
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>
          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
        ${
    offersTemplate.length > 0 ?
      `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
            ${offersTemplate}
            </div>
          </section>`
      : ''
    }
    </section>
    ${destinationInfo?.description.length > 1 ?
      `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destinationInfo?.description }</p>
            ${pictureTemplate}
          </div>
          </section>`
      : ''
    }
        </section>
      </form>
    </li>`
  );
}

export default class EditFormView {

  constructor({ point = createEmptyPoint(), tripDestinations, allOffers}) {
    this.point = point;
    this.tripDestinations = tripDestinations;
    this.allOffers = allOffers;
  }

  getTemplate() {
    return createTemplate(this.point, this.tripDestinations, this.allOffers);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
