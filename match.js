//* Select dom element
const matchContainer = document.querySelector(".all-matches");
const addMatchEl = document.querySelector(".lws-addMatch");
const resetBtn = document.querySelector(".lws-reset");

//* Action Identifiers
const INCREMENT = "increment";
const DECREMENT = "decrement";
const RESET = "reset";
const ADD_MATCH = "addMatch";
const DELETE_MATCH = "matchdelete";

//* Action creator
const addMatch = () => {
  return {
    type: ADD_MATCH,
  };
};

const deleteMatch = (payload) => {
  return {
    type: DELETE_MATCH,
    payload,
  };
};

const resetMatch = () => {
  return {
    type: RESET,
  };
};

const incrementScore = (payload) => {
  return {
    type: INCREMENT,
    payload,
  };
};

const decrementScore = (payload) => {
  return {
    type: DECREMENT,
    payload,
  };
};

//* Initial State
const initialState = [
  {
    id: 1,
    score: 0,
  },
];

//* Generate New Id
const generateNewId = (state) => {
  const maxId = state.reduce((maxId, match) => Math.max(match.id, maxId), 0);
  return maxId + 1;
};

//* Create Reducer Function
const matchReducer = (state = initialState, action) => {
  if (action.type === INCREMENT) {
    const incrementState = state.map((item) => {
      if (item.id === action.payload.id) {
        return {
          ...item,
          score: item.score + Number(action.payload.value),
        };
      } else {
        return item;
      }
    });

    return incrementState;
  } else if (action.type === DECREMENT) {
    const decrementState = state.map((item) => {
      if (item.id === action.payload.id) {
        if (item.score >= action.payload.value) {
          return {
            ...item,
            score: item.score - Number(action.payload.value),
          };
        } else {
          alert(
            `Your Value ${action.payload.value} is greater than Match ${item.id} : Score ${item.score}`
          );
          return item;
        }
      } else {
        return item;
      }
    });

    return decrementState;
  } else if (action.type === RESET) {
    const resetScore = state.map((item) => {
      return {
        ...item,
        score: 0,
      };
    });
    return resetScore;
  } else if (action.type === ADD_MATCH) {
    const id = generateNewId(state);
    return [
      ...state,
      {
        id,
        score: 0,
      },
    ];
  } else if (action.type === DELETE_MATCH) {
    const remainingMatch = state.filter((match) => match.id !== action.payload);
    return remainingMatch;
  } else {
    return state;
  }
};

//* Create Store
const store = Redux.createStore(matchReducer);

//* Button clicks and events
addMatchEl.addEventListener("click", () => {
  store.dispatch(addMatch());
});

resetBtn.addEventListener("click", () => {
  store.dispatch(resetMatch());
});

const deleteMatchHandler = (id) => {
  store.dispatch(deleteMatch(id));
};

const incrementScoreHandler = (id, formElm) => {
  const value = Number(formElm.querySelector(".lws-increment").value);
  store.dispatch(incrementScore({ id, value }));
  formElm.querySelector(".lws-increment").innerHTML = "";
};

const decrementScoreHandler = (id, fromEl) => {
  const value = Number(fromEl.querySelector(".lws-decrement").value);
  store.dispatch(decrementScore({ id, value }));
  fromEl.querySelector(".lws-decrement").innerHTML = "";
};

//* Update UI and subscribe Store

const render = () => {
  const state = store.getState();

  const matchView = state.map((match) => {
    return `
    <div class="match">
    <div class="wrapper">
      <button class="lws-delete" onclick = "deleteMatchHandler(${match.id})">
        <img src="./image/delete.svg" alt="" />
      </button>
      <h3 class="lws-matchName">Match ${match.id}</h3>
    </div>
    <div class="inc-dec">
      <form class="incrementForm" onsubmit = "event.preventDefault(); incrementScoreHandler(${match.id}, this)">
        <h4>Increment</h4>
        <input type="number" name="increment" class="lws-increment" />
      </form>
      <form class="decrementForm" onsubmit = "event.preventDefault(); decrementScoreHandler(${match.id}, this)">
        <h4>Decrement</h4>
        <input type="number" name="decrement" class="lws-decrement" />
      </form>
    </div>
    <div class="numbers">
      <h2 class="lws-singleResult">${match.score}</h2>
    </div>
  </div>
    `;
  });

  matchContainer.innerHTML = matchView;
};

render();
store.subscribe(render);
