import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";

import { motion } from "framer-motion";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faX } from "@fortawesome/free-solid-svg-icons";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function Navbar({ id }) {
  const [expand, setExpand] = useState(false);
  return (
    <>
      <div className="navbar">
        <div className="navbar-left">
          <Link href="/">
            emptea <span className="marked">oxygen</span>
          </Link>
        </div>
        <div className="navbar-right">
          <WalletMultiButtonDynamic />
        </div>
        <div className="navbar-right-mobile">
          <button
            onClick={() => setExpand(!expand)}
            className="navbar-hamburger-button"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      </div>

      {expand == true ? (
        <motion.div className="navbar-hamburger">
          <ul className="navbar-list">
            <li>
              <WalletMultiButtonDynamic />
            </li>
          </ul>
        </motion.div>
      ) : (
        <></>
      )}
    </>
  );
}
