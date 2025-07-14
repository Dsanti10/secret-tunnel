import { createContext, useContext, useEffect, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      sessionStorage.setItem("token", token);
    } else {
      sessionStorage.removeItem("token");
    }
  }, [token]);

  // TODO: signup
  async function signup() {
    try {
      const response = await fetch(API + "/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "Devin",
        }),
      });

      const result = await response.json();
      setToken(result.token);
      setLocation("TABLET");

      return result.token;
    } catch (e) {
      console.error("oh no!", e);
    }
  }

  // TODO: authenticate

  async function authenticate() {
    try {
      if (!token) {
        throw new Error("No token found");
      } else {
        const response = await fetch(API + "/authenticate", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error("Failed request");
        } else {
          setLocation("TUNNEL");
        }
        return result;
      }
    } catch (error) {
      console.error(error);
    }
  }

  const value = { location, signup, authenticate };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
