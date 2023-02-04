import { useState, useEffect } from "react";
import Link from "next/link";
import Switch from "@mui/material/Switch";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export default function Footer() {
  const [hiding, setHiding] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [count, setCount] = useState(0);
  const hideSwitchHandler = (event) => {
    setHiding(event.target.checked);
  };
  const dragSwitchHandler = (event) => {
    setDarkMode(event.target.checked);
  };

  useEffect(() => {
    if (darkMode) {
      const root = document.querySelector(":root");
      root.style.setProperty("--black", "black");
      root.style.setProperty("--white", "white");
      root.style.setProperty("--white-faded", "rgba(255, 255, 255, 0.2)");
      root.style.setProperty("--black-faded", "rgba(0, 0, 0, 0.2)");
    } else if (!darkMode) {
      const root = document.querySelector(":root");
      root.style.setProperty("--black", "white");
      root.style.setProperty("--white", "black");
      root.style.setProperty("--black-faded", "rgba(255, 255, 255, 0.2)");
      root.style.setProperty("--white-faded", "rgba(0, 0, 0, 0.2)");
    }
  });

  const theme = createTheme({
    palette: {
      primary: {
        main: "#000000",
      },
      secondary: {
        main: "#6cafdb",
      },
    },
  });

  return (
    <div className="footer">
      <div className="footer-left"></div>
      <div className="footer-right">
        <ul>
          <li>
            <Link href="https://twitter.com/empteaxyz" target={"_blank"}>
              twitter
            </Link>
          </li>
          <li>
            <Link href="https://discord.gg/D5YCfRjSDY" target={"_blank"}>
              discord
            </Link>
          </li>
          <li>
            <Link href="https://emptea.xyz" target={"_blank"}>
              emptea
            </Link>
          </li>

          <li>
            <ThemeProvider theme={theme}>
              <Switch
                color="secondary"
                checked={darkMode}
                onChange={dragSwitchHandler}
              />
            </ThemeProvider>
          </li>
        </ul>
      </div>
    </div>
  );
}
