import { Advertisement } from '../native';

export function areSimilar(ad1: Advertisement, ad2: Advertisement) {
  if (!ad1 && !ad2) {
    return true;
  }

  if (!ad1 || !ad2) {
    return false;
  }

  if (isDefined(ad1.realEstate, 'numberOfRooms') && isDefined(ad2.realEstate, 'numberOfRooms')) {
    if (ad1.realEstate.numberOfRooms !== ad2.realEstate.numberOfRooms) {
      return false;
    }
  }

  if (isDefined(ad1.realEstate, 'livingSpace') && isDefined(ad2.realEstate, 'livingSpace')) {
    if (ad1.realEstate.livingSpace !== ad2.realEstate.livingSpace) {
      return false;
    }
  }

  if (isDefined(ad1.realEstate, 'price') && isDefined(ad2.realEstate, 'price')) {
    if (ad1.realEstate.price.value !== ad2.realEstate.price.value) {
      return false;
    }
  }

  if (isDefined(ad1, 'title') && isDefined(ad2, 'title')) {
    if (ad1.title === ad2.title) {
      return true;
    }
  }

  return true;
}

function isDefined<T extends Object>(obj: T, prop: keyof T) {
  return obj.hasOwnProperty(prop) && obj[prop] !== undefined && obj[prop] !== null;
}
