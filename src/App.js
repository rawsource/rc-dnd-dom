import { useState, useRef } from 'react'

import './App.css'

const Component = ({ item, onDrag }) => {
  return (
    <div
      className="item"
      draggable="true"
      onDrag={onDrag}
    >
      {item.data.name}
    </div>
  )
}

const Row = ({ item: { children }, onDrag }) => {
  return (
    <div
      className="row"
      draggable="true"
      onDrag={onDrag}
    >
      {children.map(item => (
        <Column
          key={item.id}
          item={item}
          onDrag={onDrag}
        />
      ))}
    </div>
  )
}

const Column = ({ item: { children }, onDrag }) => {
  return (
    <div
      className="col"
    >
      {children.map(item => (
        <Select key={item.id} item={item} onDrag={onDrag} />
      ))}
    </div>
  )
}

const Select = ({ item, onDrag }) => {
  switch (item.type) {
    case 'component':
      return item.component && <Component item={item.component} onDrag={onDrag} />
    case 'row':
      return <Row item={item} onDrag={onDrag} />
    default:
      return null
  }
}

const GridRenderer = ({ data, onDrag, onDragOver, onDragLeave, onDragEnd, onDrop }) => (
  <div
    className="row display-block"
    onDragEnd={onDragEnd}
    onDrop={onDrop}
  >
    <div
      className="col"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      {data.map(item => (
        <Select key={item.id} item={item} onDrag={onDrag} />
      ))}
    </div>
  </div>
)


const App = () => {

  const [ data ] = useState(
    [
      {
        "component": {
          "data": {
            "name": "Item 1"
            },
            "type": "BasicWidget"
        },
        "type": "component",
        "id": 5
      },
      {
        "type": "row",
        "id": 1,
        "children": [
          {
            "type": "column",
            "id": 2,
            "children": [
              {
                "component": {
                  "data": {
                    "name": "Item 2"
                    },
                    "type": "BasicWidget"
                },
                "type": "component",
                "id": 3
              },
              {
                "type": "row",
                "id": 6,
                "children": [
                  {
                    "type": "column",
                    "id": 7,
                    "children": [
                      {
                        "component": {
                          "data": {
                            "name": "Item 3"
                            },
                            "type": "BasicWidget"
                        },
                        "type": "component",
                        "id": 8
                      }
                    ]
                  },
                  {
                    "type": "column",
                    "id": 4,
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "type": "column",
            "id": 4,
            "children": []
          }
        ]
      }
    ]
  )

  const [ target, setTarget ] = useState(undefined)
  const insertIndicator = useRef(null)

  const onDrag = (event) => {
    setTarget(event.target)
    requestAnimationFrame(() => {
      target && event.target.classList.add('dim')
    })
  }

  const onDragEnd = (event) => {
    target && target.classList.remove('dim')
    insertIndicator.current.classList.remove('active')
    setTarget(undefined)
  }

  const onDragLeave = (event) => {
    insertIndicator.current.classList.remove('active')
  }

  const onDragOver = (event) => {
    event.preventDefault()

    if (event.target === target) {
      return
    }

    if (!event.target.classList.contains('col') && !event.target.parentNode.classList.contains('col')) {
      return
    }

    insertIndicator.current.classList.add('active')

    const rect = event.target.getBoundingClientRect()
    const scrollY = Math.round(window.scrollY)
    const y = event.clientY - rect.top

    if (y > rect.height / 2) {
      insertIndicator.current.attributeStyleMap.set('top', CSS.px(rect.top + scrollY + rect.height))
    } else {
      insertIndicator.current.attributeStyleMap.set('top', CSS.px(rect.top + scrollY))
    }

    insertIndicator.current.attributeStyleMap.set('left', CSS.px(rect.left))
    insertIndicator.current.attributeStyleMap.set('width', CSS.px(rect.width))
  }

  const onDrop = (event) => {
    event.stopPropagation()

    const rect = event.target.getBoundingClientRect()
    const y = event.clientY - rect.top

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
  }

  return (
    <div className="App">
      <GridRenderer
        data={data}
        onDrag={onDrag}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDragEnd={onDragEnd}
        onDrop={onDrop}
      />
      <div className="insert-indicator" ref={insertIndicator}></div>
    </div>
  )
}

export default App
