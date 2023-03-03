import React, { useState, useEffect, useContext } from 'react'

import { Link, useLocation, useParams, useHistory } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight,
  faFastForward,
  faFastBackward,
} from '@fortawesome/free-solid-svg-icons'

import Loading from '../../layout/Loading'
import { ContentPanel } from '../Modules'

import { AuthContext } from '../../App'

import CommentForm from './CommentForm'
import { PaginationLinks } from './CommentSection'
import Comment from './Comment'

const useQuery = () => {
  return new URLSearchParams(useLocation().search)
}

import styled from 'styled-components'

const BackButton = styled(Link)`
  cursor: pointer;
  border: none;
  border-radius: 6px;
  background: none;
  margin-right: 5px;
  font-size: 48px;
  color: black;
  padding: 5px;

  &:hover {
    background-color: #eee;
  }
`

export default (props) => {
  const [data, setData] = useState(null)
  const query = useQuery()
  const { violation } = useParams()
  const history = useHistory()

  const { authGet } = useContext(AuthContext)

  useEffect(() => {
    let url = `/violations/${violation}/comments`
    const page = query.get('page')
    const limit = query.get('limit')

    if (page || limit) url += '?'

    if (page) url += `page=${page}`
    if (limit) url += `limit=${limit}`

    authGet(url).then((res) => {
      setData(res.data)
    })
  }, [query.get('page')])

  const renderLinks = () => {
    const firstAvail = data.meta.currentPage !== 1
    const lastAvail = data.meta.currentPage !== data.meta.totalPages
    const nextAvail = data.links.next
    const prevAvail = data.links.previous

    const nextPage = data.meta.currentPage + 1
    const prevPage = data.meta.currentPage - 1

    return (
      <PaginationLinks>
        <Link
          className={firstAvail ? '' : 'disabled'}
          to={`/violation/${violation}/comments?page=${1}&limit=20`}
        >
          <FontAwesomeIcon icon={faFastBackward} /> Първа
        </Link>
        <Link
          className={prevAvail ? '' : 'disabled'}
          to={`/violation/${violation}/comments?page=${prevPage}&limit=20`}
        >
          <FontAwesomeIcon icon={faChevronLeft} /> Предишна
        </Link>
        <div
          style={{
            margin: '0 5px',
            display: 'inline-block',
            color: '#444',
            width: '60px',
          }}
        >
          {data.meta.currentPage} / {data.meta.totalPages}
        </div>
        <Link
          className={nextAvail ? '' : 'disabled'}
          to={`/violation/${violation}/comments?page=${nextPage}&limit=20`}
        >
          Следваща <FontAwesomeIcon icon={faChevronRight} />
        </Link>
        <Link
          className={lastAvail ? '' : 'disabled'}
          to={`/violation/${violation}/comments?page=${data.meta.totalPages}&limit=20`}
        >
          Последна <FontAwesomeIcon icon={faFastForward} />
        </Link>
      </PaginationLinks>
    )
  }

  const newComment = (comment) => {
    if (!query.get('page') || query.get('page').toString() === '1') {
      if (data.items.length < data.meta.itemsPerPage) {
        setData({
          ...data,
          meta: { ...data.meta, totalItems: data.meta.totalItems + 1 },
          items: [comment, ...data.items],
        })
      } else if (data.meta.totalItems === data.meta.itemsPerPage) {
        history.push(`/violation/${violation}/comments?page=1&limit=20`)
      } else {
        let newItems = [comment, ...data.items].slice(0, data.meta.itemsPerPage)
        setData({
          ...data,
          meta: { ...data.meta, totalItems: data.meta.totalItems + 1 },
          items: newItems,
        })
      }
    } else {
      history.push(`/violation/${violation}/comments?page=1&limit=20`)
    }
  }

  return (
    <ContentPanel>
      <h1>
        <BackButton to={`/violation/${violation}`}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </BackButton>
        <span
          style={{
            verticalAlign: 'top',
            marginTop: '10px',
            display: 'inline-block',
          }}
        >
          Всички коментари
          {!data ? null : ` (${data.meta.totalItems})`}
        </span>
      </h1>
      <hr />
      <CommentForm newComment={newComment} />
      {!data ? (
        <Loading />
      ) : (
        [
          data.meta.totalPages > 1 ? renderLinks() : null,
          data.items.map((comment) => [<Comment comment={comment} />, <hr />]),
          data.meta.totalPages > 1 ? renderLinks() : null,
        ]
      )}
    </ContentPanel>
  )
}
