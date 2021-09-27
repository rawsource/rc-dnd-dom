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

  const dragstart = (event) => {
    target = event.target
    requestAnimationFrame(() => {
      if (target) {
        event.target.classList.add('dim')
      }
    })
  }

  const dragend = (event) => {
    insertLocation.current.style.display = 'none'
    if (target) {
      event.target.classList.remove('dim')
    }
    target = undefined
  }

  const dragleave = (event) => {
    insertLocation.current.style.display = 'none'
  }

  const dragover = (event) => {
    if (event.target === target) {
      return
    }

    if (!event.target.classList.contains('col') && !event.target.parentNode.classList.contains('col')) {
      return
    }

    event.preventDefault()

    insertLocation.current.style.display = 'block'

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

  const drop = (event) => {
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
        onDragEnd={dragend}
        onDrop={drop}
      >
        <div
          className="col"
          onDragOver={dragover}
          onDragLeave={dragleave}
          onDragEnd={dragend}
          onDrop={drop}
        >
          {state.map((item) => (
            <div
              key={item.id}
              data-id={item.id}
              className="custom"
              draggable="true"
              onDrag={dragstart}
              onDragOver={dragover}
              onDragLeave={dragleave}
              onDragEnd={dragend}
              onDrop={drop}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>
      <div
        className="sortable-list row"
        draggable="true"
        onDrag={dragstart}
        onDragEnd={dragend}
        onDrop={drop}
      >
        <div
          className="col"
          onDragOver={dragover}
          onDragLeave={dragleave}
          onDragEnd={dragend}
          onDrop={drop}
        >

        </div>
        <div
          className="col"
          onDragOver={dragover}
          onDragLeave={dragleave}
          onDragEnd={dragend}
          onDrop={drop}
        >

        </div>
        <div
          className="col"
          onDragOver={dragover}
          onDragLeave={dragleave}
          onDragEnd={dragend}
          onDrop={drop}
        >

        </div>
      </div>
      <div
          className="sortable-list row"
          draggable="true"
          onDrag={dragstart}
          onDragEnd={dragend}
          onDrop={drop}
        >
          <div
            className="col"
            onDragOver={dragover}
            onDragLeave={dragleave}
            onDragEnd={dragend}
            onDrop={drop}
          >

          </div>
          <div
            className="col"
            onDragOver={dragover}
            onDragLeave={dragleave}
            onDragEnd={dragend}
            onDrop={drop}
          >

          </div>
        </div>
    </div>
  )
}

export default App
