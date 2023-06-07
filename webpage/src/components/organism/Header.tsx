import MenuButton from "@/components/atom/MenuButton"
import SearchBox from "@/components/molecular/SearchBox"
import { useState } from "react"
import "./Header.sass"

const Header = () => {
  type Menu = "menu" | "search"
  const [expand, setExpand] = useState<Menu>()

  return (
    <>
      <header id="header" className="">
        <MenuButton
          isOpen={expand == "menu"}
          onClick={(_) => setExpand(expand == "menu" ? undefined : "menu")}
        ></MenuButton>
        <p className="header-title title">CatCoder</p>
        <span
          className="material-symbols-outlined"
          onClick={(_) => setExpand(expand == "search" ? undefined : "search")}
        >
          search
        </span>
        <section about="menu" className="header-nav" hidden={expand != "menu"}>
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
              <span className="material-symbols-outlined menu-icon">
                coffee
              </span>
            </li>
          </ul>
        </section>
        <section
          about="search"
          hidden={expand != "search"}
          className="header-nav"
        >
          <SearchBox></SearchBox>
        </section>
      </header>
    </>
  )
}

export default Header
