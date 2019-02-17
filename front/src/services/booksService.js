import axios from "./httpManager";
import qs from 'qs';

let base = "http://localhost:8080";

let postHeader = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}

let putHeader = {
    headers: {
        method: 'PUT'
    }
}

let deleteHeader = {
    headers: {
        method: 'DELETE'
    }
}

export const ListBooks = () => {
    return axios.get(`${base}/books`).then( result => {
        return result.data
    })
}

export const UpdateBook = (book_id, title, author, summary) => {
    const data = qs.stringify({
        book_id: book_id,
        title: title,
        author: author,
        summary: summary
    })
    return axios.put(`${base}/books`, data, putHeader).then(result => {
        return result.data
    })
}

export const DeleteBook = (book_id) => {
    let config = {
        params:  {
            book_id: book_id
        }, 
        headers: {
            'Content-Type': 'application/json'
        }
    }
    return axios.delete(`${base}/books`, config).then(result => {
        return result.data
    })
}

export const AddBook = (title, author, summary) => {
    const data = qs.stringify({
        title: title,
        author: author,
        summary: summary
    })
    return axios.post(`${base}/books`,data, postHeader).then( result => {
        return result.data
    })
}

export const GetBookByID = book_id => {
    return axios.get(`${base}/books/${book_id}`).then(result => {
        return result.data
    })
}

export const ListExcerts = (book_id) => {
    return axios.get(`${base}/books/${book_id}/excerts`).then(result => {
        return result.data
    })
}

export const AddExcert = (book_id, content) => {
    const data = qs.stringify({
        content: content
    })

    return axios.post(`${base}/books/${book_id}/excerts`, data, postHeader).then( result => {
        return result.data
    })
}

export const RemoveExcert = (excert_id) => {
    return axios.get(`${base}/excerts?excert_id=${excert_id}`).then(result => {
        return result.data
    })
}

export const ListIdeas = (book_id) => {
    return axios.get(`${base}/books/${book_id}/ideas`).then(result => {
        return result.data
    })
}

export const AddIdea = (book_id, content) => {
    const data = qs.stringify({
        content: content
    })

    return axios.post(`${base}/books/${book_id}/ideas`, data, postHeader).then( result => {
        return result.data
    })
}

export const RemoveIdea = (idea_id) => {
    return axios.get(`${base}/ideas?idea_id=${idea_id}`).then(result => {
        return result.data
    })
}