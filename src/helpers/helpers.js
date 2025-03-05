import printJS from "print-js";

function downloadBlob(data, nameFile) {
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', nameFile);
  document.body.appendChild(link);
  link.click();
}

function printBlobFile(data, nameFile) {
  const url = window.URL.createObjectURL(new Blob([data], {type: 'application/pdf'}));
  printJS(url)
}


function validateIdentificationLength(type) {
  let rules = 'required'
  switch(type) {
    case '01':
      rules = 'required|integer|min:9|max:9'
    break
    case '02':
      rules = 'required|integer|min:10|max:10'
    break
    case '03':
      rules = 'required|integer|min:11|max:12'
    break
    case '04':
      rules = 'required|integer|min:10|max:10'
    break
  }
  return rules
}

function getCompanyId() {
  let id = false;
  let company = localStorage.getItem('company_default');
  if(company !== "null" && company !== null) {
    id = JSON.parse(company).id
  }
  return id;
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

function calculated_price(price, exchange_rate, currency_item, current_currency, symbol) {

  exchange_rate = parseFloat(exchange_rate);

  symbol = symbol == 2 ? '¢' : '$';

  price = parseFloat(price)

  //SI if calculate para los reportes y balances
    if(currency_item === current_currency) {
      return symbol + price.toFixed(2);
    }

    if(current_currency === 1) {
      return symbol + (price / exchange_rate).toFixed(2);
    } else if(current_currency === 2) {
      return symbol + (price * exchange_rate).toFixed(2);
    }
}

//Devulve string para los reportes en excel
function calculated_price_no_symbol(price, exchange_rate, currency_item, current_currency, symbol) {

  exchange_rate = parseFloat(exchange_rate);

  price = parseFloat(price)

  //SI if calculate para los reportes y balances
    if(currency_item === current_currency) {
      return formatPrice(price);
    }

    if(current_currency === 1) {
      return formatPrice(price / exchange_rate);
    } else if(current_currency === 2) {
      return formatPrice(price * exchange_rate);
    }
}

function truncateTwoDecimalWithoutRound(num, fixed = 2) {
  let re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
  return parseFloat(num.toString().match(re)[0]);
}


export default {
  downloadBlob,
  printBlobFile,
  validateIdentificationLength,
  getCompanyId,
  formatPrice,
  calculated_price,
  calculated_price_no_symbol,
  truncateTwoDecimalWithoutRound
}