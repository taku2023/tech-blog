import { Dispatch, MouseEvent, ReactNode, SetStateAction, useRef } from "react"
import { createPortal } from "react-dom"
import "./ModalLayout.scss"
interface Props {
  children: ReactNode
  state: [boolean, Dispatch<SetStateAction<boolean>>]
}
const ModalLayout = (props: Props) => {
  const [showModal, setShowModal] = props.state
  const modal = useRef<HTMLDivElement>(null)

  const handleClickOutside = (ev: MouseEvent) => {
    if (
      ev.target instanceof Node &&
      (!modal?.current?.contains(ev.target) ?? false)
    ) {
      ev.preventDefault()
      setShowModal(false)
    }
  }

  return (
    <>
      {showModal &&
        createPortal(
          <section id="modal" onClick={handleClickOutside}>
            <div
              className="modal-content is-background border-radius-1 p-4"
              ref={modal}
            >
              {props.children}
            </div>
          </section>,
          //document.getElementById('root') cannot apply theme
          document.getElementById("theme")!!
        )}
    </>
  )
}

export default ModalLayout
