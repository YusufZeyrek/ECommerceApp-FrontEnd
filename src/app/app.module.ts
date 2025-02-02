import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { ProductService } from './services/product.service';
import {Routes, RouterModule, Router} from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component'

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CardStatusComponent } from './components/card-status/card-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';
import { from } from 'rxjs';

import{
  OktaAuthModule,
  OktaCallbackComponent,
  OKTA_CONFIG,
  OktaAuthGuard
} from'@okta/okta-angular'

import { OktaAuth } from '@okta/okta-auth-js';
import myAppConfig from './config/my-app-config';
import { MembersPageComponent } from './components/members-page/members-page.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';

const oktaConfig = myAppConfig.oidc;
const oktaAuth = new OktaAuth(oktaConfig);

function sendToLoginPage(oktaAuth : OktaAuth, injector: Injector) {
  // use injector to access any service available within your app.
  const router = injector.get(Router);

  // redirect the user to your custom login page
  router.navigate(['/login']);
}

const routes: Routes = [
  {path : 'order-history', component : OrderHistoryComponent, canActivate: [OktaAuthGuard],
                    data: {onAuthRequired : sendToLoginPage}},

  {path : 'members', component : MembersPageComponent, canActivate: [OktaAuthGuard],
                    data: {onAuthRequired : sendToLoginPage}},

  {path : 'login/callback', component : OktaCallbackComponent},
  {path : 'login', component : LoginComponent},

  {path : 'checkout', component : CheckoutComponent},
  {path : 'cart-details', component : CartDetailsComponent},
  {path : 'products/:id', component : ProductDetailsComponent},
  {path : 'search/:keyword', component : ProductListComponent},
  {path : 'category/:id', component : ProductListComponent},
  {path : 'category', component : ProductListComponent},
  {path : 'products', component : ProductListComponent},
  {path : '', redirectTo: '/products', pathMatch : 'full'},
  {path : '**', redirectTo : '/products', pathMatch : 'full'},

];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CardStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginComponent,
    LoginStatusComponent,
    MembersPageComponent,
    OrderHistoryComponent,
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    //ng - bootstrap
    NgbModule,
    ReactiveFormsModule,
    OktaAuthModule
  ],
  providers: [ProductService, {provide: OKTA_CONFIG, useValue: {oktaAuth}},
            {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi : true}],

  bootstrap: [AppComponent]
})
export class AppModule { }
