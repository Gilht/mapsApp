import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter, switchMap, tap } from 'rxjs';
import { Region, SmallCountry } from '../../interfaces/country.interfaces';
import { CountriesService } from '../../services/countries.service';

@Component({
  selector: 'selector-page',
  templateUrl: './selector-page.component.html',
  styleUrl: './selector-page.component.sass'
})
export class SelectorPageComponent implements OnInit{

  constructor(
    private fb: FormBuilder,
    private contriesService: CountriesService
    ){}
    
  public countriesByRegion: SmallCountry[] = [];
  public borders: SmallCountry[] = [];

  public myForm: FormGroup = this.fb.group({
    region: ["",  Validators.required],
    country: ["",  Validators.required],
    borders: ["",  Validators.required],
  })

  ngOnInit(): void {
    this.onRegionChange();
    this.onCountryChange();
  }

  onRegionChange():void{
    this.myForm.get("region")?.valueChanges
    .pipe(
      tap(() => this.myForm.get("country")?.setValue("")),
      tap(() => this.borders = []),
      switchMap((region) => this.contriesService.getCountriesByRegion(region)),
      // 
    )
    .subscribe((countries) => {
    this.countriesByRegion = countries;
    })
  }

  onCountryChange(): void{
    this.myForm.get("country")?.valueChanges
    .pipe(
      tap(() => this.myForm.get("border")?.setValue("")),
      filter((value: string) => value.length > 0),
      switchMap((alphaCode)  => this.contriesService.getCountryByAlphaCode(alphaCode)),
      switchMap(country => this.contriesService.getCountryBordersByCode(country.borders))
    )
    .subscribe(countries => {
      this.borders = countries;
    })
  }

  get regions(): Region[] {
    return this.contriesService.regions;
  }
}

