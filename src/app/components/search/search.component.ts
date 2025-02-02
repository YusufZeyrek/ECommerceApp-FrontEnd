import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  //The component for searching in products
  constructor(private router : Router) { }

  ngOnInit(): void {
  }

  doSearch(value : string) : void {
    console.log("value = " + value);
    this.router.navigateByUrl(`/search/${value}`)
  }
}
