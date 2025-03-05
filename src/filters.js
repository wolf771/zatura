import { store } from './store' 

import momentjs from 'moment'
const filters = {
  truncateText,
  moment,
  calcPrice,
  formatPrice
}

function truncateText (text, start, end) {
  if (text.length <= end) return text;
  return text.substr(start, end) + '...';
}

function moment (date, format) {
  return momentjs(date).format(format);
}

function calcPrice(val) {
  const fi = {
    // model -> view
    // formats the value when updating the input element.
    read: function(val) {
      return '$'+val.toFixed(2)
    },
    // view -> model
    // formats the value when updating the data.
    write: function(val, oldVal) {
      var number = +val.replace(/[^\d.]/g, '')
      return isNaN(number) ? 0 : number
    }
  }

   return fi;
}

function formatPrice(amount) {
  //return parseFloat(val).toFixed(2);
  let decimalCount = 2, decimal = ",", thousands = ".";

  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
    let j = (i.length > 3) ? i.length % 3 : 0;

    return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
  } catch (e) {
    console.log(e)
  }
}

export default filters