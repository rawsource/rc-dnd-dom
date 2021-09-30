import { useState, useEffect, useRef } from 'react'

import './App.css'

const Component = ({ item, onDrag }) => {
  return (
    <div
      className="item"
      draggable="true"
      data-id={item.id}
      onDrag={onDrag}
    >
      {item.component.data.name}
    </div>
  )
}

const Row = ({ item, onDrag, onClick }) => {
  return (
    <div
      className="row"
      draggable="true"
      data-id={item.id}
      onDrag={onDrag}
      onClick={onClick}
    >
      {item.children.map(item => (
        <Column
          key={item.id}
          item={item}
          onDrag={onDrag}
        />
      ))}
    </div>
  )
}

const Column = ({ item, onDrag, onClick }) => {
  return (
    <div
      className="col"
      data-id={item.id}
    >
      {item.children.map(item => (
        <Select key={item.id} item={item} onDrag={onDrag} onClick={onClick} />
      ))}
    </div>
  )
}

const Select = ({ item, onDrag, onClick }) => {
  switch (item.type) {
    case 'component':
      return item.component && <Component item={item} onDrag={onDrag} />
    case 'row':
      return <Row item={item} onDrag={onDrag} onClick={onClick} />
    default:
      return null
  }
}

const GridRenderer = ({ data, onDrag, onDragOver, onDragLeave, onDragEnd, onDrop, onClick }) => (
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
        <Select key={item.id} item={item} onDrag={onDrag} onClick={onClick} />
      ))}
    </div>
  </div>
)


const App = () => {

  const [ data, setData ] = useState([])
  const [ target, setTarget ] = useState(undefined)
  const [ activeItem, setActiveItem ] = useState(undefined)

  const insertIndicator = useRef(null)

  useEffect(() => {
    setData(JSON.parse(localStorage.getItem('layout')))
  }, [])

  const onDrag = (event) => {
    setTarget(event.target)
    event.target.classList.add('dim')
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

    if (event.target.classList.contains('col')) {
      const res1 = findItem(data, target.dataset.id)
      const item = res1.items[res1.index]

      const res2 = findItem(data, event.target.dataset.id)
      if (res2) {
        res1.items.splice(res1.index, 1)
        if (y > rect.height / 2) {
          res2.items[res2.index].children.push(item)
        } else {
          res2.items[res2.index].children.unshift(item)
        }
      }
    }
    else if (event.target.parentNode.classList.contains('col')) {
      const res1 = findItem(data, target.dataset.id)
      const item = res1.items[res1.index]

      const res2 = findItem(data, event.target.dataset.id)
      if (res2) {
        res1.items.splice(res1.index, 1)
        if (y > rect.height / 2) {
          res2.items.splice(res2.index + 1, 0, item)
        } else {
          res2.items.splice(res2.index, 0, item)
        }
      }
    }

    onDragEnd(event)

    localStorage.setItem('layout',  JSON.stringify(data))

    setData([...data])
  }

  const onClick = (event) => {
    const res = findItem(data, event.target.dataset.id)
    const item = res.items[res.index]

    if (item.type === 'component') {

    } else if (item.type === 'row') {

    }

    // if (event.target.classList.contains('row')) {
    //   const res = findItem(data, event.target.dataset.id)
    //   res.items[res.index].children.push({ type: 'column', id: crypto.randomUUID(), children: [] })
    //   setData([...data])
    // }
  }

  const _findItem = (item, id) => {
    if (item.children != null) {
      for (let i = 0; i < item.children.length; i++) {
        if (item.children[i].id === id) {
          return {items: item.children, index: i}
        }
        let result = _findItem(item.children[i], id)
        if (result) {
          return result
        }
      }
    }
    return null
  }

  const findItem = (items, id) => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === id) {
        return {items: items, index: i}
      }
      let result = _findItem(items[i], id)
      if (result) {
        return result
      }
    }
    return null
  }

  return (
    <div className="App">
      <div className="editor">
        <div className="layout-pane">
          <GridRenderer
            data={data}
            onDrag={onDrag}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDragEnd={onDragEnd}
            onDrop={onDrop}
            onClick={onClick}
          />
          <div className="insert-indicator" ref={insertIndicator}></div>
        </div>
        <div className="properties-pane"></div>
      </div>
    </div>
  )
}

export default App


// [{"component":{"data":{"name":"Item 3"},"type":"BasicWidget"},"type":"component","id":"a09e99a6-121a-42b3-ab60-bb6cad7545f4"},{"type":"row","id":"fe41a012-8079-4458-bf38-7f4d07b6a05b","children":[{"type":"column","id":"4a1b25a2-7780-4bc8-90eb-808202802825","children":[]},{"type":"column","id":"ac62583f-cc0a-43c7-849e-f5696b3a44f5","children":[{"type":"row","id":"cb875c3b-1053-4800-99fa-fd03d211594f","children":[{"type":"column","id":"28aa1a9b-7604-4d1a-a738-f5b75110c8c6","children":[{"component":{"data":{"name":"Item 1"},"type":"BasicWidget"},"type":"component","id":"8d12f736-bc11-4a03-8c83-95c3a3b3e982"}]},{"type":"column","id":"1a704410-d2a4-414c-9a78-d26d1fd6a393","children":[{"component":{"data":{"name":"Item 2"},"type":"BasicWidget"},"type":"component","id":"58283438-460b-4f56-8ea1-dc5a8775d9f4"}]}]}]},{"type":"column","id":"ebb71138-112c-4e2d-8466-2333cdb9cc1d","children":[]}]},{"type":"row","id":"a7140653-1eb7-4766-8132-32772bbc5893","children":[{"type":"column","id":"c4d05324-b33a-464c-80e2-796a7e329467","children":[]},{"type":"column","id":"e96787b6-bdaf-4dcf-9ada-de699d2e00fc","children":[]}]}]
