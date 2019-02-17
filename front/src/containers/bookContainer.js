import React, {Component} from 'react';
import {Row, Col} from 'antd'
import {Route, Link} from 'react-router-dom';
import BookInfo from '../components/bookInfo';
import BookExcerts from '../components/bookExcerts';
import BookIdeas from '../components/bookIdeas';

export default class BookContainer extends Component {

    render() {
        return (
            <div>
                <Row>
                    <Col xs={24} sm={4}>
                        <div style={{fontSize: 20,backgroundColor: 'white', padding: 12, margin: 12, textAlign: 'center'}}>
                            <div style={{marginBottom: 24}}><Link to={`${this.props.match.url}`}>书籍信息</Link></div>
                            <div style={{marginBottom: 24}}><Link to={`${this.props.match.url}/excerts`}>摘抄片段</Link></div>
                            <div style={{marginBottom: 24}}><Link to={`${this.props.match.url}/ideas`}>记录想法</Link></div>
                            <div style={{marginBottom: 24}}><Link to="/">书籍列表</Link></div>
                        </div>
                    </Col>
                    <Col xs={24} sm={20}>
                        <Route exact path={this.props.match.path} component={BookInfo}/>
                        <Route path={`${this.props.match.path}/excerts`} component={BookExcerts}/>
                        <Route path={`${this.props.match.path}/ideas`} component={BookIdeas}/>
                    </Col>
                </Row>
            </div>
        )
    }
}