import { ReactNode, useState } from "react"
import "./ToolTip.scss"

interface Props {
  children: ReactNode
  content: string
}

export const ToolTip = (props: Props) => {
  let timeout: NodeJS.Timeout

  const [active, setActive] = useState<string>("disactive")

  const showTip = () => {
    if (timeout) {
      clearTimeout(timeout)
    }
    setActive((_) => "active")
    timeout = setTimeout(() => {
      setActive((_) => "disactive")
    }, 3000)
  }

  const listener: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    showTip()
  }

  return (
    <div onMouseDown={listener} className="tooltip-container">
      {props.children}
      {/^active$/.test(active) && (
        <span className="tooltip">{props.content}</span>
      )}
    </div>
  )
}
