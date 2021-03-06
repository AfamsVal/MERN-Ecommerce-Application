import axios from "axios";
import {
  CART_ADD_ITEM,
  CART_EMPTY_ITEM,
  CART_LOADING_ITEM,
  CART_LOADING_DEL_ITEM,
  CART_REMOVE_ITEM,
  SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
} from "../constant/cartConstant";

export const cartAction = (id, qty) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/products/${id}`);
  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      product: data._id,
      name: data.name,
      category: data.category,
      images: data.images,
      price: data.price,
      countInStock: data.countInStock,
      qty,
    },
  });
  dispatch(loadingCartItem(false, null));
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const deleteCartAction = (id) => async (dispatch) => {
  dispatch(loadingCartItem(null, true));
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  });
  dispatch(loadingCartItem(null, false));
  const itemStorage = JSON.parse(localStorage.getItem("cartItems")).filter(
    (cart) => cart.product !== id
  );
  localStorage.setItem("cartItems", JSON.stringify(itemStorage));
};

export const loadingCartItem = (status, del) => async (dispatch) => {
  status !== null && dispatch({ type: CART_LOADING_ITEM, payload: status });
  del !== null && dispatch({ type: CART_LOADING_DEL_ITEM, payload: del });
};

export const emptyCartAction = () => async (dispatch) => {
  dispatch({
    type: CART_EMPTY_ITEM,
    payload: [],
  });
  localStorage.removeItem("cartItems");
};

export const saveShippingAddress = (data) => (dispatch) => {
  dispatch({
    type: SAVE_SHIPPING_ADDRESS,
    payload: data,
  });
  localStorage.setItem("shippingAddress", JSON.stringify(data));
};

export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({ type: CART_SAVE_PAYMENT_METHOD, payload: data });
  localStorage.setItem("paymentMethod", JSON.stringify(data));
};
