import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, map, Observable, of, tap } from 'rxjs';
import { Country, Region, SmallCountry } from '../interfaces/country.interfaces';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {
  private baseUrl: string = "https://restcountries.com/v3.1";

  private _regions: Region[] = [Region.Africa, Region.Americas, Region.Asia, Region.Europe, Region.Oceania];
  
  constructor(
    private http: HttpClient
  ) { }

  get regions(): Region[] {
    return [...this._regions];
  }

  getCountriesByRegion(region: Region): Observable<SmallCountry[]>{
    console.log("recibi la region", region);
    if (!region) return of([]);
    if(this.http === undefined) return of([]);


    return this.http.get<Country[]>(`${this.baseUrl}/region/${region}`)
    .pipe(
      map(countries => countries.map(country => ({
        name: country.name.common,
        cca3: country.cca3,
        borders: country.borders ?? []
      }))),
      tap( response => console.log(response))
    );
  }

  getCountryByAlphaCode(alphaCode: string): Observable<SmallCountry> {
  
    const url = `${this.baseUrl}/alpha/${alphaCode}?fields=cca3,name,borders`;
    return this.http.get<Country>(url)
    .pipe(
    map( country => ({
      name: country.name.common,
      cca3: country.cca3,
      borders: country.borders ?? [],
    }))
    )
  }

  getCountryBordersByCode(borders: string[]): Observable<SmallCountry[]> {
    if (!borders || borders.length === 0) return of ([]);

    const countriesRequest: Observable<SmallCountry>[] = [];

    borders.forEach(digits => {
      const request = this.getCountryByAlphaCode(digits);
      console.log("this alphacodes", borders, countriesRequest);
      countriesRequest.push(request);
    });

    return combineLatest(countriesRequest);
  }
}
