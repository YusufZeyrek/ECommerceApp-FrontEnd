import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-card-status',
  templateUrl: './card-status.component.html',
  styleUrls: ['./card-status.component.css']
})
export class CardStatusComponent implements OnInit {

  //the component created to show cart status
  totalPrice: number = 0.00;
  totalQuantity: number = 0;
  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.updateCardStatus();
  }

  updateCardStatus() {
    // subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );


    //subscribe to the cart TotalQuantity
    this.cartService.totalQuantity.subscribe (
      data => this.totalQuantity = data
    )
  }

}
