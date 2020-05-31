import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";
import * as types from "./types";
import CartModel from "@/models/CartModel";

Vue.use(Vuex);

// debug the app based on environment
const debug = process.env.NODE_ENV !== "production";

// Use Vuex Persist to persist in local storage
const vuexPersist = new VuexPersist({
  key: "rotate-app",
  storage: window.localStorage
});

/* NOTE:
 *  I have used single file store because the app is simple,
 *  Otherwise, I would have used module approach.
 */

export default new Vuex.Store({
  strict: debug,
  plugins: [vuexPersist.plugin], // --> with this plugin we store in local storage
  state: {
    cart: Array<CartModel>(),
    cartQuantity: 0,
    toggleCart: false,
    products: require("../mocks/products.json")
  },

  actions: {
    addToCart({ commit }, product) {
      commit(types.ADD_TO_CART, { id: product.id });
    },
    updateCartItems({ commit }, quantity) {
      commit(types.UPDATE_CART_QUANTITY, { quantity });
    },
    removeFromCart({ commit }, product) {
      commit(types.REMOVE_FROM_CART, { product });
    },
    updateItemQuantity({ commit }, { product, quantity }) {
      commit(types.UPDATE_ITEM_QUANTITY, { product, quantity });
    },
    toggleCart({ commit }, toggle) {
      commit(types.TOGGLE_CART, toggle);
    }
  },

  mutations: {
    [types.ADD_TO_CART](state, { id }) {
      const record = state.cart.find(product => product.id === id);
      if (!record) {
        state.cart.push({
          id,
          quantity: 1
        });
      } else {
        record.quantity++;
      }
    },
    [types.UPDATE_CART_QUANTITY](state, { quantity }) {
      state.cartQuantity = quantity;
    },
    [types.REMOVE_FROM_CART](state, { product }) {
      const index = state.cart.map(item => item.id).indexOf(product.id);
      state.cart.splice(index, 1);
      state.cartQuantity -= product.quantity;
    },
    [types.UPDATE_ITEM_QUANTITY](state, { product, quantity }) {
      const index = state.cart.findIndex(item => item.id === product.id);
      if (quantity > product.quantity) {
        state.cartQuantity += quantity - product.quantity;
      } else if (quantity < product.quantity) {
        state.cartQuantity -= product.quantity - quantity;
      }
      state.cart[index].quantity = quantity;
    },
    [types.TOGGLE_CART](state, toggle) {
      state.toggleCart = toggle;
    }
  },

  getters: {
    products: state => state.products,

    cartQuantity: state => state.cartQuantity,

    cart: state => state.cart,

    cartProducts: state => {
      return state.cart.map(({ id, quantity }) => {
        const product = state.products.find(p => p.id === id);
        return { ...product, quantity };
      });
    },

    toggleCart: state => state.toggleCart
  },

  modules: {}
});
