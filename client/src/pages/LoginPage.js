import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginAction } from "../action/userAction";
import { progressAction } from "../action/progressBarAction";
import { Helmet } from "react-helmet";

const Checkout = ({ location, history }) => {
  const redirect = location.search ? location.search.split("=")[1] : "/";
  const dispatch = useDispatch();
  const data = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = data;

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, redirect, userInfo]);

  const [user, setUser] = useState({ email: "", password: "" });
  const [alert, setAlert] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(progressAction(40));
    dispatch(loginAction(user.email, user.password));
    setAlert(true);
  };

  return (
    <div className="px-2">
      <Helmet>
        <meta name="description" content="Afams Val shopping application" />
        <meta name="keywords" content="buy from landing" />
        <title>Afams Shop - login</title>
        {/* 
        we use this canonical to tell google where we copied the content that we have
         in this page so that it will rank that page higher and direct viewers to that page.
          For example, if we have a blog page that we updated while this it the outdated page which have been 
          indexed by google, we can direct the prospective reader to the new updated page by pointing 
          to the page from this page using the canonical tool
        <link rel="canonical" href="http://mysite.com/example" /> */}
      </Helmet>
      <div className="login-form ">
        <form onSubmit={handleSubmit}>
          <p className="text-center">
            <i className="fa fa-shopping-cart fa-3x"></i>
          </p>
          <h2 className="text-center">Log in</h2>
          {error && alert && (
            <div className="alert alert-danger fade show">
              <button
                type="button"
                className="close"
                onClick={() => setAlert(false)}
              >
                <small>&times;</small>
              </button>
              <strong>Error!</strong> {error}
            </div>
          )}
          <div className="form-group mt-4">
            <input
              type="email"
              className="form-control"
              placeholder="E-mail"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </div>
          <div className="form-group">
            <button
              type="submit"
              disabled={!user.email || !user.password}
              className="font-weight-bold btn btn-dark btn-block"
            >
              {loading && (
                <div className="spinner-border spinner-border-sm"></div>
              )}{" "}
              Log in
            </button>
          </div>
          <div className="clearfix">
            <label className="float-left form-check-label">
              <input type="checkbox" /> Remember me
            </label>
            <Link className="text-dark float-right" to="/forgot-password">
              Forgot Password?
            </Link>
          </div>
          <p className="text-center mt-4">
            <Link
              className="text-dark font-size-1"
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
            >
              <u>Create an Account?</u>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
