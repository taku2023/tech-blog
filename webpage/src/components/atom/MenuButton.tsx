import { MouseEventHandler } from "react"
import "./MenuButton.sass"
/**
 * MenuButton
 *
 * @param props
 * @returns
 */
type Props = {
  isOpen: boolean
  onClick: MouseEventHandler<HTMLElement>
}

const MenuButton = (props: Props) => {
  return (
      /*<div
        className={`menu-button ${props.isOpen ? "is-open" : ""}`}
        onClick={props.onClick}
      >
        <span className="menu-button-line"></span>
        <span className="menu-button-line"></span>
        <span className="menu-button-line"></span>
    </div>*/
    <>
      <span className="material-symbols-outlined">menu</span>
    </>
  )
}

export default MenuButton
