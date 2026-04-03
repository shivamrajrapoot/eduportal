import React, { useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  const getUser = useCallback(async () => {
    const token = searchParams.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      window.__accessToken__ = token;
      const res = await axiosInstance.get("/user/profile");
      const userData = res.data.data.user; // data.data.user — fix

      login(token, {
        userId: userData._id, // id ki jagah userId
        name: userData.name, // name bhi daalo
        email: userData.email, // email bhi daalo
        mobile: userData.mobile,
        role: userData.role,
      });

      if (!userData.mobile) {
        navigate("/complete-profile");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      navigate("/login");
    }
  }, [searchParams, login, navigate]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return <p>Loading...</p>;
};

export default OAuthSuccess;
