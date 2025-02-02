import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item'
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  //storage: Storage = sessionStorage;
  storage: Storage = localStorage;

  constructor() {
    //read data from storage
    let data = JSON.parse(this.storage.getItem('cartItems')!);

    if(data != null) {
      this.cartItems = data;

      //compute totals based on the data that is read from storage
      this.computeCartTotals();
    }
   }

  addToCart(theCartItem: CartItem) {
    //check if we already have the item in our cart
    let alreadyExitsCart: boolean = false;
    let existingCartItem: CartItem = undefined;
    if (this.cartItems.length > 0) {
      //find the item in the cart based on item id

      existingCartItem = this.cartItems.find(cardITem => cardITem.id === theCartItem.id)
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
      this.cartItems.push(theCartItem);
    }

    //compute cart total price and total quantity
    this.computeCartTotals();

  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let currentCardItem of this.cartItems) {
      totalPriceValue += currentCardItem.quantity * currentCardItem.unitPrice;
      totalQuantityValue += currentCardItem.quantity;
    }

    //publish the new value .... all subscriers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCartData(totalPriceValue, totalQuantityValue);

    //persist cart data
    this.persistCartItems();
  }

  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the cart');
    for(let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity = ${tempCartItem.quantity}, unitPrice = ${tempCartItem.unitPrice}, subTotalPrice = ${subTotalPrice}`)
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`)
    console.log('---');
  }

  decrementQuantity(theCartITem: CartItem) {
    theCartITem.quantity--;
    if(theCartITem.quantity === 0) {
      this.remove(theCartITem);
    }
    else{
      this.computeCartTotals();
    }
  }

  remove(theCardItem: CartItem) {
    //get index of it.
    const itemIndex = this.cartItems.findIndex(tempCardItem => tempCardItem.id === theCardItem.id);
    //if found remove the item from the array 

    if(itemIndex > -1) {
      this.cartItems.splice(itemIndex,1);
      this.computeCartTotals();
    }


  }


}
