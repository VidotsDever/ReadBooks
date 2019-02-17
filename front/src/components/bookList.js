import React, { Component } from "react";
import { ListBooks, AddBook, UpdateBook, DeleteBook } from "../services/booksService";
import {Button, Modal, Row, Col, Input, Icon } from 'antd';
import { message } from "antd";
const confirm = Modal.confirm;
const {TextArea}  = Input;

export default class BookList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            books: [],
            visible: false,
            isEditing: false,
            book_title: '',
            book_author: '',
            book_summary: '',
            book_id: 0
        };
    }

    componentDidMount() {
        ListBooks().then(res => {
            this.setState({
                books: res
            })
        })
    }

    _showModal = (e) => {
        this.setState({
            visible: true
        })
    }

    _titleChange = (e) => {
        this.setState({
            book_title: e.target.value
        })
    }

    _authorChange = (e) => {
        this.setState({
            book_author: e.target.value
        })
    }

    _summaryChange = (e) => {
        this.setState({
            book_summary: e.target.value
        })
    }

    _handleOk = (e) => {
        if(this.state.book_author === "" || this.state.book_title === "" || this.state.book_summary === "") {
            message.info("书籍信息不能为空")
            return
        }
        if(this.state.isEditing) {
            UpdateBook(this.state.book_id, this.state.book_title, this.state.book_author, this.state.book_summary).then(res => {
                let books = this.state.books
                books.forEach(book => {
                    if(this.state.book_id === book.id) {
                        book.title = this.state.book_title
                        book.author = this.state.book_author
                        book.summary = this.state.book_summary
                    }
                })
                this.setState({
                    books: books
                })
                this._hideModal()
            })
        } else {
            AddBook(this.state.book_title, this.state.book_author, this.state.book_summary).then(res => {
                this.setState({
                    books: [res, ...this.state.books]
                })
                this._hideModal()
            })
        }
        
    }

    _handleCancel = (e) => {
        this._hideModal()
    }

    _clickBook = (book_id) => {
        this.props.history.push(`/books/${book_id}`)
    }

    _deleteBook = (e, book_id) => {
        e.stopPropagation()
        const that = this;
        confirm({
            title: '你确认要删除该书籍吗？',
            content: '',
            okText: "删除",
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                DeleteBook(book_id).then(res => {
                    that.setState({
                        books: that.state.books.filter(book => {
                            return book.id != book_id
                        })
                    })
                })
            },
            onCancel() {

            }
        })
    }

    _editBook = (e, book) => {
        e.stopPropagation()
        this.setState({
            visible: true,
            isEditing: true,
            book_title: book.title,
            book_author: book.author,
            book_summary: book.summary,
            book_id: book.id
        })
    }

    _hideModal = () => {
        this.setState({
            visible: false,
            isEditing: false,
            book_title: "",
            book_author: "",
            book_summary: ""
        })
    }

    render() {
        const booksContent = this.state.books.map(book => {
            return (
                <Col xs={24} sm={8} style={{height: 88,padding: 24, marginBottom: 12}}>
                    <div onClick={e => this._clickBook(book.id)} style={{backgroundColor: 'white', textAlign: 'center', padding: 6}}>
                        <div style={{fontSize: 18, marginBottom: 8}}>{book.title}</div>
                        <div>{book.author}</div>
                        <div style={{textAlign: 'right'}}>
                            <Icon onClick={e => this._editBook(e, book)} style={{marginRight: 12}} type="edit" />
                            <Icon onClick={e => this._deleteBook(e, book.id)} style={{marginRight: 12}} type="delete" />
                        </div>
                    </div>
                </Col>
            )
        })
        return (
            <div>
                <Row>
                    {booksContent}
                </Row>
                <Button onClick={this._showModal} style={{position: "fixed", right: 36, bottom: 36}} icon="plus" size="large"/>
                <Modal onCancel={this._handleCancel} onOk={this._handleOk} visible={this.state.visible} closable={false}>
                    <Row>
                        <Col span={10}>
                            <Input value={this.state.book_title} onChange={this._titleChange} placeholder="输入书籍名称"/>
                        </Col>
                        <Col span={10} offset={2}>
                            <Input value={this.state.book_author} onChange={this._authorChange} placeholder="输入书籍作者"/>
                        </Col>
                    </Row>
                    <Row style={{marginTop: 24}}>
                        <Col span={22}>
                            <TextArea value={this.state.book_summary} onChange={this._summaryChange} rows={6}  style={{resize: 'none'}} placeholder="输入书籍的大概内容"></TextArea>
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }
}