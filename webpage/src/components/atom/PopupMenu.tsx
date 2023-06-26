import { type ReactElement } from "react"
import "./PopupMenu.scss"

interface Props {
  children: ReactElement
  isOpen: boolean
}

export const PopupMenu = (props: Props) => {
  const { children, isOpen } = props

  return (
    <>
      <div className="has-shadow py-2 px-4 popup" hidden={!isOpen}>
        {children}
      </div>
    </>
  )
}
