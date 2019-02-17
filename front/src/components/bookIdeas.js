import React, {Component} from 'react';
import {ListIdeas, AddIdea, RemoveIdea} from '../services/booksService'
import {Input, Button, message, Icon, Modal} from 'antd';
const {TextArea} = Input;
const confirm = Modal.confirm;

export default class BookIdeas extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ideas: [],
            idea: ''
        }
    }

    componentDidMount() {
        ListIdeas(this.props.match.params.book_id).then(res => {
            this.setState({
                ideas: res
            })
        })
    }

    _ideaChange = (e) => {
        this.setState({
            idea: e.target.value
        })
    }

    _addIdea = (e) => {
        if(this.state.idea === "") {
            message.info("提交的内容不能为空")
            return
        }
        AddIdea(this.props.match.params.book_id, this.state.idea).then(res => {
            this.setState({
                ideas: [res, ...this.state.ideas],
                idea: ""
            })
        })
    }

    _deleteIdea = (idea_id) => {
        const that = this;
        confirm({
            title: '你确认要删除该想法吗？',
            content: '',
            okText: "删除",
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                RemoveIdea(idea_id).then(res => {
                    that.setState({
                        ideas: that.state.ideas.filter(idea => {
                            return idea.id != idea_id
                        })
                    })
                })
            },
            onCancel() {

            }
        })
    }

    render() {
        const ideasContent = this.state.ideas.map((idea, index) => {
            return (
                <div key={index} style={{textAlign: 'center', fontSize: 18, marginBottom: 24, backgroundColor: 'white'}}>
                    {idea.content} <Icon onClick={e => this._deleteIdea(idea.id)} style={{color: 'orange'}} type="delete" />
                </div>
            )
        })
        return (
            <div style={{paddingTop: 24, paddingLeft: 64, paddingRight: 64}}>
                <TextArea value={this.state.idea} onChange={this._ideaChange} style={{resize: 'none'}} placeholder="在这里写下你的想法" rows={4}/>
                <Button onClick={this._addIdea} style={{marginTop: 16, marginBottom: 16}}>提交</Button>
                <div>
                    {ideasContent}
                </div>
            </div>
        )
    }
}