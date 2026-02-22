import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ItemProductComponent } from './item-product.component';
import { SwiperModule } from 'swiper/angular';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { IonicModule } from '@ionic/angular';
// import { HeaderComponent } from 'src/app/share/header/header.component';

@NgModule({ declarations: [ItemProductComponent], imports: [CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        SwiperModule,
        NgxStarRatingModule,
        IonicModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class ItemProductModule {}
