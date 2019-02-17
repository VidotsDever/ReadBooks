import React, {Component} from 'react';
import {ListExcerts, AddExcert, RemoveExcert} from '../services/booksService'
import {Input, Button, message, Icon, Modal} from 'antd';
const {TextArea} = Input;
const confirm = Modal.confirm;


export default class BookExcerts extends Component {

    constructor(props) {
        super(props)
        this.state = {
            excerts: [],
            excert: ''
        }
    }

    componentDidMount() {
        ListExcerts(this.props.match.params.book_id).then(res => {
            this.setState({
                excerts: res
            })
        })
    }

    _excertChange = (e) => {
        this.setState({
            excert: e.target.value
        })
    }

    _addExcert = (e) => {
        if(this.state.excert === "") {
            message.info("提交的内容不能为空")
            return
        }
        AddExcert(this.props.match.params.book_id, this.state.excert).then(res => {
            this.setState({
                excerts: [res, ...this.state.excerts],
                excert: ""
            })
        })
    }

    _deleteExcert = (excert_id) => {
        const that = this;
        confirm({
            title: '你确认要删除该文章片段吗？',
            content: '',
            okText: "删除",
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                RemoveExcert(excert_id).then(res => {
                    that.setState({
                        excerts: that.state.excerts.filter(excert => {
                            return excert.id != excert_id
                        })
                    })
                })
            },
            onCancel() {

            }
        })
    }

    render() {
        const excertsContent = this.state.excerts.map((excert, index) => {
            return (
                <div key={index} style={{textAlign: 'center', fontSize: 18, marginBottom: 24, backgroundColor: 'white'}}>
                    {excert.content} <Icon onClick={e => this._deleteExcert(excert.id)} style={{color: 'orange'}} type="delete" />
                </div>
            )
        })
        return (
            <div style={{paddingTop: 24, paddingLeft: 64, paddingRight: 64}}>
                <TextArea value={this.state.excert} onChange={this._excertChange} style={{resize: 'none'}} placeholder="在这里写下文章的精彩部分" rows={4}/>
                <Button onClick={this._addExcert} style={{marginTop: 16, marginBottom: 16}}>提交</Button>
                <div>
                    {excertsContent}
                </div>
            </div>
        )
    }
}