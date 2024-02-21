'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-01-06T17:01:17.194Z',
    '2024-01-20T23:36:17.929Z',
    '2024-01-30T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
// labels is all the things where we put some text

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = ''; // HTML returns everything including the HTML unlike textContent. Then, here the innerHTML is set to ''
  // .textContent = 0 // recall how many textContent were set to 0 in the pig game

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}; // instead of writing code in the global context, it's a good practice to always create a function. Also, instead of having function work with a global variable, pass the data that function needs directly into that function, e.g the movements parameter standing in for data needed

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};
// calcDisplayBalance(account1.movements); // To be gotten when we get the data that we want to display also, not to be hard-coded

// About chaining methods
// Firstly, we should not overuse chaining,so we should try to optimize it (conpress functionality) because chaining tons of methods one after the other can cause a real performance issues if we have really huge arrays. Secondly, it is a bad practice in JavaScript to chain methods that mutate the underlying original array. And an example of that is the splice method. So again, you should not chain a method like the splice or the reverse method. it's usually always a good practice to avoid mutating arrays.
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};
// calcDisplaySummary(account1.movements); // To be gotten when we get the data that we want to display also, not to be hard-coded

const user = 'Steven Thomas Williams'; // stw
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0]) // allows us to create A NEW SIMPLE ARRAY which only contains the initials of whatever name it is used on.
      .join('');
    // in this function, we do not return anything, because what we're doing here is to produce a side effect. So we are doing something to this account object here. And so there is no need to return anything. We are just doing some work here, basically, we are not creating a new value to return.
  }); // for each method, a great use case to produce some so called side effects in other words, to simply do some work without returning anything. And so that's what we did here, we simply looped over the accounts array, and in each iteration, we manipulated the current account object, and edit a username to it based on the account owner plus all of these transformations that we had already done before.
};
createUsernames(accounts);
// console.log(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogoutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer),
        (labelWelcome.textContent = 'Log in to get started');
      containerApp.style.opacity = 0;
    }

    // Decrease 1s
    time--;
  };

  // Set time to 5 seconds
  let time = 1200;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer; // So here, we will return to timer and that's important because to clear the timer, so to use the clear interval function, we need the timer variable.
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer; // we need this timer variable to persist between different logins;

// FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Create current date and time
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long', //  ('short', 'narrow')
    };
    const locale = navigator.language;
    // console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Timer
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  // console.log(amount, receiverAcc);
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the TRANSFER
    currentAccount.movements.push(amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset Timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // Reset Timer
      clearInterval(timer);
      timer = startLogoutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

// both the find and findIndex methods get access to also the current index, and the current entire array. And second, the both the find and findIndex methods were added to JavaScript in ES6.

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/*
///////////////////////////////////////
// Converting and Checking Numbers
// The first thing that you should know about numbers is that in JavaScript, all numbers are presented internally as floating point numbers. So basically, always as decimals, no matter if we actually write them as integers or as decimals. Also, numbers are represented internally in a 64 base 2 format. So that means numbers are always stored in a binary format.

console.log(23 === 23.0);

// Base 10 -> 0 to 9, 1/10 = 0.1, 3/10 = 3.333333333
// Base 2 (Binary) -> 0 and 1
console.log(0.1 + 0.2);
console.log(0.1 + 0.2 === 0.3);

// Conversion
console.log(Number('23'));
console.log(+'23'); // when JavaScript sees the plus operator, it will do type coercion. So it will automatically convert all the operands to numbers.

// Parsing
console.log(Number.parseInt('30px', 10)); // Now, in order to make this work, the string needs to start with a number. Now, the parseInt function actually accepts a second argument, which is the so-called regex. And the regex is the base of the numeral system that we are using.
console.log(Number.parseInt('30px'));

console.log(Number.parseInt('   2.5rem   '));
console.log(Number.parseFloat('      2.5rem   ')); // Now, by the way, these two functions here are actually also so-called global functions. So we say that 'Number' here provides something called a namespace, all right? So a namespace for all these different functions, like parseFloat, and parseInt.

// console.log(parseFloat('      2.5rem   ')); // So we would not have to call them on Number.

// Check if value is NaN
console.log(Number.isNaN(20));
console.log(Number.isNaN('20'));
console.log(Number.isNaN(+'20X'));
console.log(Number.isNaN(23 / 0)); // Dividing by 0 will give infinity

// Checking if value is number
console.log('---- .isFinite() ----');
console.log(Number.isFinite(20));
console.log(Number.isFinite(+'20'));
console.log(Number.isFinite(+'20X'));
console.log(Number.isFinite(23 / 0));

console.log('---- .isInteger() ----');
console.log(Number.isInteger(23));
console.log(Number.isInteger(23.0));
console.log(Number.isInteger(23 / 0));
// // */

/*
///////////////////////////////////////
// Math and Rounding

console.log(Math.sqrt(25));
console.log(25 ** (1 / 2));
console.log(25 ** (1 / 3));

console.log(Math.max(5, 18, 23, 11, 2));
console.log(Math.max(5, 18, '23', 11, 2)); // And this max function here actually does type coercion.
console.log(Math.max(5, 18, '23px', 11, 2));

console.log(Math.min(5, 18, 23, 11, 2));

console.log(Math.PI * Number.parseFloat('10px') ** 2);

console.log(Math.trunc(Math.random() * 6) + 1);

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min;
// 0...1 -> 0...(max - min) -> min...max
console.log(randomInt(10, 20));

// Rounding integers
console.log(Math.trunc(23.3));

console.log(Math.round(23.3));
console.log(Math.round(23.9));

console.log(Math.ceil(23.3));
console.log(Math.ceil(23.9));

console.log(Math.floor(23.3));
console.log(Math.floor('23.9'));

// All of the methods above in this topic do type coercion.

console.log(Math.trunc(23.3));

console.log(Math.trunc(-23.3));
console.log(Math.floor(-23.3));

// Rounding decimals
console.log((2.7).toFixed(0)); // So toFixed will always return a string and not a number. And primitives actually don't have methods. And so behind the scenes, JavaScript will do boxing. And boxing is to basically transform this to a number object, then call the method on that object. And then once the operation is finished it will convert it back to a primitive, okay?
console.log((2.7).toFixed(3));
console.log((2.345).toFixed(2));
console.log(+(2.345).toFixed(2));
*/

/*
///////////////////////////////////////
// The Remainder Operator
console.log(5 % 2);
console.log(5 / 2); // 5 = 2 + 2 + 1

console.log(8 % 3);
console.log(8 / 3); // 8 = 2 * 3 + 2

console.log(6 % 2);
console.log(6 / 2);

console.log(7 % 2);
console.log(7 / 2);

const isEven = n => n % 2 === 0;
console.log(isEven(8));
console.log(isEven(23));
console.log(isEven(514));

labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    // 0, 2, 4, 6
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';
    // 0, 3, 6, 9
    if (i % 3 === 0) row.style.backgroundColor = 'blue';
  });
});
*/

/*
///////////////////////////////////////
// Numeric Separators
// 207,460,000,000
const diameter = 287_460_000_000; // Numeric separators are simply underscores that we can place anywhere that we want in our numbers, and which will make it really easy to understand and to parse numbers this large.
console.log(diameter);

const price = 345_99;
console.log(price);

const transfer1 = 15.0;
const transfer2 = 1_500;

const PI = 3.14_15; // we can only place underscores between numbers.
console.log(PI);

console.log(Number('230_000'));

// If you need to store a number in a string, for example, in an API, or if you get a number as a string from an API, you should not use underscores in there, because then JavaScript will not be able will NOT be able to read it

console.log(parseInt('230_000'));
*/

/*
///////////////////////////////////////
// Working with BigInt
// So we learned in the first lecture of the section that numbers are represented internally as 64 bits. And that means that there are exactly 64 ones or zeros to represent any given number. to represent any given number. Now of these 64 bits only 53 are used to actually store the digits themselves. The rest are for storing the position of the decimal point and the sign.

console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);
console.log(2 ** 53 + 1);
console.log(2 ** 53 + 2);
console.log(2 ** 53 + 3);
console.log(2 ** 53 + 4);

console.log(4578978993846787430209830287487478n);
console.log(BigInt(4578978993));

// Operations
console.log(10000n + 10000n);
console.log(3475989728379643287087329469238647n * 10000000n);
// console.log(Math.sqrt(16n));

const huge = 20284789347580273485782n;
const num = 23;
console.log(huge + BigInt(num));

// Exceptions
console.log(20n > 15);
console.log(20n === 20);
console.log(typeof 20n);
console.log(20n == '20');

console.log(huge + ' is REALLY big!!!');

// Divisions
console.log(11n / 3n); // with BigInt, it will simply then return the closest BigInt.
console.log(10 / 3);
*/

/*
///////////////////////////////////////
// Creating Dates
// Create a date -> There are exactly four ways of creating dates in JS
const now = new Date();
console.log(now);

console.log(new Date('Sun Jan 28 2024 18:04:19'));
console.log(new Date('December 24, 2015'));
console.log(new Date(account1.movementsDates[0])); // the Z been used in the data means it is UTC. So that's the Coordinated Universal Time (UTC), which is basically the time without any time zone (in London, could be anywhere) and also without daylight savings.

console.log(new Date(2037, 10, 19, 15, 23, 5)); // The month here (10) in JavaScript is zero based.

console.log(new Date(0)); // we can also pass into the date constructor function, the amount of milliseconds passed since the beginning of the Unix time, which is January 1, 1970
console.log(new Date(3 * 24 * 60 * 60 * 1000)); // And so this is how we convert from days to milliseconds.

// Working with dates
const future = new Date(2037, 10, 19, 15, 23);
console.log(future);
console.log(future.getFullYear()); // There's also get year, but never use that. Okay, always use get full year.
console.log(future.getMonth()); // remember that this one is zero based, the 10 means Novemeber
console.log(future.getDate());
console.log(future.getDay()); // get day is actually not the day of the month, but the day of the week, okay.
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.toISOString());
console.log(future.getTime()); // Getting the timestamp, remember that the timestamp it is the milliseconds, which have passed since January 1, 1970, so get time.

console.log(new Date(2142253380000)); // And so simply based on the milliseconds that have passed since January 1, 1970.

console.log(Date.now());

future.setFullYear(2040);
console.log(future);
*/

/*
///////////////////////////////////////
// Operations With Dates

const future = new Date(2037, 10, 19, 15, 23);
console.log(+future);

const calcDaysPassed = (date1, date2) =>
  Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

const days1 = calcDaysPassed(new Date(2037, 3, 4), new Date(2037, 3, 14));
console.log(days1); // Now if you need really pretty sighs calculations, for example, including time changes due to daylight saving changes,and other weird edge cases like that, then you should use a date library like moment dot js. And that's a library that's available for free for all JavaScript developers.
*/

/*
///////////////////////////////////////
// Internationalizing Numbers (Intl)

const num = 388234543.45;

const options = {
  style: 'currency',
  unit: 'celsius',
  currency: 'EUR',
  // useGrouping: false,
};

console.log('US:    ', new Intl.NumberFormat('en-US', options).format(num));
console.log(
  'Germany:    ',
  new Intl.NumberFormat('de-DE', options).format(num)
);
console.log('Syria:    ', new Intl.NumberFormat('ar-SY', options).format(num));
console.log(
  navigator.language,
  new Intl.NumberFormat(navigator.language).format(num)
);
*/

/*
///////////////////////////////////////
// Timers
// First, the set timeout timer runs just once, after a defined time, while the set interval timer keeps running basically forever, until we stop it.

// setTimeout
const ingredients = ['olives', 'spinach'];
const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza 🍕 with ${ing1} and ${ing2}`),
  3000,
  ...ingredients
); // As JavaScript hits this line of code here, it will simply basically keep counting the time in the background, and register this callback function to be called after that time has elapsed, this mechanism is called Asynchronous JavaScript.
console.log('Waiting...');

if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

// setInterval
// setInterval(function () {
//   const now = new Date();
//   const hour = `${now.getHours()}`.padStart(2, 0);
//   const min = `${now.getMinutes()}`.padStart(2, 0);
//   const sec = `${now.getSeconds()}`.padStart(2, 0);
//   console.log(`${hour}:${min}:${sec}`);
// }, 1000);
*/
