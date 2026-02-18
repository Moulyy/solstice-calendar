import { createDateTimePicker } from "../../dist/index.js"

const monthEl = document.querySelector("#month")
const gridEl = document.querySelector("#grid")
const valueEl = document.querySelector("#value")
const dateInputEl = document.querySelector("#date-input")
const timeInputEl = document.querySelector("#time-input")
const prevButtonEl = document.querySelector("#prev")
const nextButtonEl = document.querySelector("#next")

const picker = createDateTimePicker({
  defaultValue: "2024-05-15T10:30",
  defaultVisibleMonth: "2024-05-01",
  weekStartsOn: 1,
  nowDate: "2024-05-15"
})

const render = () => {
  const state = picker.getState()

  monthEl.textContent = state.visibleMonth.slice(0, 7)
  valueEl.textContent = `value: ${state.value ?? "null"}`

  const dateInput = picker.getDateInputProps()
  const timeInput = picker.getTimeInputProps()

  dateInputEl.value = dateInput.value
  timeInputEl.value = timeInput.value

  gridEl.innerHTML = ""

  for (const cell of picker.getCalendarGrid()) {
    const dayProps = picker.getDayProps(cell.date)
    const button = document.createElement("button")

    button.type = "button"
    button.textContent = cell.date.slice(8)
    button.disabled = Boolean(dayProps.disabled)
    button.dataset.selected = String(dayProps["aria-selected"])
    button.dataset.today = String(cell.isToday)
    button.tabIndex = dayProps.tabIndex

    button.addEventListener("click", () => {
      dayProps.onPress()
      render()
    })

    button.addEventListener("keydown", (event) => {
      dayProps.onKeyDown?.(event.key)
      render()
    })

    gridEl.appendChild(button)
  }
}

const prevButtonProps = picker.getPrevMonthButtonProps()
const nextButtonProps = picker.getNextMonthButtonProps()

prevButtonEl.addEventListener("click", () => {
  prevButtonProps.onPress()
  render()
})

nextButtonEl.addEventListener("click", () => {
  nextButtonProps.onPress()
  render()
})

dateInputEl.addEventListener("change", (event) => {
  const value = event.target.value
  picker.getDateInputProps().onChange(value)
  render()
})

timeInputEl.addEventListener("change", (event) => {
  const value = event.target.value
  picker.getTimeInputProps().onChange(value)
  render()
})

let controlledValue = "2024-06-10T08:00"

const controlledValueEl = document.querySelector("#controlled-value")
const controlledInputEl = document.querySelector("#controlled-input")

const controlledPicker = createDateTimePicker({
  value: controlledValue,
  onValueChange: (next) => {
    controlledValue = next
    syncControlled()
  }
})

const syncControlled = () => {
  controlledInputEl.value = controlledValue
  controlledValueEl.textContent = `controlled value: ${controlledValue}`
}

controlledInputEl.addEventListener("change", (event) => {
  const next = event.target.value
  controlledPicker.getDateTimeInputProps().onChange(next)
})

syncControlled()
render()
