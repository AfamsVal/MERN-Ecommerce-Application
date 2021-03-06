import { Col } from "antd";
import axios from "axios";
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_ADMIN_DELETE_REQUEST,
  PRODUCT_ADMIN_DELETE_FAIL,
  PRODUCT_ADMIN_DELETE_SUCCESS,
  PRODUCT_ADMIN_UPDATE_REQUEST,
  PRODUCT_ADMIN_UPDATE_FAIL,
  PRODUCT_ADMIN_UPDATE_SUCCESS,
  PRODUCT_ADMIN_CREATE_SUCCESS,
  PRODUCT_ADMIN_CREATE_FAIL,
  PRODUCT_ADMIN_CREATE_REQUEST,
  PRODUCT_SEARCH_REQUEST,
  PRODUCT_SEARCH_SUCCESS,
  PRODUCT_SEARCH_FAIL,
} from "../constant/productConstant.js";

export const listProductsAction = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST });
    const { data } = await axios("/api/products");
    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const productDeleteAction = (productId) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({
      type: PRODUCT_ADMIN_DELETE_REQUEST,
      payload: productId,
    });

    const {
      userInfo: { token },
    } = getState().userLogin;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.delete(`/api/products/${productId}`, config);
    dispatch({ type: PRODUCT_ADMIN_DELETE_SUCCESS });
    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_ADMIN_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const productDetailsAction = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });
    const { data } = await axios(`/api/products/${id}`);
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const adminUpdateProductAction = (productId, productObj) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({ type: PRODUCT_ADMIN_UPDATE_REQUEST });
    const {
      userInfo: { token },
    } = getState().userLogin;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `/api/products/${productId}`,
      productObj,
      config
    );
    dispatch({ type: PRODUCT_ADMIN_UPDATE_SUCCESS });
    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_ADMIN_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const adminCreateProductAction = (productObj) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({ type: PRODUCT_ADMIN_CREATE_REQUEST });
    const {
      userInfo: { token, name },
    } = getState().userLogin;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post("/api/products", productObj, config);
    dispatch({ type: PRODUCT_ADMIN_CREATE_SUCCESS });
    data.user = { name };
    const products = [data, ...getState().productList.products];
    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: products });
  } catch (error) {
    dispatch({
      type: PRODUCT_ADMIN_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const productInputSearch = (input) => async (dispatch, getState) => {
  try {
    dispatch({type:PRODUCT_SEARCH_REQUEST})
    if (input.trim().length > 0) {
      const products = getState().productList.products;
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(input.toLowerCase()) === true
      );
      console.log(filtered);
      if(filtered.length){
        setTimeout(()=> dispatch({ type: PRODUCT_SEARCH_SUCCESS}), 1000) 
        dispatch({ type: PRODUCT_LIST_SUCCESS, payload: filtered });
      }else{
        dispatch({ type: PRODUCT_SEARCH_FAIL});
      }
    } else {
      dispatch(listProductsAction());
    }
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
