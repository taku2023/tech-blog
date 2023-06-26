import { Dispatch, SetStateAction, useEffect, useRef } from "react"
import "./InputOutlined.scss"

interface Props {
  state: [string, Dispatch<SetStateAction<string>>]
}

const InputOutlined = (props: Props) => {
  const [text, setText] = props.state
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    input?.current?.focus()
  }, [])

  return (
    <>
      <div className="input-container  border-radius-2">
        <input
          ref={input}
          value={text}
          className="input body"
          name="name"
          type="text"
          onChange={(e) => {
            setText(e.target.value)
          }}
          placeholder="Type to search"
        />
        <span
          className="icon material-symbols-outlined is-clickable"
          onClick={(_) => {
            setText("")
          }}
        >
          close
        </span>
      </div>
    </>
  )
}

export default InputOutlined
