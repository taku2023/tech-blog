import { useEffect, useRef } from "react"
import "./ToolTip.scss"

interface Props {
  selector: string
  content: string
}

export const ToopTip = (props: Props) => {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const parent = document.querySelector(props.selector)
    if (!parent) return
    //parent?.insertAdjacentElement('beforebegin',)

    const l = parent.clientLeft + parent.clientWidth / 2
    const t = parent.clientTop + parent.clientHeight
    console.log(l, t)
    //ref?.current?.style?.setProperty("left","")
  }, [])

  return (
    <span className="tooltip" ref={ref}>
      {props.content}
    </span>
  )
}
