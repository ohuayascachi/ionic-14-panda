import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'phoneNumber',
    standalone: false
})



export class PhoneNumberPipe implements PipeTransform {

  transform(value: string, args: string[]): string {

    const lengthText = value.length;
    const sinEspacios = value.replace(/ /g, '');
    //console.log(sinEspacios);
    const lengthSinEspacios  = sinEspacios.length;
    if( lengthSinEspacios >= 3 &&  lengthSinEspacios <= 6){

      const valor1 = sinEspacios.slice(0,3);
      const valor2 = sinEspacios.slice(3,6);
      return valor1 + ' ' + valor2;

    }else if (lengthSinEspacios > 6  ) {

      const valor1= sinEspacios.slice(0,3);
        const valor2= sinEspacios.slice(3,6).replace(/ /g, '');

      const valor3= sinEspacios.slice(6,9).replace(/ /g, '');
      return valor1 + ' ' + valor2 + ' ' + valor3;

    };
  }

}
