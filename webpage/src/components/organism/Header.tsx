import { useState } from "react";
import MenuButton from "../atom/MenuButton";
import "./Header.sass";

const Header = () => {
  const [expand, setExpand] = useState(false);

  return (
    <>
      <header id="header" className="">
        <MenuButton
          isOpen={expand}
          onClick={(_) => setExpand(!expand)}
        ></MenuButton>
        <p className="header-title title">CatCoder</p>
        <section about="search" className="header-nav" hidden={!expand}>
          <ul className="menu">
            <label className="label menu-label">Blogs Category</label>
            <li className="menu-content">Readability</li>
            <li className="menu-content">Architecture</li>
            <li className="menu-content">Test</li>
          </ul>
          <ul className="menu mt-1">
            <label className="label menu-label">Contacts</label>
            <li className="menu-content">Job Offer</li>
            <li className="menu-content">
              Give me Coffee
              <span className="material-symbols-outlined menu-icon">coffee</span>
            </li>
          </ul>
        </section>
      </header>
    </>
  );
};

export default Header;
