import React, { useEffect, useState } from 'react'
import { Input, Button, Row, Col, Card, Modal, Form } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { EditFilled, DeleteFilled, ExclamationCircleOutlined } from '@ant-design/icons'


const App = () => {

  const [form] = Form.useForm()
  const [editData, setEditData] = useState({})
  const [todoList, setTodoList] = useState(() => {
    const todoSession = sessionStorage.getItem('todoListData')
    const todoArray = JSON.parse(todoSession)

    return todoArray || []
  })
  const [state, setState] = useState({
    stateEdit: false,
    steteReading: false
  })

  const CardbodyStyle = {
    padding: 10
  }

  useEffect(() => {
    sessionStorage.setItem('todoListData', JSON.stringify(todoList));

  }, [todoList]);


  const handleSubmit = async (todoText) => {
    await form.validateFields()
    form.resetFields()
    setTodoList([...todoList, { id: uuidv4(), content: todoText.input && todoText.input }])
  }

  const handleEdit = (value) => {
    setState({ ...state, stateEdit: true })
    setEditData(value)
  }

  const handleEditComplete = () => {
    setState({ ...state, stateEdit: false })
    let temp = todoList.map(items => (editData.id === items.id ? { ...items, content: editData.content } : items))
    setTodoList(temp)
    sessionStorage.setItem('todoListData', JSON.stringify(temp));
  }

  const handleDelete = (value) => {
    const submitDelete = () => {
      let tempDel = todoList.filter(fil => value.id !== fil.id)
      setTodoList(tempDel)
      sessionStorage.setItem('todoListData', JSON.stringify(tempDel));
    }

    Modal.confirm({
      title: 'Are you sure delete this todo List?',
      icon: <ExclamationCircleOutlined />,
      content: value.content,
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => submitDelete(),
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const handleReading = (value) => {
    let tempRead = todoList.map(items => (value.id === items.id ? { ...items, reading: true } : items))

    setTodoList(tempRead)
    sessionStorage.setItem('todoListData', JSON.stringify(tempRead));
  }

  return <>

    <div className='container'>
      <div className="formInput">
        <Row><Col><h1>Todo List</h1></Col></Row>

        <Form
          form={form}
          name="todo"
          onFinish={handleSubmit}
          layout="inline"
        >
          <Form.Item
            name="input"
            rules={[{ required: true, message: 'Please add todo-List' }]}
          >
            <Input
              className='styleInput'
              placeholder="add a Todo-List"
            // onChange={(event) => setAddTodoList(event.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType='submit'>List</Button>
          </Form.Item>
        </Form>
      </div>

      <div className='todoListCard'>
        {todoList && todoList.map((items, i) => {
          return <Row key={i}>
            <Col>
              <Card
                bordered
                hoverable
                style={{
                  margin: "10px",
                  borderRadius: 10,
                  minWidth: 500,
                  backgroundColor: items.reading === true ? "yellowgreen" : "none"
                }}
                bodyStyle={CardbodyStyle}
                onClick={() => handleReading(items)}
              >
                <Row justify='space-between' align='middle'>
                  <Col> {items.content}</Col>
                </Row>
              </Card>

            </Col>
            <Row className='CardButton'>
              <Col>
                <Button type='primary' shape='circle' style={{ background: "#ffcc00", border: 0, marginRight: 5 }} onClick={() => handleEdit(items)} ><EditFilled /></Button>
                <Button type='danger' shape='circle' onClick={() => handleDelete(items)}><DeleteFilled /></Button>
              </Col>
            </Row>
          </Row>
        })}
      </div>

      {
        state.stateEdit &&
        <Modal
          title="Edit TodoList"
          visible={state.stateEdit}
          onOk={handleEditComplete}
          onCancel={() => setState({ ...state, stateEdit: false })}
        >
          <Input
            defaultValue={editData.content}
            onChange={(event) => setEditData({ id: editData.id, content: event.target.value })}
          />
        </Modal>
      }
    </div>
  </>

}

export default App