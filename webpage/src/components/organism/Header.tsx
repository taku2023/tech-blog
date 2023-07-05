import { PopupMenu } from "@/components/atom/PopupMenu"
import SearchBox from "@/components/molecular/SearchBox"
import ModalLayout from "@/components/template/ModalLayout"
import { useTheme } from "@/hooks/useThemeProvider"
import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./Header.scss"

const Header = () => {
  const { theme, setTheme } = useTheme()
  const [open, expand] = useState(false)
  const nav = useNavigate()

  const changeTheme = () => {
    setTheme(theme == "light" ? "dark" : "light")
  }

  const toggleMenu = (_: any) => {
    expand(!open)
  }

  const toggleIcon = useRef<HTMLSpanElement>(null)

  const [menus, setMenus] = useState<{ contact: boolean }>({
    contact: false,
  })

  const [showModal, setShowModal] = useState(false)

  /**
   * detect click outside of toggleIcon
   */
  useEffect(() => {
    const handleOnClick = (ev: Event) => {
      const target = ev.target
      if (
        target instanceof Node &&
        (!toggleIcon?.current?.contains(target) ?? false)
      ) {
        ev.preventDefault()
        expand(false)
        setMenus({ contact: false })
      }
    }

    document.addEventListener("mousedown", handleOnClick)

    return () => {
      document.removeEventListener("mousedown", handleOnClick)
    }
  }, [toggleIcon])

  return (
    <>
      <header id="header" className="header is-background">
        <nav className="header-nav">
          <p className="header-nav-title title">
            <Link to={"/"} style={{ textDecoration: "none" }} className="title">
              Taku.dev
            </Link>
          </p>
          <span className="is-tablet body ml-4">
            <span className="is-relative">
              Contact
              <span
                className="icon material-symbols-outlined is-clickable"
                ref={toggleIcon}
                onClick={(e) => {
                  e.preventDefault()
                  setMenus({ contact: !menus.contact })
                }}
              >
                {menus.contact ? "expand_less" : "expand_more"}
              </span>
              <PopupMenu isOpen={menus.contact}>
                <ul>
                  <li>
                    <Link className="body text-no-decoration" to={"about-me"}>
                      About me
                    </Link>
                  </li>
                  <li>
                    <Link className="body text-no-decoration" to={"job-offer"}>
                      Job Offer
                    </Link>
                  </li>
                </ul>
              </PopupMenu>
            </span>
          </span>
          <span
            className="icon material-symbols-outlined is-clickable ml-auto"
            onClick={() => setShowModal(true)}
          >
            search
          </span>
          <span
            className="icon material-symbols-outlined is-clickable"
            onClick={(_) => changeTheme()}
          >{`${theme}_mode`}</span>
          <span
            className="icon material-symbols-outlined is-clickable not-tablet"
            onClick={toggleMenu}
          >
            {open ? "close" : "menu"}
          </span>
        </nav>
        <section
          className="header-menu px-4 pt-2 pb-4 not-tablet"
          hidden={!open}
        >
          <div className="mt-1">
            <label className="label">Contacts</label>
            <ul>
              <li>
                <Link to={"about-me"} className="text-no-decoration body">
                  About me
                </Link>
              </li>
              <li>Job Offer</li>
            </ul>
          </div>
        </section>
      </header>
      <ModalLayout state={[showModal, setShowModal]}>
        <SearchBox></SearchBox>
      </ModalLayout>
    </>
  )
}

export { Header as default }
