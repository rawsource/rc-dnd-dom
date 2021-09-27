import { useState, useRef } from 'react'

import './App.css'


const App = () => {

  const [state] = useState(
    [
      { id: 1, name: 'drag' },
      { id: 2, name: 'and' },
      { id: 3, name: 'drop' },
      { id: 4, name: 'support' },
      { id: 5, name: 'for' },
      { id: 6, name: 'dom' },
      { id: 7, name: 'nodes' },
      { id: 8, name: 'is' },
      { id: 9, name: 'pretty' },
      { id: 10, name: 'easy' }
    ]
  )

  const insertLocation = useRef(null)

  let target = undefined

  const onDrag = (event) => {
    target = event.target
    requestAnimationFrame(() => {
      target && event.target.classList.add('dim')
    })
  }

  const onDragEnd = (event) => {
    insertLocation.current.classList.remove('display-block')
    target && target.classList.remove('dim')
    target = undefined
  }

  const onDragLeave = (event) => {
    insertLocation.current.classList.remove('display-block')
  }

  const onDragOver = (event) => {
    if (event.target === target) {
      return
    }

    if (!event.target.classList.contains('col') && !event.target.parentNode.classList.contains('col')) {
      return
    }

    event.preventDefault()

    insertLocation.current.classList.add('display-block')

    const rect = event.target.getBoundingClientRect()
    const y = event.clientY - rect.top

    if (y > rect.height / 2) {
      insertLocation.current.style.top = rect.top + rect.height + 'px'
    } else {
      insertLocation.current.style.top = rect.top + 'px'
    }

    insertLocation.current.style.left = rect.left + 'px'
    insertLocation.current.style.width = rect.width + 'px'
  }

  const onDrop = (event) => {
    event.stopPropagation()

    const rect = event.target.getBoundingClientRect()
    const y = event.clientY - rect.top

    try {
      if (event.target.classList.contains('col') && event.target.children.length === 0) {
        event.target.appendChild(target)
        return
      }

      if (event.target.classList.contains('col') && event.target.children.length > 0) {
        event.target.appendChild(target)
        return
      }

      if (event.target.parentNode.classList.contains('col')) {
        if (y > rect.height / 2) {
          event.target.parentNode.insertBefore(target, event.target.nextSibling)
        } else {
          event.target.parentNode.insertBefore(target, event.target)
        }
      }
    } catch (DOMException) {
      return
    }
  }

  return (
    <div className="App">
      <div className="insert-location" ref={insertLocation}></div>
      <div
        className="sortable-list row"
        onDragEnd={onDragEnd}
        onDrop={onDrop}
      >
        <div
          className="col"
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDragEnd={onDragEnd}
          onDrop={onDrop}
        >
          {state.map((item) => (
            <div
              key={item.id}
              data-id={item.id}
              className="custom"
              draggable="true"
              onDrag={onDrag}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDragEnd={onDragEnd}
              onDrop={onDrop}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>
      <div
        className="sortable-list row"
        draggable="true"
        onDrag={onDrag}
        onDragEnd={onDragEnd}
        onDrop={onDrop}
      >
        <div
          className="col"
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDragEnd={onDragEnd}
          onDrop={onDrop}
        >

        </div>
        <div
          className="col"
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDragEnd={onDragEnd}
          onDrop={onDrop}
        >

        </div>
        <div
          className="col"
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDragEnd={onDragEnd}
          onDrop={onDrop}
        >

        </div>
      </div>
      <div
          className="sortable-list row"
          draggable="true"
          onDrag={onDrag}
          onDragEnd={onDragEnd}
          onDrop={onDrop}
        >
          <div
            className="col"
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDragEnd={onDragEnd}
            onDrop={onDrop}
          >

          </div>
          <div
            className="col"
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDragEnd={onDragEnd}
            onDrop={onDrop}
          >

          </div>
        </div>
    </div>
  )
}

export default App
