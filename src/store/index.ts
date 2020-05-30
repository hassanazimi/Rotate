import Vue from "vue";
import Vuex from "vuex";
import * as types from "./types";
import CartModel from "@/models/CartModel";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

/* NOTE:
 *  I have used single file store because the app is simple,
 *  Otherwise, I would have used module approach.
 */

export default new Vuex.Store({
  strict: debug,

  state: {
    cart: Array<CartModel>(),
    cartItems: 0,
    products: [
      {
        id: 1,
        name: "Aesop Skin In Two Minds Facial Cleanser",
        description:
          "A gentle gel-based formulation that cleanses thoroughly without drying the skin or stripping its natural oils.",
        price: 2300,
        img:
          "Aesop-Skin-In-Two-Minds-Facial-Cleanser-100mL-Large-835x962px.png",
        size: "100 mL"
      },
      {
        id: 2,
        name: "Aesop Skin In Two Minds Facial Cleanser",
        description:
          "A gentle gel-based formulation that cleanses thoroughly without drying the skin or stripping its natural oils.",
        price: 3500,
        img:
          "Aesop-Skin-In-Two-Minds-Facial-Cleanser-200mL-Large-835x962px.png",
        size: "200 mL"
      }
    ]
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
    updateItemQuantity({ commit }, { id, quantity }) {
      commit(types.UPDATE_ITEM_QUANTITY, { id, quantity });
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
      state.cartItems = quantity;
    },
    [types.REMOVE_FROM_CART](state, { product }) {
      const index = state.cart.map(item => item.id).indexOf(product.id);
      state.cart.splice(index, 1);
      state.cartItems -= product.quantity;
    },
    [types.UPDATE_ITEM_QUANTITY](state, { id, quantity }) {
      const index = state.cart.findIndex(item => item.id === id);
      state.cart[index].quantity = quantity;
    }
  },

  getters: {
    products: state => state.products,

    cartItems: state => state.cartItems,

    cart: state => state.cart,

    cartProducts: state => {
      return state.cart.map(({ id, quantity }) => {
        const product = state.products.find(p => p.id === id);
        return { ...product, quantity };
      });
    }
  },

  modules: {}
});
