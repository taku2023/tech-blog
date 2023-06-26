import { PopupMenu } from "@/components/atom/PopupMenu"
import Tags from "@/components/atom/Tags"
import ModalLayout from "@/components/template/ModalLayout"
import { useTheme } from "@/hooks/useThemeProvider"
import { useEffect, useRef, useState } from "react"
import "./Header.scss"
import SearchBox from "../molecular/SearchBox"

const Header = () => {
  const { theme, setTheme } = useTheme()
  const [open, expand] = useState(false)

  const changeTheme = () => {
    setTheme(theme == "light" ? "dark" : "light")
  }

  const toggleMenu = (_: any) => {
    expand(!open)
  }

  const header = useRef<HTMLHeadElement>(null)
  const [menus, setMenus] = useState<{ contact: boolean; blog: boolean }>({
    contact: false,
    blog: false,
  })

  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const handleOnClickOutside = (ev: Event) => {
      const target = ev.target
      if (
        target instanceof Node &&
        (!header?.current?.contains(target) ?? false)
      ) {
        ev.preventDefault()
        expand(false)
        setMenus({ contact: false, blog: false })
      }
    }

    document.addEventListener("mousedown", handleOnClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleOnClickOutside)
    }
  }, [header])

  return (
    <>
      <header id="header" className="header is-background" ref={header}>
        <nav className="header-nav">
          <p className="header-nav-title title">Taku.dev</p>
          <span className="is-tablet body ml-4">
            <span className="is-relative">
              Contact
              <span
                className="icon material-symbols-outlined is-clickable"
                onClick={(_) =>
                  setMenus({ blog: false, contact: !menus.contact })
                }
              >
                {menus.contact ? "expand_less" : "expand_more"}
              </span>
              <PopupMenu isOpen={menus.contact}>
                <ul className="body">
                  <li>About me</li>
                  <li>Job Offer</li>
                </ul>
              </PopupMenu>
            </span>
            <span className="is-relative">
              Blogs
              <span
                className="icon material-symbols-outlined is-clickable"
                onClick={(_) => setMenus({ contact: false, blog: !menus.blog })}
              >
                {menus.blog ? "expand_less" : "expand_more"}
              </span>
              <PopupMenu isOpen={menus.blog}>
                <>
                  <p className="label">You can search </p>
                  <Tags tags={["nodeJs", "Rust"]}></Tags>
                </>
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
          <div>
            <label className="label">Blog category</label>
            <Tags tags={["nodeJs", "Rust"]}></Tags>
          </div>
          <div className="mt-1">
            <label className="label">Contacts</label>
            <ul className="body text-indent">
              <li>About me</li>
              <li>Job Offer</li>
            </ul>
          </div>
        </section>
      </header>
      <ModalLayout state={[showModal, setShowModal]}>
        <>
              <SearchBox></SearchBox>
        </>
      </ModalLayout>
    </>
  )
}

export { Header as default }
