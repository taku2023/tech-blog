import { useEffect, useRef } from "react"
import "./InputOutlined.scss"

interface Props {
  //state: [string, Dispatch<SetStateAction<string>>]
  callback: (text?: string) => void
}

const InputOutlined = ({ callback }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)

  let emitFn: NodeJS.Timeout | undefined = undefined

  /**
   * detect input end if 700ms 
   */
  const handle = (_: Event) => {
    if (emitFn) clearTimeout(emitFn)
    emitFn = setTimeout(() => {
      callback(inputRef?.current?.value)
    }, 700)
  }

  useEffect(() => {
    inputRef?.current?.focus()
    inputRef.current?.addEventListener("input", handle)
    return () => inputRef.current?.removeEventListener("input", handle)
  }, [])

  return (
    <>
      <div className="input-container  border-radius-2">
        <input
          ref={inputRef}
          className="input body"
          name="name"
          type="text"
          placeholder="Type to search"
        />
        <span
          className="icon material-symbols-outlined is-clickable"
          onClick={(_) => {
            if (inputRef.current?.value) {
              inputRef.current.value = ""
            }
          }}
        >
          close
        </span>
      </div>
    </>
  )
}

export default InputOutlined
