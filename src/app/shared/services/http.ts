import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { NoInternetError } from './network-errors/no-internet.error';

@Injectable()
export class Http {
  constructor(
    private http: HTTP,
    private httpClient: HttpClient,
  ) {

  }

  public get<T>(url: string, headers: any = {}, responseType: any = 'json') {
    let result$: Observable<T>;
    if (window.cordova) {
      result$ = from(this.http.get(url, {}, headers))
        .pipe(
          map(response => {
            try {
              if (responseType === 'json') {
                return JSON.parse(response.data) as T;
              } else {
                return response.data;
              }
            } catch (e) {
              return undefined;
            }
          })
        );
    } else {
      result$ = this.httpClient.get<T>(url, {
        headers: new HttpHeaders(headers),
        responseType,
      });
    }

    return result$ = result$.pipe(
      catchError((error: any) => {
        if (error.status === 0) {
          throw new NoInternetError();
        }

        return of(undefined);
      })
    );
  }

  public post<T>(url: string, body: any = {}, headers: any = {}, responseType: any = 'json') {
    let result$: Observable<T>;
    if (window.cordova) {
      if (!headers['Content-Type'] || (headers['Content-Type'] === 'application/json')) {
        this.http.setDataSerializer('json');
      }
      result$ = from(this.http.post(url, body || [], {
        'Content-Type': 'application/json',
        ...headers
      })).pipe(
        map(response => {
          try {
            if (responseType === 'json') {
              return JSON.parse(response.data) as T;
            } else {
              return response.data;
            }
          } catch (e) {
            return undefined;
          }
        })
      );
    } else {
      result$ = this.httpClient.post<T>(url, body, {
        headers: new HttpHeaders(headers),
        responseType,
      });
    }

    return result$ = result$.pipe(
      catchError((error: any) => {
        if (error.status === 0) {
          throw new NoInternetError();
        }

        return of(undefined);
      })
    );
  }
}
