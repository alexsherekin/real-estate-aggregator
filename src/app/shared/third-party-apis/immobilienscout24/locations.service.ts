import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LocationResponse, LocationResponseEntityType } from "./location-response";

@Injectable()
export class LocationsService {
  private readonly baseUrl = 'https://www.immobilienscout24.de/geoautocomplete/v3/locations.json';

  constructor(private http: HttpClient) {

  }

  public getCities(searchQuery: string) {
    const args = [
      { key: 'i', value: searchQuery },
      { key: 't', value: [LocationResponseEntityType.city, LocationResponseEntityType.postcode].join(',') }
    ];
    const urlArgs = args
      .filter(arg => arg.value)
      .map(arg => `${arg.key}=${arg.value}`);
    const fullUrl = encodeURIComponent(`${this.baseUrl}?${urlArgs}`);
    return this.http.get<Array<LocationResponse>>(fullUrl);
  }
}
