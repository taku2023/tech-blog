import MenuButton from "@/components/atom/MenuButton"
import SearchBox from "@/components/molecular/SearchBox"
import { useState } from "react"
import "./Header.sass"

type Menu = "menu" | "search"

const useHeaderExpandState = () => {
  const [expand, setExpand] = useState<Menu>()

  const reset = () => {
    setExpand(undefined)
  }

  const clickMenu = (menu: Menu) => {
    switch (menu) {
      case "menu":
        setExpand(expand == "menu" ? undefined : "menu")
        break
      case "search":
        setExpand(expand == "search" ? undefined : "search")
        break
    }
  }

  return {
    expand,
    reset,
    clickMenu,
  }
}

type Props = {
  expand?: Menu
  clickMenu: (menu: Menu) => void
}

const Header = (props: Props) => {
  //const { expand, clickMenu } = useHeaderExpandState()
  return (
    <>
      <header id="header" className="bg-light">
        <MenuButton
          isOpen={props.expand == "menu"}
          onClick={(_) => props.clickMenu("menu")}
        ></MenuButton>
        <p className="header-title title">CatCoder</p>
        <span
          className="material-symbols-outlined"
          onClick={(_) => props.clickMenu("search")}
        >
          search
        </span>
        <section
          about="menu"
          className="header-nav"
          hidden={props.expand != "menu"}
        >
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
          hidden={props.expand != "search"}
          className="header-nav"
        >
          <SearchBox></SearchBox>
        </section>
      </header>
    </>
  )
}

export { Header as default, useHeaderExpandState }
