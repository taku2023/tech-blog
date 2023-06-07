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
  className?: string
}

const MenuButton = (props: Props) => {
  return (
    <div className={props.className ?? ""}>
      <div
        className={`menu-button ${props.isOpen ? "is-open" : ""}`}
        onClick={props.onClick}
      >
        <span className="menu-button-line"></span>
        <span className="menu-button-line"></span>
        <span className="menu-button-line"></span>
      </div>
    </div>
  )
}

export default MenuButton
