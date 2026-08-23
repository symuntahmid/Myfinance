"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";


type Theme = "light" | "dark";


type ThemeContextType = {

  theme: Theme;

  toggleTheme: () => void;

  setTheme: (theme: Theme) => void;

};



const ThemeContext =
  createContext<ThemeContextType | undefined>(
    undefined
  );



const STORAGE_KEY =
  "myfinance-theme";





function applyTheme(
  value: Theme
) {

  const root =
    document.documentElement;


  if(value === "dark"){

    root.classList.add(
      "dark"
    );

  } else {

    root.classList.remove(
      "dark"
    );

  }

}





export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {


  const [theme,setThemeState] =
    useState<Theme>("light");


  const [mounted,setMounted] =
    useState(false);




  /* ===============================
     LOAD SAVED THEME
  =============================== */


  useEffect(()=>{


    const saved =
      localStorage.getItem(
        STORAGE_KEY
      ) as Theme | null;



    const currentTheme =
      saved ?? "light";



    setThemeState(
      currentTheme
    );


    applyTheme(
      currentTheme
    );


    setMounted(true);


  },[]);







  /* ===============================
     CHANGE THEME
  =============================== */


  const setTheme = (
    value: Theme
  ) => {


    setThemeState(
      value
    );


    localStorage.setItem(
      STORAGE_KEY,
      value
    );


    applyTheme(
      value
    );


  };







  /* ===============================
     TOGGLE
  =============================== */


  const toggleTheme = () => {


    setTheme(

      theme === "light"
      ? "dark"
      : "light"

    );


  };







  if(!mounted){

    return null;

  }






  return (

    <ThemeContext.Provider

      value={{
        theme,
        toggleTheme,
        setTheme,
      }}

    >

      {children}

    </ThemeContext.Provider>

  );

}







export function useTheme(){


  const context =
    useContext(
      ThemeContext
    );



  if(!context){

    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );

  }


  return context;


}