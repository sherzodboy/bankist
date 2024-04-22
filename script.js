'use strict';
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400.123124, 3000.4545, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2022-11-01',
    '2022-11-30',
    '2022-12-25',
    '2023-01-25',
    '2023-02-05',
    '2024-04-15',
    '2024-04-18',
    '2024-04-19',
  ],
  lang: 'en-US',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150.123123, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2022-11-01',
    '2022-11-30',
    '2022-12-25',
    '2023-01-25',
    '2023-02-05',
    '2023-04-10',
    '2023-06-25',
    '2023-07-26',
  ],
  lang: 'de-DE',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2022-11-01',
    '2022-11-30',
    '2022-12-25',
    '2023-01-25',
    '2023-02-05',
    '2023-04-10',
    '2023-06-25',
    '2023-07-26',
  ],
  lang: 'en-NZ',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2022-11-01',
    '2022-11-30',
    '2022-12-25',
    '2023-01-25',
    '2023-02-05',
    '2023-04-10',
    '2023-06-25',
    '2023-07-26',
  ],

  lang: 'ko-KR',
};

const accounts = [account1, account2, account3, account4];

// Elements
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

const formatMovementsDate = (date) => {
  const calcPassedDays = (day1, day2) => {
    return Math.abs((day1 - day2) / (1000 * 60 * 60 * 24));
  };

  const passedDays = Math.floor(calcPassedDays(new Date(), date));

  if (passedDays === 0) return 'Today';
  if (passedDays === 1) return 'Yesterday';
  if (passedDays <= 7) return `${passedDays} days ago`;
  else {
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    return `${year}/${month}/${day}`;
  }
};

const displayMovements = (acc, sort = false) => {
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  containerMovements.innerHTML = '';

  movs.forEach((move, idx) => {
    const type = move > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[idx]);
    const displayDate = formatMovementsDate(date);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      idx + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${move.toFixed(2)}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = (acc) => {
  acc.balance = acc.movements.reduce((acc, cur) => {
    return acc + cur;
  }, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const calcDisplaySummary = (acc) => {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((mov) => (mov * acc.interestRate) / 100)
    .filter((mov) => mov > 1)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const createUsernames = (accs) => {
  accs.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map((name) => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUi = (acc) => {
  // Display Movements
  displayMovements(acc);

  // Display Balance
  calcDisplayBalance(acc);

  // Display Summary
  calcDisplaySummary(acc);
};

let currectAccount;

btnLogin.addEventListener('click', function (evt) {
  evt.preventDefault();

  currectAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  if (currectAccount?.pin === Number(inputLoginPin.value)) {
    // Display message
    labelWelcome.textContent = `Welcome Back, ${
      currectAccount.owner.split(' ')[0]
    }`;
    // Display UI
    containerApp.style.opacity = 1;

    inputLoginUsername.value = '';
    inputLoginPin.value = '';

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currectAccount.lang,
      options
    ).format(now);

    updateUi(currectAccount);
  }
});

btnTransfer.addEventListener('click', function (evt) {
  evt.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiveAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = '';
  inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiveAcc &&
    currectAccount.balance > amount &&
    currectAccount.username !== receiveAcc?.username
  ) {
    currectAccount.movements.push(-amount);
    receiveAcc.movements.push(amount);

    currectAccount.movementsDates.push(new Date().toISOString());
    receiveAcc.movementsDates.push(new Date().toISOString());

    console.log(currectAccount.movementsDates);
  }

  updateUi(currectAccount);
});

btnLoan.addEventListener('click', function (evt) {
  evt.preventDefault();

  const amount = Number(inputLoanAmount.value);

  setTimeout(() => {
    if (
      amount > 0 &&
      currectAccount.movements.some((mov) => mov >= amount * 0.1)
    ) {
      currectAccount.movements.push(amount);
      currectAccount.movementsDates.push(new Date().toISOString());
    }
    inputLoanAmount.value = '';
    updateUi(currectAccount);
  }, 2500);
});

btnClose.addEventListener('click', function (evt) {
  evt.preventDefault();

  const index = accounts.findIndex(
    (acc) => acc.username === inputCloseUsername.value
  );

  if (
    currectAccount.username === inputCloseUsername.value &&
    currectAccount.pin === Number(inputClosePin.value)
  ) {
    containerApp.style.opacity = 0;
    accounts.splice(index, 1);
  }
  inputCloseUsername.value = '';
  inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', (evt) => {
  evt.preventDefault();
  displayMovements(currectAccount, !sorted);
  sorted = !sorted;
});