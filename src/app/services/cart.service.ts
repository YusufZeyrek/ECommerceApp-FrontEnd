import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item'
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cardItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem: CartItem) {
    //check if we already have the item in our cart
    let alreadyExitsCart: boolean = false;
    let existingCartItem: CartItem = undefined;
    if (this.cardItems.length > 0) {
      //find the item in the cart based on item id

      existingCartItem = this.cardItems.find(cardITem => cardITem.id === theCartItem.id)
      // for (let tempCartItem of this.cardItems) {
      //   if (tempCartItem.id === theCartItem.id) {
      //     existingCartItem = tempCartItem;
      //     break;
      //   }
      // }
      //check if we found it
      alreadyExitsCart = (existingCartItem != undefined);
    }
    if (alreadyExitsCart) {
      //increment the quantity
      existingCartItem.quantity++;
    }
    else {
      //just add the item to the array
      this.cardItems.push(theCartItem);
    }

    //compute cart total price and total quantity
    this.computeCartTotals();

  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let currentCardItem of this.cardItems) {
      totalPriceValue += currentCardItem.quantity * currentCardItem.unitPrice;
      totalQuantityValue += currentCardItem.quantity;
    }

    //publish the new value .... all subscriers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the cart');
    for(let tempCartItem of this.cardItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity = ${tempCartItem.quantity}, unitPrice = ${tempCartItem.unitPrice}, subTotalPrice = ${subTotalPrice}`)
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`)
    console.log('---');
  }
}
