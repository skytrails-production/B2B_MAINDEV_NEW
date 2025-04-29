// import { legacy_createStore, applyMiddleware, compose } from "redux";
// import { persistStore, persistReducer } from "redux-persist";
// // import storage from "redux-persist/lib/storage";
// import storage from "redux-persist/lib/storage";

// import SecureStorage from 'react-secure-storage';
// import rootReducer from "./root-reducer";

// import createSagaMiddleware from "@redux-saga/core";
// import { rootSaga } from "./rootSaga";

// // const data = SecureStorage.setItem(storage)

// const persistConfig = {
//   key: "root",
//   storage,
// };
// const persistedReducer = persistReducer(persistConfig, rootReducer);

// const sagaMiddleware = createSagaMiddleware();
// export const store = legacy_createStore(
//   // rootReducer,
//   persistedReducer,
//   compose(
//     applyMiddleware(sagaMiddleware)
//     // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//   )
// );

// sagaMiddleware.run(rootSaga);
// export const persistor = persistStore(store);
// export default store;
// new logic where we are saving our redux data into localstorage in the encrypted format

import { legacy_createStore, applyMiddleware, compose } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import SecureStorage from "react-secure-storage";
import rootReducer from "./root-reducer";
import createSagaMiddleware from "@redux-saga/core";
import { rootSaga } from "./rootSaga";

// Custom storage engine for redux-persist using SecureStorage
const secureStorageEngine = {
  getItem: async (key) => {
    const value = await SecureStorage.getItem(key);
    return JSON.parse(value);
  },
  setItem: async (key, value) => {
    await SecureStorage.setItem(key, JSON.stringify(value));
  },
  removeItem: async (key) => {
    await SecureStorage.removeItem(key);
  },
};

const persistConfig = {
  key: "root",
  storage: secureStorageEngine,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const sagaMiddleware = createSagaMiddleware();
export const store = legacy_createStore(
  persistedReducer,
  compose(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga);
export const persistor = persistStore(store);
export default store;
