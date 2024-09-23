import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs';
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

  public myForm: FormGroup = this.fb.group({
    region: ["",  Validators.required],
    country: ["",  Validators.required],
    borders: ["",  Validators.required],
  })

  ngOnInit(): void {
    this.onRegionChange()
  }

  onRegionChange():void{
    this.myForm.get("region")?.valueChanges
    .pipe(
      tap(() => this.myForm.get("country")?.setValue("")),
      switchMap(this.contriesService.getCountriesByRegion)
    )
    .subscribe((countries) => {
    this.countriesByRegion = countries;
    })
  }

  get regions(): Region[] {
    return this.contriesService.regions;
  }
}

