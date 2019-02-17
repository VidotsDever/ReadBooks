import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import BookList from '../components/bookList';
import BookContainer from './bookContainer';

export default class RootContainer extends Component {

    render() {
        return (
            <div>
                <Route exact path={this.props.match.path} component={BookList}/>
                <Route path={`${this.props.match.path}/:book_id`} component={BookContainer}/>
            </div>
        )
    }
}