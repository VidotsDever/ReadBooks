import React, {Component} from 'react';
import {GetBookByID} from '../services/booksService'

export default class BookInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            book: {
                title: '',
                author: '',
                summary: ''
            }
        }
    }

    componentDidMount() {
        GetBookByID(this.props.match.params.book_id).then(res => {
            this.setState({
                book: res
            })
            console.log(this.state.book)
        })
    }

    render() {
        return (
            <div style={{paddingTop: 24, paddingLeft: 180, paddingRight: 180}}>
                <div>
                    <h1 style={{textAlign: 'center'}}>{this.state.book.title}</h1>
                    <h3 style={{textAlign: 'right', marginRight: 12}}>{this.state.book.author}</h3>
                    <p>{this.state.book.summary}</p>
                </div>
            </div>
        )
    }
}