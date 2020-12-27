(function(){
  
  const $usersElems = document.querySelectorAll('[data-user]'),
        $percentElems = document.querySelectorAll('[data-percent]'),
        $userTitle = document.querySelector('[data-user-title]'),
        $inputTitle = document.querySelector('[data-input-title]'),
        $input = document.querySelector('[data-input]'),
        $arrow = document.querySelector('[data-arrow]'),
        $transactionValue = document.querySelector('[data-transaction-value]'),
        $calcBtn = document.querySelector('[data-calc-btn]'),
        $history = document.querySelector('[data-history]'),
        $notifications = document.querySelector('[data-notifictaions]');

  const numberPattern = /^\d+$/;

  const errorMessages = {
    errorMsgUser: 'Choose one of the cats',
    errorMsgInput: 'How much money did you spend?',
  }

  let state = {
    activeUser: '0',
    activePercent: null,
    inputValue: 0,
    richestPerson: '0',
    transactionValue: 0,
    defaultUserText: '',
    usersSum: [0, 0],
    defaultPercentText: 'Your investment',
    defaultInputText: 'Your payment',
  };

  $userTitle.textContent = state.defaultUserText;
  $inputTitle.textContent = state.defaultInputText;

  // user click handler
  $usersElems.forEach($user => {
    $user.addEventListener('click', function(event) {
      const $userBtn = this;
      state.activeUser = $userBtn.dataset.user;
      $userTitle.textContent = state.defaultUserText;

      if (state.activeUser === '1') {
        state.activePercent = 67;
      }

      if (state.activeUser === '2') {
        state.activePercent = 33;
      }

      $usersElems.forEach(elem => {
        elem.classList.remove('active');
      });

      $percentElems.forEach(elem => {
        elem.classList.remove('active');
      });

      const percentBtn = findActivePercentEl(state.activePercent);
      percentBtn.classList.add('active');
      $userBtn.classList.add('active');
    });
  });

  // percent click handler
  $percentElems.forEach($percentBtn => {
    $percentBtn.addEventListener('click', function(event) {
      $percentElems.forEach(elem => {
        elem.classList.remove('active');
      });

      this.classList.add('active');
      state.activePercent = Number(this.dataset.percent);
    });
  });

  // input handler
  $input.addEventListener('input', function(event) {
    if (event.data === '.' || !numberPattern.test(Number(this.value))) {
      this.value = this.value.slice(0, -1);
      return;
    }

    $inputTitle.textContent = state.defaultInputText;
    state.inputValue = Number(this.value);
  });

  $input.addEventListener('focus', function(event) {
    this.value = '';
    state.inputValue = 0;
  });
  
  document.addEventListener('click', function(event) {
    if (event.target !== $input && event.target !== $calcBtn) {
      $input.blur();
    }
  });

  // carc button handler
  $calcBtn.addEventListener('click', function(evetn) {
    if (state.activeUser === '0') {
      $userTitle.textContent = errorMessages.errorMsgUser;
      return;
    }

    if (state.inputValue <= 0 ) {
      $inputTitle.textContent = errorMessages.errorMsgInput;
      return;
    }

    calculateApp();
    showNotification();

    $input.focus();
  });

  const findActivePercentEl = (percent) => {
    return Array.from($percentElems).find((percentBtn) => {
      return Number(percentBtn.dataset.percent) === percent;
    });
  }

  const calculateApp = () => {
    const sum = state.inputValue - Math.round((state.inputValue * state.activePercent / 100));

    if (
      (state.richestPerson === state.activeUser)
      || (state.richestPerson === "0")
    ) {
      state.transactionValue += sum;
      state.richestPerson = state.activeUser;
    }
    else {
      state.transactionValue -= sum;

      if (state.transactionValue < 0) {
        state.transactionValue = Math.abs(state.transactionValue);
        state.richestPerson = state.activeUser;
      }
    }

    // total of sum
    if (state.activeUser === "1") {
      state.usersSum[0] += state.inputValue - sum;
      state.usersSum[1] += sum;
    }
    else {
      state.usersSum[0] += sum;
      state.usersSum[1] += state.inputValue - sum;
    }

    changeArrowDirection();
    setSumValues();
    $transactionValue.textContent = `${state.transactionValue}`;
  };

  const changeArrowDirection = () => {
    if (state.richestPerson === '1') {
      $arrow.classList.add('reverse');
    } else {
      $arrow.classList.remove('reverse');
    }
  };

  const setSumValues = () => {
    $usersElems[0].querySelector('[data-user-value]').textContent = state.usersSum[0];
    $usersElems[1].querySelector('[data-user-value]').textContent = state.usersSum[1];
  };

  const showNotification = () => {
    const item = document.createElement('div');
    item.className = 'value-item';
    item.textContent = `+ ${state.inputValue}`;
    item.style.backgroundColor = getRandomColor();

    // remove notification
    setTimeout(() => {
      $notifications.firstChild.remove();
    }, 3000);

    $history.append(item.cloneNode(true));
    $notifications.append(item);

    window.requestAnimationFrame(() => {
      item.classList.add('animated');
    });
  };

  const getRandomColor = () =>  {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  calculateApp();

}());


